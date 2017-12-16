import isEqual from '../../src/utils/isEqual';

describe('should compare primitives', () => {
  const symbol1 = Symbol ? Symbol('a') : true;
  const symbol2 = Symbol ? Symbol('b') : false;

  // https://github.com/lodash/lodash/blob/4.17.4/test/test.js#L9486
  const pairs = [
    [1, 1, true], [1, Object(1), true], [1, '1', false], [1, 2, false],
    [-0, -0, true], [0, 0, true], [0, Object(0), true], [Object(0), Object(0), true], [-0, 0, true], [0, '0', false], [0, null, false],
    [NaN, NaN, true], [NaN, Object(NaN), true], [Object(NaN), Object(NaN), true], [NaN, 'a', false], [NaN, Infinity, false],
    ['a', 'a', true], ['a', Object('a'), true], [Object('a'), Object('a'), true], ['a', 'b', false], ['a', ['a'], false],
    [true, true, true], [true, Object(true), true], [Object(true), Object(true), true], [true, 1, false], [true, 'a', false],
    [false, false, true], [false, Object(false), true], [Object(false), Object(false), true], [false, 0, false], [false, '', false],
    [symbol1, symbol1, true], [symbol1, Object(symbol1), true], [Object(symbol1), Object(symbol1), true], [symbol1, symbol2, false],
    [null, null, true], [null, undefined, false], [null, {}, false], [null, '', false],
    [undefined, undefined, true], [undefined, null, false], [undefined, '', false],
  ];

  pairs.forEach((pair, ind) => {
    test(`case ${ind + 1}`, () => {
      const actual = isEqual(pair[0], pair[1]);
      const expected = pair[2];
      expect(actual).toBe(expected);
    });
  });
});

describe('should compare arrays', () => {
  test('case 1', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    expect(isEqual(arr1, arr2)).toBe(true);
  });
  test('case 2', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 4];
    expect(isEqual(arr1, arr2)).toBe(false);
  });
  test('case 3', () => {
    const arr1 = [[1], 2, [3, 4, 5]];
    const arr2 = [[1], 2, [3, 4, 5]];
    expect(isEqual(arr1, arr2)).toBe(true);
  });
  test('case 4', () => {
    const arr1 = [[1], 2, [3, 4, 5]];
    const arr2 = [[1], 2, [3, [4], 5]];
    expect(isEqual(arr1, arr2)).toBe(false);
  });
  test('case 5', () => {
    const arr1 = [1, 2, 3];
    const arr2 = { 0: 1, 1: 2, 2: 3 };
    expect(isEqual(arr1, arr2)).toBe(false);
  });
});

describe('should compare objects', () => {
  test('case 1', () => {
    const obj1 = { foo: 'bar', num: 2, bool: true };
    const obj2 = { foo: 'bar', num: 2, bool: true };
    expect(isEqual(obj1, obj2)).toBe(true);
  });
  test('case 2', () => {
    const obj1 = { foo: 'bar', num: 2, bool: true };
    const obj2 = { foo: 'bar', num: 1, bool: true };
    expect(isEqual(obj1, obj2)).toBe(false);
  });
  test('case 3', () => {
    const obj1 = { foo: 'bar', num: 2, bool: true };
    const obj2 = { foo: 'bar', num: 2 };
    expect(isEqual(obj1, obj2)).toBe(false);
  });
  test('case 4', () => {
    const obj1 = { foo: 'bar', num: [2], bool: { value: true } };
    const obj2 = { foo: 'bar', num: [2], bool: { value: true } };
    expect(isEqual(obj1, obj2)).toBe(true);
  });
  test('case 5', () => {
    const obj1 = { foo: 'bar', num: [2], bool: { value: true } };
    const obj2 = { foo: 'bar', num: [1], bool: { value: true } };
    expect(isEqual(obj1, obj2)).toBe(false);
  });
  test('case 6', () => {
    const obj1 = { foo: 'bar', num: 2, bool: true };
    const obj2 = { bool: true, foo: 'bar', num: 2 };
    expect(isEqual(obj1, obj2)).toBe(true);
  });
});

describe('should compare array of objects', () => {
  test('case 1', () => {
    const arr1 = [{ foo: 'bar' }, { num: 1 }, { bool: false }];
    const arr2 = [{ foo: 'bar' }, { num: 1 }, { bool: false }];
    expect(isEqual(arr1, arr2)).toBe(true);
  });
  test('case 2', () => {
    const arr1 = [{ foo: 'bar' }, { num: 1 }, { bool: false }];
    const arr2 = [{ num: 1 }, { foo: 'bar' }, { bool: false }];
    expect(isEqual(arr1, arr2)).toBe(false);
  });
  test('case 3', () => {
    const arr1 = [{ foo: 'bar', num: 1 }, { bool: false }];
    const arr2 = [{ num: 1, foo: 'bar' }, { bool: false }];
    expect(isEqual(arr1, arr2)).toBe(true);
  });
});
