import { uuid } from '../../utils';
import {
  Data,
  ColumnParams,
  JustifyTypeEnum,
  AlignTypeEnum,
  WidthUnitEnum,
  IRow
} from '../constants';

function generateColumnsTitle(columnCount: number) {
  return `col-${24 / columnCount} (${(100 / columnCount).toFixed(2)}%)`;
}
// 添加行
export function addRow({ data, slot }: EditorResult<Data>, columnCount: number) {
  const columns: ColumnParams[] = [];
  const slotTitle = generateColumnsTitle(columnCount);

  for (let i = 0; i < columnCount; i++) {
    const columnId = uuid();
    columns.push({
      span: 24 / columnCount,
      key: columnId,
      slot: columnId,
      widthOption: WidthUnitEnum.Span,
      width: 300,
      colStyle: {}
    });
    slot.add(columnId, slotTitle);
  }

  const rowId = uuid();
  const row: IRow = {
    key: rowId,
    justify: JustifyTypeEnum.Start,
    align: AlignTypeEnum.Stretch,
    gutter: [0, 0],
    wrap: true,
    columns
  };
  data.rows.push(row);
}
// 添加列
export function addColumn({ data, focusArea, slot }: EditorResult<Data>) {
  if (!focusArea) return;
  const item = getRowItem(data, focusArea);
  const lastColumn = item.columns[item.columns.length > 0 ? item.columns.length - 1 : 0];
  const id = uuid();
  const column = {
    key: id,
    slot: id,
    widthOption: WidthUnitEnum.Span,
    width: 300,
    colStyle: {},
    span: lastColumn ? (lastColumn.span as number) : 4
  };

  item.columns.push(column);
  const title = generateColumnsTitle(24 / column?.span);
  slot.add(id, title);
}
// 复制行
export function copyRow({ data, focusArea, slot }: EditorResult<Data>) {
  if (!focusArea) return;
  const copyItem: IRow = getRowItem(data, focusArea);
  const rowId = uuid();
  const columns = copyItem.columns.map((item) => {
    const key = uuid();
    const newItem = {
      ...item,
      key: key,
      slot: key
    };
    slot.add(key, 'col-默认');
    updateColumnsTitle(newItem, slot);
    return newItem;
  });
  const row: IRow = {
    ...copyItem,
    key: rowId,
    columns
  };
  data.rows.push(JSON.parse(JSON.stringify(row)));
}

// 列等分
export function divideColumn({ data, focusArea, slot }: EditorResult<Data>) {
  if (!focusArea) return;

  const item = getRowItem(data, focusArea);
  const colNum = item.columns.length;
  const span = Math.floor(24 / colNum);
  const lastSpan = 24 - span * colNum + span;
  const slotTitle = generateColumnsTitle(item.columns.length);

  item.columns.forEach((item, index) => {
    item.widthOption = WidthUnitEnum.Span;
    item.span = index + 1 === colNum ? lastSpan : span;
    slot.setTitle(item.slot, slotTitle);
    return { ...item };
  });
}

export function getRowIndex(focusArea) {
  return ~~focusArea?.dataset?.rowIndex;
}
// 获取行数据
export function getRowItem(data: Data, focusArea: any) {
  const index = getRowIndex(focusArea);
  return data.rows[index];
}

export function getColIndex(focusArea: any) {
  const [rowIndex, colIndex]: number[] = JSON.parse(focusArea.dataset.index);
  return [rowIndex, colIndex];
}
// 获取列数据
export function getColItem(data: Data, focusArea: any) {
  const [rowIndex, colIndex]: number[] = getColIndex(focusArea);
  return data.rows[rowIndex] && data.rows[rowIndex].columns[colIndex];
}

// 重新计算列标题
export function updateColumnsTitle(col: ColumnParams, slot: any) {
  switch (col.widthOption) {
    case WidthUnitEnum.Span:
      slot.setTitle(col.slot, `col-${col.span} (${((col.span / 24) * 100).toFixed(2)}%)`);
      break;
    case WidthUnitEnum.Px:
      slot.setTitle(col.slot, `col-${col.width}px`);
      break;
    case WidthUnitEnum.Auto:
      slot.setTitle(col.slot, `col-自适应`);
      break;
    case WidthUnitEnum.Media:
      slot.setTitle(col.slot, `col-响应式`);
      break;
    default:
      slot.setTitle(col.slot, `col-默认`);
      break;
  }
}
