export default (snapshot) => {
  if (!snapshot || !snapshot.forEach) return [];

  const list = [];

  snapshot.forEach((childSnapshot) => {
    list.push({
      id: childSnapshot.key,
      ...childSnapshot.val(),
    });
  });

  return list;
};
