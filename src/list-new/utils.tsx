import { uuid } from '../utils';

const rowKey = '_itemKey';

export const addItem = (dataSource, len, v, key, judge) => {
  let newDataSource = [...dataSource];

  if (judge) {
    newDataSource.splice(v.index, 0, {
      item: v.value !== undefined ? v.value : v,
      [rowKey]: key === '' ? uuid() : v[key] || uuid(),
      index: v.index
    });
    newDataSource = newDataSource.map((item, index) => {
      return {
        ...item,
        index: index
      };
    });
  } else {
    newDataSource.push({
      item: v.value !== undefined ? v.value : v,
      [rowKey]: key === '' ? uuid() : v[key] || uuid(),
      index: len
    });
  }
  return newDataSource;
};

export const removeItem = (dataSource, v, judge, logger) => {
  let newDataSource = [...dataSource];
  if (newDataSource.length !== 0) {
    if (judge) {
      newDataSource.splice(v, 1);
      newDataSource = newDataSource.map((item, index) => {
        return {
          ...item,
          index: index
        };
      });
    } else {
      newDataSource.splice(-1, 1);
    }
  } else {
    logger.error('数据源长度为0');
  }

  return newDataSource;
};

export const changeItem = (dataSource, v, key) => {
  let newDataSource = [...dataSource];
  newDataSource[v.index] = {
    ...newDataSource[v.index],
    item: v.value,
    [rowKey]: key === '' ? uuid() : v[key] || uuid()
  };
  return newDataSource;
};

export const upMove = (array, index) => {
  let newArr = [...array];
  let temp = newArr[index];
  newArr[index] = newArr[index - 1];
  newArr[index - 1] = temp;

  newArr = newArr.map((item, index) => {
    return {
      ...item,
      index: index
    };
  });
  return newArr;
};

export const downMove = (array, index) => {
  let newArr = [...array];
  let temp = newArr[index];
  newArr[index] = newArr[index + 1];
  newArr[index + 1] = temp;

  newArr = newArr.map((item, index) => {
    return {
      ...item,
      index: index
    };
  });
  return newArr;
};
