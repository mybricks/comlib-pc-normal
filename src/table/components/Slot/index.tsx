import React from 'react';
import { IColumn } from '../../types';
import { InputIds } from '../../constants';

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
  const slotId = columnItem?.slotId;

  if (!slotId || !slots[slotId]?.render) {
    return null;
  }

  if (!columnItem.keepDataIndex) {
    return slots[slotId]?.render({
      inputValues: {
        [InputIds.SLOT_ROW_RECORD]: {
          ...record
        },
        [InputIds.INDEX]: colIndex
      },
      key: `${InputIds.SLOT_ROW_RECORD}-${colIndex}-${columnItem.key}`
    });
  }

  return slots[slotId]?.render({
    inputValues: {
      [InputIds.SLOT_ROW_RECORD]: {
        ...record
      },
      [InputIds.SLOT_ROW_VALUE]: value,
      [InputIds.INDEX]: colIndex
    },
    key: `${InputIds.SLOT_ROW_RECORD}-${colIndex}-${columnItem.key}`
  });
});
