import { message } from 'antd';
import { Data, Item, InputIds, TypeEnum } from '../constants';
import { uuid } from '../../utils';

const DescSchema = {
  type: 'object',
  properties: {
    label: {
      type: 'string'
    },
    labelDesc: {
      type: 'string'
    },
    showLabel: {
      type: 'boolean'
    },
    visible: {
      type: 'boolean'
    }
  }
};

export function getEleIdx({ data, focusArea }: any): number {
  focusArea.ele.myEle = true;
  if (!focusArea.ele?.parentNode) return 0;
  const tableEle = focusArea.ele.parentNode.parentNode;
  if (!tableEle) return 0;
  const tableRows = tableEle.children;
  let dataItemIdx = -1;
  const tableRowsArr: any[] = Array.from(tableRows);
  first: for (let i = 0; i < tableRowsArr.length; i++) {
    const rowItemArr: any[] = tableRowsArr[i].children;
    for (let j = 0; j < rowItemArr.length; j++) {
      const item = rowItemArr[j];
      dataItemIdx++;
      if (item.myEle) {
        break first;
      }
    }
  }
  if (dataItemIdx === -1) {
    message.error('出错了:(');
    throw new Error('dataItemIdx not found.');
  }
  delete focusArea.ele.myEle;
  return dataItemIdx;
}

export function getSpanCount({ data, focusArea }: any): number {
  focusArea.ele.myFlag = true;
  let focusAreaEle = focusArea.ele;
  const tableEle = focusAreaEle.parentNode?.parentNode;
  const tableRows: any[] = Array.from(
    tableEle?.getElementsByClassName('ant-descriptions-row') || []
  );
  let spanCount = 0;
  outer: for (let i = 0; i < tableRows.length; i++) {
    spanCount = 0;
    const itemChildren = Array.from(tableRows[i].children);
    for (let j = 0; j < itemChildren.length; j++) {
      const item: any = itemChildren[j];
      if (item.myFlag) {
        break outer;
      } else {
        spanCount += Number(item.getAttribute('colspan'));
      }
    }
  }
  delete focusArea.ele.myFlag;
  return spanCount;
}

export function setNextSpan({ data, focusArea }: any, toSetSpan: number) {
  focusArea.ele.myFlag = true;
  let focusAreaEle = focusArea.ele;
  const tableEle = focusAreaEle.parentNode.parentNode;
  const tableRows: any[] = Array.from(tableEle.children);
  const focusRow: any[] = Array.from(focusAreaEle.parentNode.children);
  let totalSpan = 0;
  focusRow.forEach((item: any) => {
    if (item.myFlag) {
      totalSpan += toSetSpan;
    } else {
      totalSpan += Number(item.getAttribute('colspan'));
    }
  });
  if (totalSpan > data.column) {
    focusRow[focusRow.length - 1].dataFlag = true;
    let nextIdx: number = -1;
    outer: for (let i = 0; i < tableRows.length; i++) {
      const rowItems = tableRows[i].children;
      for (let j = 0; j < rowItems.length; j++) {
        nextIdx++;
        if (rowItems[j].dataFlag) {
          break outer;
        }
      }
    }
    data.items[nextIdx].span = 1;
  }
  if (totalSpan < data.column) {
    focusArea.ele.parentNode.rowFlag = true;
    let nextItem: any = focusArea.ele;
    tableRows.forEach((item: any, idx: number) => {
      if (item.rowFlag && idx !== tableRows.length - 1) {
        nextItem = tableRows[idx + 1].children[0];
        nextItem.dataFlag = true;
        totalSpan += Number(nextItem.getAttribute('colspan'));
      }
    });
    if (totalSpan > data.column) {
      let nextIdx: number = -1;
      outer: for (let i = 0; i < tableRows.length; i++) {
        const rowItems = tableRows[i].children;
        for (let j = 0; j < rowItems.length; j++) {
          nextIdx++;
          if (rowItems[j].dataFlag) {
            break outer;
          }
        }
      }
      data.items[nextIdx].span = 1;
    }
  }
  data.items[getEleIdx({ data, focusArea })].span = toSetSpan;
  delete focusArea.ele.myFlag;
}

