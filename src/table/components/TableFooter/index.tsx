import React from 'react';
import classnames from 'classnames';
import { Data, RowSelectionPostionEnum, RowSelectionTypeEnum } from '../../types';
import RenderBatchBtns from '../BatchSelectBtns';
import Pagination from '../Paginator';
import css from './style.less';

interface Props {
  env: Env;
  parentSlot: any;
  data: Data;
  slots: any;
  inputs: any;
  outputs: any;
  selectedRows: any[];
  selectedRowKeys: string[];
}

export default (props: Props): JSX.Element => {
  const { data, env, inputs, outputs } = props;

  const useBottomRowSelection =
    data.useRowSelection &&
    data.selectionType !== RowSelectionTypeEnum.Radio &&
    (data.rowSelectionPostion || []).includes(RowSelectionPostionEnum.BOTTOM);

  return (
    <div
      className={classnames(
        css.footerContainer,
        (useBottomRowSelection || data.usePagination) && css.marginTop
      )}
    >
      {useBottomRowSelection && RenderBatchBtns(props)}
      {data.usePagination && (
        <div
          className={classnames(css.pagination)}
          style={{
            width: useBottomRowSelection ? '' : '100%',
            justifyContent: data.paginationConfig.align
          }}
        >
          <Pagination
            env={env}
            parentSlot={props.parentSlot}
            data={data.paginationConfig}
            inputs={inputs}
            outputs={outputs}
          />
        </div>
      )}
    </div>
  );
};
