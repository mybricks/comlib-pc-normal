import { Table } from 'antd';
import React from 'react';
import { Data } from '../types';
import { uuid } from '../../utils';

export default (slots, data: Data, summaryColumnData: string) => {
  const { summaryCellTitleCol, summaryColumnContentType, columns, useRowSelection } = data;

  // 过滤出可见的列
  const visibleColumns = columns.filter((col) => col.visible !== false);
  const visibleColumnCount = visibleColumns.length;

  // 考虑勾选列
  const hasSelectionColumn = !!useRowSelection;
  const totalVisibleColumns = hasSelectionColumn ? visibleColumnCount + 1 : visibleColumnCount;

  // 根据可见列和勾选列重新计算跨列数
  const SummaryColumnContentColSpan = Math.max(0, totalVisibleColumns - summaryCellTitleCol);
  let SummaryCellTitleColSpan = Math.min(Math.max(0, summaryCellTitleCol), totalVisibleColumns);

  return (
    <Table.Summary>
      <Table.Summary.Row className="summaryRow" key={uuid()}>
        <Table.Summary.Cell
          index={0}
          key={uuid()}
          className="summaryCellTitle"
          colSpan={SummaryCellTitleColSpan}
        >
          {data.summaryColumnTitle}
        </Table.Summary.Cell>
        <Table.Summary.Cell
          index={hasSelectionColumn ? 2 : 1}
          key={uuid()}
          className={summaryColumnContentType === 'text' ? 'summaryCellContent' : ''}
          colSpan={SummaryColumnContentColSpan}
        >
          {summaryColumnContentType === 'slotItem'
            ? slots['summaryColumn'] &&
              slots['summaryColumn']?.render({
                key: `summaryColumn-${uuid()}`
              })
            : summaryColumnData}
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
};
