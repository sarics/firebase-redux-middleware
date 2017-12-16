import isEqual from './isEqual';

const extendNewAction = (newAction, key, newActionData) =>
  Object.assign(
    Array.isArray(newAction) ? [] : {},
    newAction,
    { [key]: newActionData },
  );

const addIdToActionData = (action, data, id) => {
  if (!action || !data || !id) return action;

  let found = false;

  return Object.keys(action)
    .reduce((newAction, key) => {
      const actionData = action[key];
      if (found || !actionData || typeof actionData !== 'object') return extendNewAction(newAction, key, actionData);

      let newActionData;
      if (isEqual(actionData, data)) {
        found = true;

        newActionData = {
          id,
          ...data,
        };
      } else {
        newActionData = addIdToActionData(actionData, data, id);
      }

      return extendNewAction(newAction, key, newActionData);
    }, Array.isArray(action) ? [] : {});
};

export default addIdToActionData;
