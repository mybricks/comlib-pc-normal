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
  return `col-${24 / columnCount}`;
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
  //最后一列默认“自动填充”需求
  updateCol(row, slot)
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

export const addColumnByPosition = ({ data, focusArea, slot }: EditorResult<Data>, position?: 'before' | 'after') => {
  if (!focusArea) return;
  const [rowIndex, colIndex] = getColIndex(focusArea)
  const row = data.rows[rowIndex]
  const lastColumn = row.columns[colIndex]
  const id = uuid();
  const column = {
    key: id,
    slot: id,
    widthOption: WidthUnitEnum.Span,
    width: 300,
    colStyle: {},
    span: (lastColumn.span as number) || 4
  };
  if (position === 'before') {
    row.columns.splice(colIndex, 0, column)
  } else if (position === 'after') {
    row.columns.splice(colIndex + 1, 0, column)
  }
  const title = generateColumnsTitle(24 / column?.span);
  slot.add(id, title);
}

// 复制行
export function copyRow({ data, focusArea, slot }: EditorResult<Data>, position?: 'before' | 'after') {
  if (!focusArea) return;
  const rowIndex = getRowIndex(focusArea)
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
  if (position === 'before') {
    data.rows.splice(rowIndex, 0, JSON.parse(JSON.stringify(row)))
  } else if (position === 'after') {
    data.rows.splice(rowIndex + 1, 0, JSON.parse(JSON.stringify(row)))
  }
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
      slot.setTitle(col.slot, `col-${col.span}`);
      break;
    case WidthUnitEnum.Px:
      slot.setTitle(col.slot, `固定（${col.width}px）`);
      break;
    case WidthUnitEnum.Auto:
      slot.setTitle(col.slot, `自适应`);
      break;
    case WidthUnitEnum.Media:
      slot.setTitle(col.slot, `响应式`);
      break;
    default:
      slot.setTitle(col.slot, `默认`);
      break;
  }
}

//更新行，最后一列默认“自动填充”
export const updateCol = (row, slot) => {
  const autoColIndex = row.columns.findIndex(({ widthOption }) => widthOption === WidthUnitEnum.Auto)
  //除了最后一列，前面有“自动填充”列，不处理
  if (autoColIndex >= 0 && autoColIndex < row.columns.length - 1) return
  //否则，保证最后一列是“自动填充”
  row.columns.forEach((col, index) => {
    if(index===row.columns.length - 1){
      col.widthOption = 'auto';
    }
    updateColumnsTitle(col, slot)
  });
}

const createColByWidth = (width: number = 280) => {
  const id = uuid()
  return {
    key: id,
    slot: id,
    widthOption: WidthUnitEnum.Px,
    width,
    span: 4,
    colStyle: {}
  }
}

const createAutoCol = () => {
  const id = uuid()
  return {
    key: id,
    slot: id,
    widthOption: WidthUnitEnum.Auto,
    width: 300,
    span: 4,
    colStyle: {}
  }
}

export const twoColLayout = (data, slot) => {
  const columns: ColumnParams[] = [];
  const leftCol = createColByWidth(280)
  slot.add(leftCol.slot, `固定（280px）`);
  columns.push(leftCol)

  const rightCol = createAutoCol()
  slot.add(rightCol.slot, '自适应');
  columns.push(rightCol)

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

export const threeColLayout = (data, slot) => {
  const columns: ColumnParams[] = [];
  const leftCol = createColByWidth(280)
  slot.add(leftCol.slot, '固定（280px）');
  columns.push(leftCol)

  const centerCol = createAutoCol()
  slot.add(centerCol.slot, '自适应');
  columns.push(centerCol)

  const rightCol = createColByWidth(280)
  slot.add(rightCol.slot, '固定（280px）');
  columns.push(rightCol)

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
