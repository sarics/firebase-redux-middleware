import isEqual from './isEqual';

export default (oldData, newData) =>
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
