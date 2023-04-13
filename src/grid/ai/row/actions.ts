import { uuid } from '../../../utils';
import { getRowItem } from '../../editors/utils';
enum ACTION_TYPE {
  ADD_COM = 'addCom',
  ADD_ROW = 'addRow',
  LAYOUT = 'layout',
  STYLE = 'style'
}

const addRow = (props) => {
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

const addCom = (props) => {
  const { slots, newData } = props;
  if (newData.data.namespace) {
    const slot = slots.get(newData.data.slot);
    if (slot) {
      slot.addCom(newData.data.namespace);
    }
  }
};
const handleStyle = (props) => {
  const { data, newData, focusArea } = props;
  if (!focusArea) return;
  const row = getRowItem(data, focusArea);
  row.backgroundColor = newData.data.backgroundColor;
};

const handleLayout = (props) => {
  const { data, newData, focusArea } = props;
  if (!focusArea) return;
  const row = getRowItem(data, focusArea);
  row.justify = newData.data.justify || row.justify;
  row.align = newData.data.align || row.align;
};
const actions = {
  [ACTION_TYPE.ADD_COM]: addCom,
  [ACTION_TYPE.ADD_ROW]: addRow,
  [ACTION_TYPE.LAYOUT]: handleLayout,
  [ACTION_TYPE.STYLE]: handleStyle
};

export { actions, ACTION_TYPE };
