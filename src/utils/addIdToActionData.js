import isEqual from './isEqual';

const addIdToActionData = (action, data, id) => {
  let found = false;

  return Object.keys(action)
    .reduce((newAction, key) => {
      const actionData = action[key];
      let newActionData;

      if (!found && isEqual(actionData, data)) {
        found = true;

        newActionData = {
          id,
          ...data,
        };
      } else if (!found && actionData != null && typeof actionData === 'object') {
        newActionData = addIdToActionData(actionData, data, id);
      }

      if (Array.isArray(newAction)) {
        return newAction.concat(newActionData || actionData);
      }
      return {
        ...newAction,
        [key]: newActionData || actionData,
      };
    }, Array.isArray(action) ? [] : {});
};

export default addIdToActionData;
