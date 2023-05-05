import { uuid } from '../../../utils';
import {
  Data,
  ColumnParams,
  JustifyTypeEnum,
  AlignTypeEnum,
  WidthUnitEnum,
  IRow
} from '../../constants';
import {
  generateColumnsTitle,
  createColBySpan,
  getRowItem,
  getColIndex,
  getRowIndex,
  updateSlotTitle,
  updateCol
} from './common';
// 添加行
export function addRow({ data, slot }: EditorResult<Data>, columnCount: number) {
  const columns: ColumnParams[] = [];
  const slotTitle = generateColumnsTitle({
    widthOption: WidthUnitEnum.Span,
    span: 24 / columnCount
  });

  for (let i = 0; i < columnCount; i++) {
    const column = createColBySpan(24 / columnCount);
    columns.push(column);
    slot.add(column.slot, slotTitle);
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
  updateCol(row, slot);
  data.rows.push(row);
}

// 添加列
export function addColumn({ data, focusArea, slot }: EditorResult<Data>) {
  if (!focusArea) return;
  const item = getRowItem(data, focusArea);
  const lastColumn = item.columns[item.columns.length > 0 ? item.columns.length - 1 : 0];
  const column = createColBySpan(lastColumn?.span || 4);
  item.columns.push(column);
  const title = generateColumnsTitle({
    widthOption: WidthUnitEnum.Span,
    span: lastColumn?.span || 4
  });
  slot.add(column.slot, title);
}

export const addColumnByPosition = (
  { data, focusArea, slot }: EditorResult<Data>,
  position?: 'before' | 'after'
) => {
  if (!focusArea) return;
  const [rowIndex, colIndex] = getColIndex(data, focusArea);
  const row = data.rows[rowIndex];
  const lastColumn = row.columns[colIndex];
  const column = createColBySpan(lastColumn.span || 4);
  if (position === 'before') {
    row.columns.splice(colIndex, 0, column);
  } else if (position === 'after') {
    row.columns.splice(colIndex + 1, 0, column);
  }
  const title = generateColumnsTitle({
    widthOption: WidthUnitEnum.Span,
    span: lastColumn.span || 4
  });
  slot.add(column.slot, title);
};

// 复制行
export function copyRow(
  { data, focusArea, slot }: EditorResult<Data>,
  position?: 'before' | 'after'
) {
  if (!focusArea) return;
  const rowIndex = getRowIndex(data, focusArea);
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
    updateSlotTitle(newItem, slot);
    return newItem;
  });
  const row: IRow = {
    ...copyItem,
    key: rowId,
    columns
  };
  if (position === 'before') {
    data.rows.splice(rowIndex, 0, JSON.parse(JSON.stringify(row)));
  } else if (position === 'after') {
    data.rows.splice(rowIndex + 1, 0, JSON.parse(JSON.stringify(row)));
  }
}

// 列等分
export function divideColumnByAuto({ data, focusArea, slot }: EditorResult<Data>) {
  if (!focusArea) return;

  const item = getRowItem(data, focusArea);
  const slotTitle = generateColumnsTitle({ widthOption: WidthUnitEnum.Auto });

  item.columns.forEach((item, index) => {
    item.widthOption = WidthUnitEnum.Auto;
    item.flex = 1;
    slot.setTitle(item.slot, slotTitle);
    return { ...item };
  });
}

export function divideColumnBySpan({ data, focusArea, slot }: EditorResult<Data>) {
  if (!focusArea) return;
  const item = getRowItem(data, focusArea);
  const colNum = item.columns.length;
  const span = Math.floor(24 / colNum);
  const lastSpan = 24 - span * colNum + span;
  item.columns.forEach((item, index) => {
    item.widthOption = WidthUnitEnum.Span;
    item.span = index + 1 === colNum ? lastSpan : span;
    const slotTitle = generateColumnsTitle({
      widthOption: WidthUnitEnum.Span,
      span: index + 1 === colNum ? lastSpan : span
    });
    slot.setTitle(item.slot, slotTitle);
    return { ...item };
  });
}
