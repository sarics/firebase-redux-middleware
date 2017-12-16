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

export default isEqual;
