import addIdToActionData from '../../src/utils/addIdToActionData';

const id = '1234asd';

const data = {
  foo: 'bar',
  bool: true,
};

test('should add id to data in action data', () => {
  const action = {
    type: 'TEST_ACTION',
    testData: data,
  };

  const actual = addIdToActionData(action, data, id);
  const expected = {
    ...action,
    testData: {
      id,
      ...data,
    },
  };

  expect(actual).toEqual(expected);
});

test('should add id to data in action data array', () => {
  const action = {
    type: 'TEST_ACTION',
    testData: [
      { key: 'val' },
      data,
    ],
  };

  const actual = addIdToActionData(action, data, id);
  const expected = {
    ...action,
    testData: [
      { key: 'val' },
      {
        id,
        ...data,
      },
    ],
  };

  expect(actual).toEqual(expected);
});

test('should add id only to the first found data in action data', () => {
  const action = {
    type: 'TEST_ACTION',
    testData: data,
    testData2: data,
  };

  const actual = addIdToActionData(action, data, id);
  const expected = {
    ...action,
    testData: {
      id,
      ...data,
    },
    testData2: data,
  };

  expect(actual).toEqual(expected);
});

test('should add id only to the first found data in action data array', () => {
  const action = {
    type: 'TEST_ACTION',
    testData: [
      data,
      data,
    ],
  };

  const actual = addIdToActionData(action, data, id);
  const expected = {
    ...action,
    testData: [
      {
        id,
        ...data,
      },
      data,
    ],
  };

  expect(actual).toEqual(expected);
});

test('should add id to deep data in action data', () => {
  const action = {
    type: 'TEST_ACTION',
    parent: [
      {
        foo: 'bar',
        testData: data,
      },
    ],
  };

  const actual = addIdToActionData(action, data, id);
  const expected = {
    ...action,
    parent: [
      {
        foo: 'bar',
        testData: {
          id,
          ...data,
        },
      },
    ],
  };

  expect(actual).toEqual(expected);
});

test('should return original action data if data not found', () => {
  const action = {
    type: 'TEST_ACTION',
    testData: {
      foo: 'baz',
    },
  };

  const actual = addIdToActionData(action, data, id);
  const expected = action;

  expect(actual).toEqual(expected);
});
