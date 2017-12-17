const getDeepData = (data, path = []) => {
  if (!path.length) return data;
  if (data === null || typeof data !== 'object') return undefined;

  const key = path.slice(0, 1)[0];

  return getDeepData(data[key], path.slice(1));
};

export default getDeepData;
