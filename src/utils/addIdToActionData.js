import isEqual from './isEqual';

const addIdToActionData = (action, data, id) => {
  let found = false;

  const shouldCheck = (actionData) =>
    !found && actionData != null && typeof actionData === 'object';

  if (Array.isArray(action)) {
    return action.map((actionData) => {
      if (!found && isEqual(actionData, data)) {
        found = true;

        return {
          id,
          ...data,
        };
      }
      if (shouldCheck(actionData)) {
        return addIdToActionData(actionData, data, id);
      }
      return actionData;
    });
  }

  return Object.keys(action).reduce((newAction, key) => {
    const actionData = action[key];

    if (!found && isEqual(actionData, data)) {
      found = true;

      return {
        ...newAction,
        [key]: {
          id,
          ...data,
        },
      };
    }
    if (shouldCheck(actionData)) {
      return {
        ...newAction,
        [key]: addIdToActionData(actionData, data, id),
      };
    }
    return {
      ...newAction,
      [key]: actionData,
    };
  }, {});
};

export default addIdToActionData;
