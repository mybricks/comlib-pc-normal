import React, { useMemo } from 'react';
import { IColumn } from '../../types';
import { DefaultRowKey, InputIds } from '../../constants';

interface Props {
  value: any;
  record: any;
  slots: any;
  colKey: any;
  slotId: any;
  keepDataIndex: any;
  colIndex: number;
  rowKey: string;
}

export default React.memo((props: Props): JSX.Element | null => {
  const { value, record, colIndex, slotId, keepDataIndex, colKey, slots } = props;
  const { [DefaultRowKey]: rowKeyValue, ...rowRecord } = record || {};

  if (!slotId || !slots[slotId]?.render) {
    return null;
  }

  if (!keepDataIndex) {
    return slots[slotId]?.render({
      inputValues: {
        [InputIds.SLOT_ROW_RECORD]: {
          ...rowRecord
        },
        [InputIds.INDEX]: colIndex
      },
      key: `${InputIds.SLOT_ROW_RECORD}-${colIndex}-${colKey}`
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
    key: `${InputIds.SLOT_ROW_RECORD}-${colIndex}-${colKey}`
  });
});
