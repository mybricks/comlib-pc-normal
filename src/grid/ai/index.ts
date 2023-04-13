import RowAi from './row';
import ColAi from './col';
import { createColBySpan } from '../editors/utils';
import { isArray, isObject } from '../../utils/types';
export default {
  ':root'({ data }) {
    return {
      prompts: `
            你是一名低代码搭建工程师，当前是一个栅格布局组件，添加栅格时请按照以下格式返回
            {cols: [
              {key: "column_1", widthOption: 'span', span: 8, slot: "slot_1"}, 
              {key: "column_2", widthOption: 'auto', flex: 1, slot: "slot_2"}
            ]}
            一下是一些搭建例子：
            问：2列布局
            答：{type: 'mybricks.normal-pc.grid', columns: [
                    {key: "column_1", widthOption: 'span', span: 8, slot: "slot_1"}, 
                    {key: "column_2", widthOption: 'auto', flex: 1, slot: "slot_2"}
                ]
            }
            问：栅格第一列包含文本组件
            答：{type: 'mybricks.normal-pc.grid', columns: [{widthOption: 'px', width: 280, slots: {content: []}}]}
        `,
      execute({ data, newData, slots }) {
        console.log(newData);
      }
    };
  },
  '@create'(props) {
    const { data, def, slots, slot } = props;
    console.log(def);
    const dataColCount = data.rows[0].columns.length;
    const defColCount = analyzeColCount({ def });
    if (defColCount < dataColCount) {
      data.rows[0].columns.splice(defColCount, dataColCount - defColCount);
    } else if (defColCount > dataColCount) {
      data.rows[0].columns = data.rows[0].columns.concat(
        createCols({ slots, count: defColCount - dataColCount })
      );
    }
    if ('slots' in def) {
      const slotContentMap = analyzeSlotContent({ def, slots });
      for (const [id, coms] of Object.entries(slotContentMap || {})) {
        const slot = slots.get(id);
        coms.forEach((com) => {
          slot.addCom(com);
        });
      }
    }
  },
  ...RowAi,
  ...ColAi
};

const analyzeColCount = ({ def }) => {
  let defColCount = 0;
  if ('columns' in def) {
    defColCount = typeof def.columns === 'number' ? def.columns : def.columns.length;
  }
  if ('cols' in def) {
    defColCount = typeof def.cols === 'number' ? def.cols : def.cols.length;
  }
  if ('props' in def && 'columns' in def.props) {
    defColCount =
      typeof def.props.columns === 'number' ? def.props.columns : def.props.columns.length;
  }
  if ('props' in def && 'cols' in def.props) {
    defColCount = typeof def.props.cols === 'number' ? def.props.cols : def.props.cols.length;
  }
  return defColCount;
};

const createCols = ({ slots, count }) => {
  let i = count;
  const cols: any = [];
  while (i-- > 0) {
    const col = createColBySpan();
    cols.push(col);
    slots.add(col.slot, `col-${col.span}`);
  }
  return cols;
};

const analyzeSlotContent = ({ def, slots }) => {
  const slotContent = {};
  if (isArray(def.slots)) {
  }
  if (isObject(def.slots)) {
    let index = 0;
    for (const [key, val] of Object.entries(def.slots)) {
      let coms: Array<string> = [],
        slotId = key;
      if (isArray(val)) {
        coms = val.map((com) => com.type);
      }
      if (!slots.get(key)) {
        slotId = `slot_${index}`;
        index++;
      }
      slotContent[slotId] = coms;
    }
  }
  return slotContent;
};