import snapshotToArray from '../../src/utils/snapshotToArray';

let snapshot;

beforeEach(() => {
  snapshot = {
    forEach: jest.fn(),
  };
});

test('should return array', () => {
  const actual = snapshotToArray(snapshot);
  expect(actual).toEqual([]);
});

test('should return array when called without argument', () => {
  const actual = snapshotToArray();
  expect(actual).toEqual([]);
});

test('should call snapshot.forEach', () => {
  snapshotToArray(snapshot);
  expect(snapshot.forEach).toBeCalled();
});

test('should correctly handle snapshot.forEach', () => {
  const childSnapshot = {
    key: 'asd',
    val: () => ({
      foo: 'bar',
      moo: 'baz',
    }),
  };
  snapshot.forEach = (cb) => cb(childSnapshot);

  const actual = snapshotToArray(snapshot);
  const expected = [
    {
      id: 'asd',
      foo: 'bar',
      moo: 'baz',
    },
  ];

  expect(actual).toEqual(expected);
});
