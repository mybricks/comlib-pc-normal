import { uuid } from '../../../utils';
import { getRowItem } from '../../editors/utils';
enum ACTION_TYPE {
  ADD_COM = 'addCom',
  ADD_ROW = 'addRow',
  LAYOUT = 'layout',
  STYLE = 'style'
}

const insertRow = (props) => {
  const { data, slots } = props;
  const preRow = data.rows.slice().pop();
  const rowKey = uuid();
  const newRow = {
    ...preRow,
    key: rowKey,
    columns: preRow.columns.map((col) => {
      const key = uuid();
      const { title } = slots.get(col.slot);
      slots.add(key, title);
      return { ...col, key, slot: key };
    })
  };
  data.rows.push(newRow);
};

const insertCom = (props) => {
  const { slots, newData } = props;
  (newData[ACTION_TYPE.ADD_COM] || []).forEach((col) => {
    const slot = slots.get(col.slot);
    if (slot && col.coms) {
      col.coms.forEach((namespace) => {
        slot.addCom(namespace);
      });
    }
  });
};

const handleStyle = (props) => {
  const { data, newData, focusArea } = props;
  if (!focusArea) return;
  const row = getRowItem(data, focusArea);
  row.backgroundColor = newData[ACTION_TYPE.STYLE].backgroundColor;
};

const handleLayout = (props) => {
  const { data, newData, focusArea } = props;
  if (!focusArea) return;
  const row = getRowItem(data, focusArea);
  row.justify = newData[ACTION_TYPE.LAYOUT].justify || row.justify;
  row.align = newData[ACTION_TYPE.LAYOUT].align || row.align;
};

const actions = {
  [ACTION_TYPE.ADD_COM]: insertCom,
  [ACTION_TYPE.ADD_ROW]: insertRow,
  [ACTION_TYPE.LAYOUT]: handleLayout,
  [ACTION_TYPE.STYLE]: handleStyle
};

export { actions, ACTION_TYPE };
