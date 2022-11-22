import { Data } from './constants';

const SupportType = ['Array', 'Object'];

const isSameInputType = (inputs) => {
  const [first, ...rest] = inputs;
  let type = getType(first);
  if (!type || !SupportType.includes(type)) return;
  const isSame = Object.values(rest).every((item) => {
    return getType(item) === type;
  });
  return isSame ? type : null;
};

const getType = (obj) => {
  return Object.prototype.toString.call(obj).match(/\[object (.*)\]/)?.[1];
};

const arrayMerge = (inputs) => {
  const ret = new Set(
    inputs.reduce((pre = [], cur) => {
      return [...pre, ...cur];
    }, [])
  );
  return Array.from(ret);
};

const objMerge = (inputs) => {
  const ret = inputs.reduce((pre = {}, cur) => {
    return { ...pre, ...cur };
  }, {});
  return ret;
};

// 获取输入项序号
function getInputOrder({ input }) {
  const ports = input.get();
  const { id } = ports?.pop?.() || {};
  return (Number(id.slice(5)) || 0) + 1;
}

// 获取输出schema
function getOutputSchema(data: Data, input) {
  const res = {};
  const inputList = input.get() || [];
  const [first, ...rest] = inputList;
  const firstSchema = input.get(first?.id)?.schema;
  const firstSchemaJSON = JSON.stringify(firstSchema);

  // 1. 对象合并
  const isMergeObject =
    data.isMerge &&
    (inputList || []).every((item) => {
      const schema = input.get(item?.id)?.schema;
      return schema?.type === 'object';
    });
  if (isMergeObject) {
    (inputList || []).forEach((item) => {
      const schema = input.get(item?.id)?.schema;
      Object.assign(res, schema?.properties);
    });
    return {
      type: 'object',
      properties: res
    };
  }
  // 2. 数组子项类型相同
  const isArraySameSchema = rest.every((item) => {
    const schema = input.get(item?.id)?.schema;
    return JSON.stringify(schema) === firstSchemaJSON;
  });
  if (isArraySameSchema) {
    return data.isMerge
      ? firstSchema
      : {
          type: 'array',
          items: firstSchema
        };
  }
  // 其他情形
  return {
    type: 'array',
    items: {
      type: 'any'
    }
  };
}

export { isSameInputType, getType, arrayMerge, objMerge, getInputOrder, getOutputSchema };
