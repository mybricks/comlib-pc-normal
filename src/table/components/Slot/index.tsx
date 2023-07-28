import React from 'react';
import { IColumn } from '../../types';
import { DefaultRowKey, InputIds } from '../../constants';

interface Props {
  value: any;
  record: any;
  columnItem: IColumn;
  slots: any;
  colIndex: number;
  rowKey: string;
}

export default React.memo((props: Props): JSX.Element | null => {
  const { value, record, colIndex, columnItem, slots } = props;
  const { [DefaultRowKey]: rowKeyValue, ...rowRecord } = record || {};
  const slotId = columnItem?.slotId;

  if (!slotId || !slots[slotId]?.render) {
    return null;
  }

  if (!columnItem.keepDataIndex) {
    return slots[slotId]?.render({
      inputValues: {
        [InputIds.SLOT_ROW_RECORD]: {
          ...rowRecord
        },
        [InputIds.INDEX]: colIndex
      },
      key: `${InputIds.SLOT_ROW_RECORD}-${colIndex}-${columnItem.key}`
    });
  }

  return slots[slotId]?.render({
    inputValues: {
      [InputIds.SLOT_ROW_RECORD]: {
        ...rowRecord
      },
      [InputIds.SLOT_ROW_VALUE]: value,
      [InputIds.INDEX]: colIndex
    },
    key: `${InputIds.SLOT_ROW_RECORD}-${colIndex}-${columnItem.key}`
  });
});
