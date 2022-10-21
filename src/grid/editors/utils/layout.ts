import { uuid } from '../../../utils';
import { ColumnParams, JustifyTypeEnum, AlignTypeEnum, IRow } from '../../constants';
import { createColByWidth, createAutoCol } from './common';
export const twoColLayout = (data, slot) => {
  const columns: ColumnParams[] = [];
  const leftCol = createColByWidth(280);
  slot.add(leftCol.slot, `固定（280px）`);
  columns.push(leftCol);

  const rightCol = createAutoCol();
  slot.add(rightCol.slot, '自适应');
  columns.push(rightCol);

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
};

export const threeColLayout = (data, slot) => {
  const columns: ColumnParams[] = [];
  const leftCol = createColByWidth(280);
  slot.add(leftCol.slot, '固定（280px）');
  columns.push(leftCol);

  const centerCol = createAutoCol();
  slot.add(centerCol.slot, '自适应');
  columns.push(centerCol);

  const rightCol = createColByWidth(280);
  slot.add(rightCol.slot, '固定（280px）');
  columns.push(rightCol);

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
};