export function setDelete({ data, focusArea, slots }: any) {
  const deleteItemIdx = getEleIdx({ data, focusArea });
  const itemRowIdx = focusArea.index;
  const rowStart = deleteItemIdx - itemRowIdx;
  let spanCount = 0;
  let rowEnd = -1;
  for (let i = rowStart; i < data.items.length; i++) {
    if (i !== deleteItemIdx) {
      spanCount += data.items[i].span;
    }
    if (spanCount === data.column) {
      rowEnd = i;
      break;
    }
    if (spanCount > data.column) {
      data.items[i].span = 1;
      break;
    }
  }
  const item = data.items[deleteItemIdx];
  if (item?.slotId) {
    slots.remove(item.slotId);
  }
  data.items.splice(deleteItemIdx, 1);
}

export function setExchange({ data, focusArea }: any, type: 'up' | 'down') {
  const idx1 = getEleIdx({ data, focusArea });
  let idx2;
  if (type === 'up') {
    idx2 = idx1 - 1;
  } else {
    idx2 = idx1 + 1;
  }
  if (idx2 < 0 || idx2 >= data.items.length) {
    return;
  }
  const temp = data.items[idx1];
  data.items[idx1] = data.items[idx2];
  data.items[idx2] = temp;
}

export const getDataSourceSchema = (data: Data) => {
  const properties = {};
  data.items.forEach((item) => {
    const subSchema = item.schema;
    properties[item.key] = subSchema || { type: 'string' };
  });
  return properties;
};

export const getDataDescSchema = (data: Data) => {
  const properties = getDataSourceSchema(data)
  if(!Object.keys(properties).length) {
    return {
      type: 'any'
    }
  }
  Object.keys(properties).forEach((key) => {
    properties[key] = DescSchema;
  });
  return {
    type: 'object',
    properties
  }
}

const setDataSourceSchema = ({ input, dataSchema }) => {
  const Pin = input.get(InputIds.SetDataSource);
  if (Pin) {
    Pin.setSchema({
      title: '输入数据',
      type: 'object',
      properties: dataSchema
    });
  }
};

const setDataDescSchema = ({ input, data }) => {
  const pin = input.get(InputIds.SetDataDesc);
  if (pin) {
    const schema = getDataDescSchema(data)
    pin.setSchema(schema);
  }
};

const setSuffixBtnClickSchema = ({ data, output, dataSchema }) => {
  data.items.forEach((item) => {
    if (item.useSuffix) {
      const outputId = `${item.id}-suffixClick`;
      const Pin = output.get(outputId);
      if (Pin) {
        Pin.setSchema({
          title: '输出数据',
          type: 'object',
          properties: {
            value: {
              title: '当前字段数据',
              type: 'any'
            },
            record: {
              title: '完整数据',
              type: 'object',
              properties: dataSchema
            }
          }
        });
      }
    }
  });
};

// 更新schema数据
export const updateIOSchema = ({ data, input, output }) => {
  const dataSchema = getDataSourceSchema(data);
  setDataSourceSchema({ input, dataSchema });
  setDataDescSchema({ input, data });
  setSuffixBtnClickSchema({ data, dataSchema, output });
};

export const Schemas = {
  SuffixClick: (data: Data) => {
    const dataSchema = getDataSourceSchema(data);
    return {
      title: '输出数据',
      type: 'object',
      properties: {
        value: {
          title: '当前字段数据',
          type: 'any'
        },
        record: {
          title: '完整数据',
          type: 'object',
          properties: dataSchema
        }
      }
    };
  },
  SetDataSource: (data: Data) => {
    const dataSchema = getDataSourceSchema(data);
    return {
      title: '输入数据',
      type: 'object',
      properties: dataSchema
    };
  }
};

export const createItem = ({ data }: Pick<EditorResult<Data>, 'data'>): Item => {
  const id = !!data.items.length ? uuid() : 'field1';  //兼容init设置i/o schema不生效问题
  return {
    id,
    label: `描述项${data.items.length + 1}`,
    key: id,
    showLabel: true,
    value: `field${data.items.length + 1}`,
    span: 1,
    type: TypeEnum.Text,
    direction: 'horizontal',
    useSuffix: false,
    suffixBtnText: '查看更多',
    schema: {
      type: 'string'
    },
    labelDesc: ''
  };
};

export const createStyleForItem = ({ target }: StyleModeType<Data>) => ({
  title: '描述项',
  options: ['padding'],
  target
});

export const createStyleForLabel = ({ target }: StyleModeType<Data>) => ({
  title: '标签',
  options: ['font', 'size'],
  target
});

export const createStyleForContent = ({ target }: StyleModeType<Data>) => ({
  title: '内容',
  options: ['font', 'size'],
  target
});
