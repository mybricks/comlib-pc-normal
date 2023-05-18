import RowAi from './row';
import ColAi from './col';
import { createColBySpan, createColByWidth, createAutoCol } from '../editors/utils';
import { isObject } from 'lodash';
import { WidthUnitEnum } from '../constants';

const prompts = `
  你是一名低代码搭建工程师，当前是一个栅格布局组件，添加栅格时请按照以下格式返回
  {columns: [
    {key: "column_1", widthOption: 'span', span: 8, slot: "slot_1", content: ["mybricks.normal-pc.text"]}, 
    {key: "column_2", widthOption: 'auto', flex: 1, slot: "slot_2"}
  ]}
  以下是一些搭建例子：
  问：添加一个两列布局，左边宽度300，右边自适应
  答：{columns: [
          {key: "column_0", widthOption: 'px', span: 8, width: 300, slot: "slot_0"},
          {key: "column_1", widthOption: 'auto', flex: 1, slot: "slot_1"}
      ]
  }
  问：2列栅格，第一列包含文本组件，第二列包含表格组件
  答：{columns: [
    {key: "column_0", slot: "slot_0", content: ["mybricks.normal-pc.text"]},
    {key: "column_1", slot: "slot_1", content: ["mybricks.normal-pc.table"]}
  ]}
  `;

export default {
  ':root'({ data }) {
    return {
      prompts,
      execute({ data, newData, slots }) {
        console.log(newData);
      }
    };
  },
  prompts,
  '@create'(props) {
    try {
      const { data, def, slots } = props;
      console.log(def);
      if ('columns' in def) {
        const legacyColumns = data.rows[0].columns = data.rows[0].columns.map((col, index) => ({...col, ...def.columns[index]}));
        const dataColCount = legacyColumns.length;
        const defColCount = def.columns.length;
        if (defColCount <= dataColCount) {
          legacyColumns.splice(defColCount, dataColCount - defColCount);
        } else {
          const newCols = createCols({ slots, columns: def.columns.slice(dataColCount) });
          legacyColumns.splice(dataColCount, 0, ...newCols);
        }
        const list = legacyColumns.map((column, index) => {
          return { ...column, content: def.columns[index].content };
        });
        insertCom({
          columns: list,
          slots
        });
      }
    } catch (error) {
      throw Error(`【chatGPT回答数据解析失败】：${error}`);
    }
  },
  ...RowAi,
  ...ColAi
};

const insertCom = ({ columns, slots }) => {
  (columns || []).forEach((column) => {
    const { slot, content } = column;
    const slotInstance = slots.get(slot);
    if (!!content && Array.isArray(content) && slotInstance) {
      content.forEach((item) => {
        let namespace = item;
        if (isObject(item)) namespace = item.type;
        slotInstance.addCom(namespace);
      });
    }
  });
};

const createCols = ({ slots, columns }) => {
  return (columns || []).map((column) => {
    let newColumn, title;
    if (column.widthOption === WidthUnitEnum.Px) {
      newColumn = createColByWidth(column.width);
      title = `固定（${column.width}）`
    } else if (column.widthOption === WidthUnitEnum.Span) {
      newColumn = createColBySpan(column.span);
      title = `col-${newColumn.span}`
    } else {
      newColumn = createAutoCol(column.flex ?? 1);
      title = `自适应`
    }
    slots.add(newColumn.slot, title);
    return newColumn;
  });
};
