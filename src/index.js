const DB_ACTION_KEY = '__DB_ACTION__';

const logError = (...args) => {
  console.error('[Firebase middleware]', ...args); // eslint-disable-line no-console
};

const isEqual = (obj1, obj2) => {
  if (
    obj1 == null ||
    obj2 == null ||
    typeof obj1 !== 'object' ||
    typeof obj2 !== 'object'
  ) return obj1 === obj2;

  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

  return Object.keys(obj1).reduce((isEq, key) => isEq && isEqual(obj1[key], obj2[key]), true);
};

const getDeepData = (data, path = []) => {
  if (data == null || typeof data !== 'object' || !path.length) return data;

  let key = path.slice(0, 1)[0];
  if (/^\d+$/.test(key)) key = parseInt(key, 10);

  return getDeepData(data[key], path.slice(1));
};

const parseSnapshot = (snapshot) => {
  const list = [];

  snapshot.forEach((childSnapshot) => {
    list.push({
      id: childSnapshot.key,
      ...childSnapshot.val(),
    });
  });

  return list;
};

const getDifference = (oldData, newData) =>
  newData.reduce((changes, item) => {
    const newChanges = Object.assign({}, changes);

    const oldItem = oldData.find(({ id }) => id === item.id);
    const newItem = Object.assign({}, item);

    if (oldItem) {
      newChanges.removed = newChanges.removed.filter(({ id }) => id !== oldItem.id);

      if (!isEqual(oldItem, newItem)) newChanges.edited = newChanges.edited.concat([newItem]);
    } else {
      newChanges.added = newChanges.added.concat([newItem]);
    }

    return newChanges;
  }, {
    added: [],
    edited: [],
    removed: oldData.slice(),
  });

const addIdToActionData = (action, data, id) => {
  let found = false;

  if (Array.isArray(action)) {
    return action.map((actionData) => {
      if (!found && isEqual(actionData, data)) {
        found = true;

        return {
          id,
          ...data,
        };
      }
      if (!found && actionData != null && typeof actionData === 'object') {
        return addIdToActionData(actionData, data, id);
      }
      return actionData;
    });
  }

  return Object.keys(action).reduce((newAction, key) => {
    if (!found && isEqual(action[key], data)) {
      found = true;

      return {
        ...newAction,
        [key]: {
          id,
          ...data,
        },
      };
    }
    if (!found && action[key] != null && typeof action[key] === 'object') {
      return {
        ...newAction,
        [key]: addIdToActionData(action[key], data, id),
      };
    }
    return {
      ...newAction,
      [key]: action[key],
    };
  }, {});
};

