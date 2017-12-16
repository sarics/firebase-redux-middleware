(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["firebaseReduxMiddleware"] = factory();
	else
		root["firebaseReduxMiddleware"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DB_ACTION_KEY = '__DB_ACTION__';

var logError = function logError() {
  var _console;

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  (_console = console).error.apply(_console, ['[Firebase middleware]'].concat(args)); // eslint-disable-line no-console
};

var isEqual = function isEqual(obj1, obj2) {
  if (obj1 == null || obj2 == null || (typeof obj1 === 'undefined' ? 'undefined' : _typeof(obj1)) !== 'object' || (typeof obj2 === 'undefined' ? 'undefined' : _typeof(obj2)) !== 'object') return obj1 === obj2;

  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

  return Object.keys(obj1).reduce(function (isEq, key) {
    return isEq && isEqual(obj1[key], obj2[key]);
  }, true);
};

var getDeepData = function getDeepData(data) {
  var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (data == null || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' || !path.length) return data;

  var key = path.slice(0, 1)[0];
  if (/^\d+$/.test(key)) key = parseInt(key, 10);

  return getDeepData(data[key], path.slice(1));
};

var parseSnapshot = function parseSnapshot(snapshot) {
  var list = [];

  snapshot.forEach(function (childSnapshot) {
    list.push(_extends({
      id: childSnapshot.key
    }, childSnapshot.val()));
  });

  return list;
};

var getDifference = function getDifference(oldData, newData) {
  return newData.reduce(function (changes, item) {
    var newChanges = Object.assign({}, changes);

    var oldItem = oldData.find(function (_ref) {
      var id = _ref.id;
      return id === item.id;
    });
    var newItem = Object.assign({}, item);

    if (oldItem) {
      newChanges.removed = newChanges.removed.filter(function (_ref2) {
        var id = _ref2.id;
        return id !== oldItem.id;
      });

      if (!isEqual(oldItem, newItem)) newChanges.edited = newChanges.edited.concat([newItem]);
    } else {
      newChanges.added = newChanges.added.concat([newItem]);
    }

    return newChanges;
  }, {
    added: [],
    edited: [],
    removed: oldData.slice()
  });
};

var addIdToActionData = function addIdToActionData(action, data, id) {
  var found = false;

  if (Array.isArray(action)) {
    return action.map(function (actionData) {
      if (!found && isEqual(actionData, data)) {
        found = true;

        return _extends({
          id: id
        }, data);
      }
      if (!found && actionData != null && (typeof actionData === 'undefined' ? 'undefined' : _typeof(actionData)) === 'object') {
        return addIdToActionData(actionData, data, id);
      }
      return actionData;
    });
  }

  return Object.keys(action).reduce(function (newAction, key) {
    if (!found && isEqual(action[key], data)) {
      found = true;

      return _extends({}, newAction, _defineProperty({}, key, _extends({
        id: id
      }, data)));
    }
    if (!found && action[key] != null && _typeof(action[key]) === 'object') {
      return _extends({}, newAction, _defineProperty({}, key, addIdToActionData(action[key], data, id)));
    }
    return _extends({}, newAction, _defineProperty({}, key, action[key]));
  }, {});
};

/* harmony default export */ __webpack_exports__["default"] = (function (config, pathOptsArr) {
  var firebase = config.firebase,
      reducer = config.reducer,
      privatePath = config.privatePath,
      _config$authActions = config.authActions,
      authActions = _config$authActions === undefined ? {} : _config$authActions,
      _config$onInited = config.onInited,
      onInited = _config$onInited === undefined ? function () {} : _config$onInited;


  var auth = firebase.auth();
  var database = firebase.database();

  var publicPathOpts = pathOptsArr.filter(function (_ref3) {
    var isPrivate = _ref3.isPrivate;
    return !isPrivate;
  });
  var privatePathOpts = pathOptsArr.filter(function (_ref4) {
    var isPrivate = _ref4.isPrivate;
    return isPrivate;
  });

  var inited = false;
  var currentUser = void 0;
  var unsubscribeFns = [];

  var getRefForPath = function getRefForPath(_ref5) {
    var fbPath = _ref5.fbPath,
        isPrivate = _ref5.isPrivate;

    if (!isPrivate) return database.ref(fbPath);
    if (!currentUser) return null;
    return database.ref(privatePath + '/' + currentUser.uid + '/' + fbPath);
  };

  var getStateForPath = function getStateForPath(state, _ref6) {
    var storePath = _ref6.storePath;
    return getDeepData(state, storePath.split('/'));
  };

  var findItemByIdForPath = function findItemByIdForPath(state, id, pathOpts) {
    return getStateForPath(state, pathOpts).find(function (item) {
      return item.id === id;
    });
  };

  var dbAction = function dbAction(action, data) {
    return _extends({}, action(data), _defineProperty({}, DB_ACTION_KEY, true));
  };

  var setupPath = function setupPath(pathOpts, store) {
    var isPrivate = pathOpts.isPrivate,
        actions = pathOpts.actions;

    var ref = getRefForPath(pathOpts);

    var initState = getStateForPath(store.getState(), pathOpts);
    if (!initState || (typeof initState === 'undefined' ? 'undefined' : _typeof(initState)) !== 'object') {
      logError('Path skipped, because no initial state found', pathOpts);
      return Promise.resolve(initState);
    }

    var onceValue = function onceValue(snapshot) {
      var data = void 0;

      if (Array.isArray(initState)) {
        data = parseSnapshot(snapshot);
        if (data.length) store.dispatch(dbAction(actions.set, data));

        var onChildAdded = function onChildAdded(ss) {
          var item = findItemByIdForPath(store.getState(), ss.key, pathOpts);
          if (!item) store.dispatch(dbAction(actions.add, _extends({ id: ss.key }, ss.val())));
        };

        var onChildChanged = function onChildChanged(ss) {
          var item = findItemByIdForPath(store.getState(), ss.key, pathOpts);
          var newItem = _extends({ id: ss.key }, ss.val());
          if (!isEqual(item, newItem)) store.dispatch(dbAction(actions.edit, newItem));
        };

        var onChildRemoved = function onChildRemoved(ss) {
          var item = findItemByIdForPath(store.getState(), ss.key, pathOpts);
          if (item) store.dispatch(dbAction(actions.remove, { id: ss.key }));
        };

        ref.on('child_added', onChildAdded);
        ref.on('child_changed', onChildChanged);
        ref.on('child_removed', onChildRemoved);

        if (isPrivate) {
          unsubscribeFns.push(function () {
            ref.off('child_added', onChildAdded);
            ref.off('child_changed', onChildChanged);
            ref.off('child_removed', onChildRemoved);

            store.dispatch(dbAction(actions.unset));
          });
        }
      } else {
        data = snapshot.val();
        if (data) store.dispatch(dbAction(actions.set, data));

        var onValue = function onValue(ss) {
          var value = getStateForPath(store.getState(), pathOpts);
          var newValue = ss.val() || {};
          if (!isEqual(value, newValue)) store.dispatch(dbAction(actions.set, newValue));
        };

        ref.on('value', onValue);

        if (isPrivate) {
          unsubscribeFns.push(function () {
            ref.off('value', onValue);

            store.dispatch(dbAction(actions.unset));
          });
        }
      }

      return data;
    };

    return ref.once('value').then(onceValue);
  };

  var setupPaths = function setupPaths(paths, store) {
    return Promise.all(paths.map(function (pathOpts) {
      return setupPath(pathOpts, store);
    }));
  };

  var cleanupPaths = function cleanupPaths() {
    unsubscribeFns.forEach(function (usFn) {
      return usFn();
    });
    unsubscribeFns = [];
  };

  return function (store) {
    return function (next) {
      var setupPublicPaths = setupPaths(publicPathOpts, store);
      var initSetupPaths = [setupPublicPaths];

      auth.onAuthStateChanged(function (user) {
        if (user) {
          currentUser = user;
          if (authActions.set) store.dispatch(authActions.set(user.toJSON()));

          var setupPrivatePaths = setupPaths(privatePathOpts, store);
          if (!inited) initSetupPaths.push(setupPrivatePaths);
        } else {
          currentUser = undefined;
          if (authActions.unset) store.dispatch(authActions.unset());

          cleanupPaths();
        }

        if (!inited) {
          inited = true;
          Promise.all(initSetupPaths).then(function () {
            return onInited();
          });
        }
      });

      return function (action) {
        if (Object.prototype.hasOwnProperty.call(action, DB_ACTION_KEY)) return next(action);

        var newAction = void 0;
        var dbJobs = [];
        var oldState = store.getState();
        var newState = reducer(oldState, action);

        pathOptsArr.forEach(function (pathOpts) {
          var oldData = getStateForPath(oldState, pathOpts);
          if (!oldData) return;

          var newData = getStateForPath(newState, pathOpts);

          if (Array.isArray(oldData)) {
            var _getDifference = getDifference(oldData, newData),
                added = _getDifference.added,
                edited = _getDifference.edited,
                removed = _getDifference.removed;

            added.forEach(function (data) {
              var ref = getRefForPath(pathOpts).push();

              newAction = addIdToActionData(newAction || action, data, ref.key);
              dbJobs.push({
                ref: ref,
                method: 'set',
                data: data
              });
            });

            edited.forEach(function (_ref7) {
              var id = _ref7.id,
                  data = _objectWithoutProperties(_ref7, ['id']);

              dbJobs.push({
                ref: getRefForPath(pathOpts).child(id),
                method: 'update',
                data: data
              });
            });

            removed.forEach(function (_ref8) {
              var id = _ref8.id;

              dbJobs.push({
                ref: getRefForPath(pathOpts).child(id),
                method: 'remove'
              });
            });
          } else if (!isEqual(oldData, newData)) {
            dbJobs.push({
              ref: getRefForPath(pathOpts),
              method: 'set',
              data: newData
            });
          }
        });

        var result = next(newAction || action);

        dbJobs.forEach(function (_ref9) {
          var ref = _ref9.ref,
              method = _ref9.method,
              data = _ref9.data;

          ref[method](data);
        });

        return result;
      };
    };
  };
});

/***/ })
/******/ ]);
});
//# sourceMappingURL=firebase-redux-middleware.js.map