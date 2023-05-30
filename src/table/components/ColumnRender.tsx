import React from 'react';
import { DefaultRowKey } from '../constants';
import { ContentTypeEnum, IColumn } from '../types';
import SlotRender from './Slot';
import { genFormatting } from '../../utils/dataFormatter';

interface ColumnRenderProps {
  columnItem: IColumn;
  value: any;
  record: any;
  index: number;
  slots: any;
  data: any;
  env: any;
}

export default function ColumnRender(props: ColumnRenderProps) {
  const { columnItem, record, index, slots, env, data } = props;

  let oriValue = props.value ?? null;

  if (columnItem?.formatData && !env.edit) {
    // 格式化数据时，如果是表达式传入index、行数据、当前cell数据
    const valueToBeFormat = ['EXPRESSION', 'CUSTOMSCRIPT'].includes(
      columnItem?.formatData?.formatterName
    )
      ? {
          index,
          rowRecord: record,
          value: oriValue
        }
      : oriValue;
    oriValue = genFormatting(columnItem.formatData)(valueToBeFormat);
  }

  let value = oriValue;

  try {
    value =
      value && ['object', 'function', 'boolean'].includes(typeof value)
        ? JSON.stringify(value)
        : value;
  } catch (e) {
    console.error('JSON.stringify失败', value, e);
  }

  switch (columnItem.contentType) {
    case ContentTypeEnum.Text:
      return value;
    case ContentTypeEnum.SlotItem:
      return (
        <SlotRender
          rowKey={data.rowKey || DefaultRowKey}
          value={oriValue}
          record={record}
          columnItem={columnItem}
          colIndex={index}
          slots={slots}
        />
      );
    default:
      return value;
  }
}
