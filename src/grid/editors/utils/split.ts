import { WidthUnitEnum, Data } from '../../constants';
import {
  createAutoCol,
  createColByWidth,
  createColBySpan,
  getColIndex,
  getColItem,
  generateColumnsTitle,
  updateCol
} from './common';
/**
 * 1，栅格布局，固定宽度，flex布局支持拆分
 * 2，栅格最小span=1
 */
const splitStrategy = {
  [WidthUnitEnum.Auto]: ({ data, focusArea, slot }: EditorResult<Data>) => {
    const [rowIndex, colIndex] = getColIndex(data, focusArea);
    const row = data.rows[rowIndex];
    const item = row.columns[colIndex];
    const splitFlex = item.flex / 2;
    item.flex = splitFlex;
    const newCol = createAutoCol(splitFlex);
    row.columns.splice(colIndex + 1, 0, newCol);
    const title = generateColumnsTitle({ widthOption: WidthUnitEnum.Auto });
    slot.add(newCol.slot, title);
  },
  [WidthUnitEnum.Px]: ({ data, focusArea, slot }: EditorResult<Data>) => {
    const [rowIndex, colIndex] = getColIndex(data, focusArea);
    const row = data.rows[rowIndex];
    const item = row.columns[colIndex];
    const splitWidth = item.width / 2;
    item.width = splitWidth;
    const newCol = createColByWidth(splitWidth);
    row.columns.splice(colIndex + 1, 0, newCol);
    const title = generateColumnsTitle({ widthOption: WidthUnitEnum.Px, width: splitWidth });
    slot.add(newCol.slot, title);
    updateCol(row, slot);
  },
  [WidthUnitEnum.Span]: ({ data, focusArea, slot }: EditorResult<Data>) => {
    const [rowIndex, colIndex] = getColIndex(data, focusArea);
    const row = data.rows[rowIndex];
    const item = row.columns[colIndex];
    const splitSpan = item.span / 2;
    item.span = splitSpan;
    const newCol = createColBySpan(splitSpan);
    row.columns.splice(colIndex + 1, 0, newCol);
    const title = generateColumnsTitle({ widthOption: WidthUnitEnum.Span, span: splitSpan });
    slot.add(newCol.slot, title);
    updateCol(row, slot);
  }
};

export const canSplit = ({ data, focusArea }: EditorResult<Data>): boolean => {
  const item = getColItem(data, focusArea);
  return (
    item &&
    (item.widthOption === WidthUnitEnum.Span ||
      item.widthOption === WidthUnitEnum.Auto ||
      item.widthOption === WidthUnitEnum.Px) &&
    item?.span > 1
  );
};

export const splitColumn = ({ data, focusArea, slot }: EditorResult<Data>) => {
  if (!focusArea) return;
  const item = getColItem(data, focusArea);
  splitStrategy[item.widthOption]({ data, focusArea, slot });
};
