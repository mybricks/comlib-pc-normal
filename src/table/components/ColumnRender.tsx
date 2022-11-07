import React from 'react';
import { DefaultRowKey } from '../constants';
import { ContentTypeEnum, IColumn } from '../types';
import SlotRender from './Slot';

interface ColumnRenderProps {
  columnItem: IColumn;
  value: any;
  record: any;
  index: number;
  slots: any;
  data: any;
}

export default function ColumnRender(props: ColumnRenderProps) {
  const { columnItem, record, index, slots, data } = props;

  const oriValue = props.value;
  let value = oriValue;
  try {
    value = value && ['object', 'function'].includes(typeof value) ? JSON.stringify(value) : value;
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
