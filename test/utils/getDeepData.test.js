import getDeepData from '../../src/utils/getDeepData';

const data = {
  foo: 'bar',
  null: null,
  arr: [
    {
      foo: 'baz',
    },
    {
      arr2: [
        'test',
        1,
      ],
    },
    null,
    {
      bool: false,
    },
  ],
};

test('should return undefined if called without data', () => {
  const actual = getDeepData();
  expect(actual).toBeUndefined();
});

test('should return original data if called without path', () => {
  const actual = getDeepData(data);
  const expected = data;
  expect(actual).toEqual(expected);
});

describe('should find data for path', () => {
  test('case 1', () => {
    const actual = getDeepData(data, ['foo']);
    const expected = 'bar';
    expect(actual).toBe(expected);
  });
  test('case 2', () => {
    const actual = getDeepData(data, ['arr', '0']);
    const expected = {
      foo: 'baz',
    };
    expect(actual).toEqual(expected);
  });
  test('case 3', () => {
    const actual = getDeepData(data, ['arr', '0', 'foo']);
    const expected = 'baz';
    expect(actual).toBe(expected);
  });
  test('case 4', () => {
    const actual = getDeepData(data, ['arr', '1', 'arr2', '1']);
    const expected = 1;
    expect(actual).toBe(expected);
  });
  test('case 5', () => {
    const actual = getDeepData(data, ['null']);
    expect(actual).toBeNull();
  });
  test('case 6', () => {
    const actual = getDeepData(data, ['arr', '2']);
    expect(actual).toBeNull();
  });
  test('case 7', () => {
    const actual = getDeepData(data, ['arr', '3', 'bool']);
    const expected = false;
    expect(actual).toBe(expected);
  });
});

describe('should return undefined if data not found', () => {
  test('case 1', () => {
    const actual = getDeepData(data, ['foo', 'bar']);
    expect(actual).toBeUndefined();
  });
  test('case 2', () => {
    const actual = getDeepData(data, ['null', 'bar', 'baz']);
    expect(actual).toBeUndefined();
  });
  test('case 3', () => {
    const actual = getDeepData(data, ['arr', '4']);
    expect(actual).toBeUndefined();
  });
  test('case 4', () => {
    const actual = getDeepData('asd', ['foo', 'bar']);
    expect(actual).toBeUndefined();
  });
});
