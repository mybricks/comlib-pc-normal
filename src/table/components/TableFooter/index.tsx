import React from 'react';
import classnames from 'classnames';
import { Data, RowSelectionPostionEnum, RowSelectionTypeEnum } from '../../types';
import RenderBatchBtns from '../BatchSelectBtns';
import css from './style.less';

interface Props {
  env: Env;
  data: Data;
  slots: any;
  selectedRows: any[];
  selectedRowKeys: string[];
}

export default (props: Props): JSX.Element => {
  const { data } = props;

  const useBottomRowSelection =
    data.useRowSelection &&
    data.selectionType !== RowSelectionTypeEnum.Radio &&
    (data.rowSelectionPostion || []).includes(RowSelectionPostionEnum.BOTTOM);

  return (
    <div className={classnames(css.footerContainer, useBottomRowSelection && css.marginTop)}>
      {useBottomRowSelection && RenderBatchBtns(props)}
    </div>
  );
};
