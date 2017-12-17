import getDifference from '../../src/utils/getDifference';

test('should throw error if not called with arrays', () => {
  function callWithObjects() {
    getDifference({ foo: 'bar' }, { foo: 'baz' });
  }
  expect(callWithObjects).toThrowError('Difference checking only works with arrays');
});

test('should throw error if called with arrays of objects without id', () => {
  function callWithObjects() {
    getDifference([{ foo: 'bar' }], [{ foo: 'baz' }]);
  }
  expect(callWithObjects).toThrowError('Difference checking only works with arrays of objects with id');
});

test('should find differences', () => {
  const oldData = [
    {
      id: 1,
      foo: 'bar',
    },
    {
      id: 2,
      foo: 'baz',
    },
    {
      id: 3,
      foo: 'foo',
    },
  ];
  const newData = [
    {
      id: 1,
      foo: 'baz',
    },
    {
      id: 3,
      foo: 'foo',
    },
    {
      id: 4,
      foo: 'asd',
    },
  ];

  const actual = getDifference(oldData, newData);
  const expected = {
    added: [newData[2]],
    edited: [newData[0]],
    removed: [oldData[1]],
  };
  expect(actual).toEqual(expected);
});
