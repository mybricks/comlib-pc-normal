import { getColItem, getColIndex, setSlotLayout, createColBySpan } from '../../editors/utils';
enum ACTION_TYPE {
  ADD_COM = 'addCom',
  ADD_COL = 'addCol',
  LAYOUT = 'layout',
  STYLE = 'style'
}

const addCol = (props) => {
  const { data, newData, focusArea, slots } = props;
  if (!focusArea) return;
  const [rowIndex, colIndex] = getColIndex(data, focusArea);
  const row = data.rows[rowIndex];
  const column = createColBySpan(newData.data.span || 4);
  row.columns.splice(colIndex + 1, 0, column);
  slots.add(column.slot, `col-${newData.data.span}`);
};

const addCom = (props) => {
  const { data, newData, focusArea, slots } = props;
  if (!focusArea) return;
  const item = getColItem(data, focusArea);
  if (newData.data.namespace) {
    const slot = slots.get(item.slot);
    if (slot) {
      slot.addCom(newData.data.namespace);
    }
  }
};

const handleStyle = (props) => {
  const { data, newData, focusArea } = props;
  if (!focusArea) return;
  const item = getColItem(data, focusArea);
  item.colStyle = {
    ...item.colStyle,
    ...newData.data.colStyle
  };
};

const handleLayout = (props) => {
  const { data, newData, focusArea, slots } = props;
  if (!focusArea) return;
  const item = getColItem(data, focusArea);
  if (!item.slotStyle) {
    item.slotStyle = {};
  }
  item.slotStyle = {
    ...item.slotStyle,
    ...newData.data.slotStyle
  };
  const slotInstance = slots.get(item.slot);
  setSlotLayout(slotInstance, newData.data.slotStyle);
};
const actions = {
  [ACTION_TYPE.ADD_COM]: addCom,
  [ACTION_TYPE.ADD_COL]: addCol,
  [ACTION_TYPE.LAYOUT]: handleLayout,
  [ACTION_TYPE.STYLE]: handleStyle
};

export { actions, ACTION_TYPE };
