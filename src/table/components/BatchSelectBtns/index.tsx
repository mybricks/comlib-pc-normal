import React from 'react';
import classnames from 'classnames';
import { Data, RowSelectionTypeEnum } from '../../types';
import { InputIds, SlotIds } from '../../constants';
import css from './style.less';

interface Props {
  env: Env;
  data: Data;
  slots: any;
  selectedRows: any[];
  selectedRowKeys: string[];
}

export default (props: Props): JSX.Element | null => {
  const { env, data, slots, selectedRows, selectedRowKeys } = props;

  if (!data.useRowSelection || data.selectionType === RowSelectionTypeEnum.Radio) {
    return null;
  }
  const isEmpty = slots[SlotIds.ROW_SELECTION_OPERATION]?.size === 0;

  return (
    <div className={css.width100} data-table-batch-action>
      <div className={css.flex}>
        <div className={css.selectedWrap}>
          <div className={classnames(isEmpty && env.edit && css.emptyWrap)}>
            {slots[SlotIds.ROW_SELECTION_OPERATION].render({
              inputValues: {
                [InputIds.ROW_SELECTION_SELECTED_ROW_KEYS]: selectedRowKeys,
                [InputIds.ROW_SELECTION_SELECTED_ROWS]: selectedRows
              },
              key: `${SlotIds.ROW_SELECTION_OPERATION}-${JSON.stringify(selectedRowKeys)}`
            })}
          </div>
          <div className={css.selectedInfo}>
            已选中
            <span style={{ marginLeft: 2 }}>{selectedRowKeys.length}</span>
            <span
              className={css.blue}
              style={{
                marginLeft: 2,
                marginRight: data.rowSelectionLimit ? 0 : 2
              }}
            >
              {data.rowSelectionLimit ? `/${data.rowSelectionLimit}` : ''}
            </span>
            项
          </div>
        </div>
      </div>
    </div>
  );
};
