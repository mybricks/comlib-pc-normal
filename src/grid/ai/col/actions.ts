import { getColItem, getColIndex, setSlotLayout, createColBySpan } from '../../editors/utils';
enum ACTION_TYPE {
  COM = 'coms',
  COL = 'cols',
  SLOTSTYLE = 'slotStyle',
  COLSTYLE = 'colStyle'
}

const insertCol = (props) => {
  const { data, newData, focusArea, slots } = props;
  if (!focusArea) return;
  const [rowIndex, colIndex] = getColIndex(data, focusArea);
  const row = data.rows[rowIndex];
  const columns = (newData[ACTION_TYPE.COL] || []).map((col) => {
    const column = createColBySpan(col.span || 4);
    slots.add(column.slot, `col-${column.span}`);
    return column;
  });
  row.columns.splice(colIndex + 1, 0, ...columns);
};

const insertCom = (props) => {
  const { data, newData, focusArea, slots } = props;
  if (!focusArea) return;
  const item = getColItem(data, focusArea);
  const slot = slots.get(item.slot);
  if (slot) {
    newData[ACTION_TYPE.COM].forEach((namespace) => {
      slot.addCom(namespace);
    });
  }
};

const handleStyle = (props) => {
  const { data, newData, focusArea } = props;
  if (!focusArea) return;
  const item = getColItem(data, focusArea);
  const { coms, cols, slotStyle, ...rest } = newData;
  const colStyle = Object.keys(rest).reduce((pre, cur) => {
    return { ...pre, ...rest[cur] };
  }, {});
  item.colStyle = {
    ...item.colStyle,
    ...colStyle
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
    ...newData[ACTION_TYPE.SLOTSTYLE]
  };
  const slotInstance = slots.get(item.slot);
  setSlotLayout(slotInstance, newData[ACTION_TYPE.SLOTSTYLE]);
};
const actions = {
  [ACTION_TYPE.COM]: insertCom,
  [ACTION_TYPE.COL]: insertCol,
  [ACTION_TYPE.SLOTSTYLE]: handleLayout,
  [ACTION_TYPE.COLSTYLE]: handleStyle
};

export { actions, ACTION_TYPE };
