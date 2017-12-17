import isEqual from './isEqual';

const childrenHaveId = (arr) => !arr.find((item) => !item.id);

export default (oldData, newData) => {
  if (!Array.isArray(oldData) || !Array.isArray(newData)) {
    throw new Error('Difference checking only works with arrays');
  }

  if (!childrenHaveId(oldData) || !childrenHaveId(newData)) {
    throw new Error('Difference checking only works with arrays of objects with id');
  }

  return newData.reduce((changes, item) => {
    const newChanges = { ...changes };

    const oldItem = oldData.find(({ id }) => id === item.id);
    const newItem = { ...item };

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
};