export default (config, pathOptsArr) => {
  const {
    firebase,
    reducer,
    privatePath,
    authActions = {},
    onInited = () => {},
  } = config;

  const auth = firebase.auth();
  const database = firebase.database();

  const publicPathOpts = pathOptsArr.filter(({ isPrivate }) => !isPrivate);
  const privatePathOpts = pathOptsArr.filter(({ isPrivate }) => isPrivate);

  let inited = false;
  let currentUser;
  let unsubscribeFns = [];

  const getRefForPath = ({ fbPath, isPrivate }) => {
    if (!isPrivate) return database.ref(fbPath);
    if (!currentUser) return null;
    return database.ref(`${privatePath}/${currentUser.uid}/${fbPath}`);
  };

  const getStateForPath = (state, { storePath }) =>
    getDeepData(state, storePath.split('/'));

  const findItemByIdForPath = (state, id, pathOpts) =>
    getStateForPath(state, pathOpts).find((item) => item.id === id);

  const dbAction = (action, data) => ({
    ...action(data),
    [DB_ACTION_KEY]: true,
  });

  const setupPath = (pathOpts, store) => {
    const { isPrivate, actions } = pathOpts;
    const ref = getRefForPath(pathOpts);

    const initState = getStateForPath(store.getState(), pathOpts);
    if (!initState || typeof initState !== 'object') {
      logError('Path skipped, because no initial state found', pathOpts);
      return Promise.resolve(initState);
    }

    const onceValue = (snapshot) => {
      let data;

      if (Array.isArray(initState)) {
        data = parseSnapshot(snapshot);
        if (data.length) store.dispatch(dbAction(actions.set, data));

        const onChildAdded = (ss) => {
          const item = findItemByIdForPath(store.getState(), ss.key, pathOpts);
          if (!item) store.dispatch(dbAction(actions.add, { id: ss.key, ...ss.val() }));
        };

        const onChildChanged = (ss) => {
          const item = findItemByIdForPath(store.getState(), ss.key, pathOpts);
          const newItem = { id: ss.key, ...ss.val() };
          if (!isEqual(item, newItem)) store.dispatch(dbAction(actions.edit, newItem));
        };

        const onChildRemoved = (ss) => {
          const item = findItemByIdForPath(store.getState(), ss.key, pathOpts);
          if (item) store.dispatch(dbAction(actions.remove, { id: ss.key }));
        };

        ref.on('child_added', onChildAdded);
        ref.on('child_changed', onChildChanged);
        ref.on('child_removed', onChildRemoved);

        if (isPrivate) {
          unsubscribeFns.push(() => {
            ref.off('child_added', onChildAdded);
            ref.off('child_changed', onChildChanged);
            ref.off('child_removed', onChildRemoved);

            store.dispatch(dbAction(actions.unset));
          });
        }
      } else {
        data = snapshot.val();
        if (data) store.dispatch(dbAction(actions.set, data));

        const onValue = (ss) => {
          const value = getStateForPath(store.getState(), pathOpts);
          const newValue = ss.val() || {};
          if (!isEqual(value, newValue)) store.dispatch(dbAction(actions.set, newValue));
        };

        ref.on('value', onValue);

        if (isPrivate) {
          unsubscribeFns.push(() => {
            ref.off('value', onValue);

            store.dispatch(dbAction(actions.unset));
          });
        }
      }

      return data;
    };

    return ref.once('value')
      .then(onceValue);
  };

  const setupPaths = (paths, store) =>
    Promise.all(paths.map((pathOpts) => setupPath(pathOpts, store)));

  const cleanupPaths = () => {
    unsubscribeFns.forEach((usFn) => usFn());
    unsubscribeFns = [];
  };

  return (store) => (next) => {
    const setupPublicPaths = setupPaths(publicPathOpts, store);
    const initSetupPaths = [
      setupPublicPaths,
    ];

    auth.onAuthStateChanged((user) => {
      if (user) {
        currentUser = user;
        if (authActions.set) store.dispatch(authActions.set(user.toJSON()));

        const setupPrivatePaths = setupPaths(privatePathOpts, store);
        if (!inited) initSetupPaths.push(setupPrivatePaths);
      } else {
        currentUser = undefined;
        if (authActions.unset) store.dispatch(authActions.unset());

        cleanupPaths();
      }

      if (!inited) {
        inited = true;
        Promise.all(initSetupPaths).then(() => onInited());
      }
    });

    return (action) => {
      if (Object.prototype.hasOwnProperty.call(action, DB_ACTION_KEY)) return next(action);

      let newAction;
      const dbJobs = [];
      const oldState = store.getState();
      const newState = reducer(oldState, action);

      pathOptsArr.forEach((pathOpts) => {
        const oldData = getStateForPath(oldState, pathOpts);
        if (!oldData) return;

        const newData = getStateForPath(newState, pathOpts);

        if (Array.isArray(oldData)) {
          const { added, edited, removed } = getDifference(oldData, newData);

          added.forEach((data) => {
            const ref = getRefForPath(pathOpts).push();

            newAction = addIdToActionData(newAction || action, data, ref.key);
            dbJobs.push({
              ref,
              method: 'set',
              data,
            });
          });

          edited.forEach(({ id, ...data }) => {
            dbJobs.push({
              ref: getRefForPath(pathOpts).child(id),
              method: 'update',
              data,
            });
          });

          removed.forEach(({ id }) => {
            dbJobs.push({
              ref: getRefForPath(pathOpts).child(id),
              method: 'remove',
            });
          });
        } else if (!isEqual(oldData, newData)) {
          dbJobs.push({
            ref: getRefForPath(pathOpts),
            method: 'set',
            data: newData,
          });
        }
      });

      const result = next(newAction || action);

      dbJobs.forEach(({ ref, method, data }) => {
        ref[method](data);
      });

      return result;
    };
  };
};
