const getDeepData = (data, path = []) => {
  if (data == null || typeof data !== 'object' || !path.length) return data;

  let key = path.slice(0, 1)[0];
  if (/^\d+$/.test(key)) key = parseInt(key, 10);

  return getDeepData(data[key], path.slice(1));
};

export default getDeepData;
