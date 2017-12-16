export default (snapshot) => {
  const list = [];

  snapshot.forEach((childSnapshot) => {
    list.push({
      id: childSnapshot.key,
      ...childSnapshot.val(),
    });
  });

  return list;
};
