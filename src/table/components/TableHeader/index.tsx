import React from 'react';
import classnames from 'classnames';
import { Data, RowSelectionPostionEnum, RowSelectionTypeEnum } from '../../types';
import { SlotIds } from '../../constants';
import FilterColumnRender from '../FilterColumn';
import RenderBatchBtns from '../BatchSelectBtns';
import css from './style.less';

interface Props {
  env: Env;
  data: Data;
  slots: any;
  outputs: any;
  dataSource: any[];
  selectedRows: any[];
  selectedRowKeys: string[];
  headerRef: React.RefObject<HTMLDivElement>;
}

export default (props: Props): JSX.Element | null => {
  const { data, slots, env, dataSource, outputs, headerRef } = props;

  // 顶部显示批量操作按钮
  const useTopRowSelection =
    data.useRowSelection &&
    data.selectionType !== RowSelectionTypeEnum.Radio &&
    (data.rowSelectionPostion || []).includes(RowSelectionPostionEnum.TOP);

  // 表格头部 操作区渲染
  const renderTableBtns = () => {
    if (data.useHeaderOperationSlot && slots[SlotIds.HEADER_OPERATION]) {
      const isEmpty = slots[SlotIds.HEADER_OPERATION].size === 0;
      return (
        <div data-table-header-tablebtns className={classnames(isEmpty && css.emptyWrap)}>
          {slots[SlotIds.HEADER_OPERATION].render()}
        </div>
      );
    }
    return null;
  };

  // 表格头部 标题区渲染
  const renderTableTitle = () => {
    if (data.useHeaderTitleSlot && slots[SlotIds.HEADER_TITLE]) {
      return slots[SlotIds.HEADER_TITLE].render();
    }
    return null;
  };

  return (
    <div
      ref={headerRef}
      data-table-header-container
      className={classnames(
        css.headerContainer,
        useTopRowSelection && css.flexDirectionColumn,
        (useTopRowSelection ||
          data.useHeaderTitleSlot ||
          data.useHeaderOperationSlot ||
          data.useColumnSetting) &&
          css.marginBottom
      )}
    >
      {renderTableTitle()}
      {(useTopRowSelection || data.useHeaderOperationSlot || data.useColumnSetting) && (
        <div className={classnames(css.actionBtnsWrap, css.width100)}>
          {/* 渲染顶部操作按钮 */}
          {useTopRowSelection && RenderBatchBtns(props)}
          <div className={classnames(css.width100, css.flex, css.flexRowReverse)}>
            {/* 渲染工作区tools */}
            {data.useColumnSetting && (
              <div data-table-header-tools>
                <FilterColumnRender
                  data={data}
                  env={env}
                  dataSource={dataSource}
                  outputs={outputs}
                />
              </div>
            )}
            {/* 渲染操作按钮 */}
            {renderTableBtns()}
          </div>
        </div>
      )}
    </div>
  );
};
