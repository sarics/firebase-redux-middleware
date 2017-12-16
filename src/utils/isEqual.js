const getVal = (obj) => (typeof obj === 'undefined' || obj === null ? obj : obj.valueOf());

const isEqual = (obj1, obj2) => {
  const obj1Val = getVal(obj1);
  const obj2Val = getVal(obj2);

  if (obj1Val === null || obj2Val === null || typeof obj1Val !== 'object' || typeof obj2Val !== 'object') {
    return (
      (obj1Val === null && obj2Val === null) ||
      (Number.isNaN(obj1Val) && Number.isNaN(obj2Val)) ||
      obj1Val === obj2Val
    );
  }

  return (
    Array.isArray(obj1Val) === Array.isArray(obj2Val) &&
    Object.keys(obj1Val).length === Object.keys(obj2Val).length &&
    Object.keys(obj1Val)
      .reduce((isEq, key) => isEq && isEqual(obj1Val[key], obj2Val[key]), true)
  );
};

export default isEqual;
