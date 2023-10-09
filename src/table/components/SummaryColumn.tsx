import { Table } from 'antd';
import React from 'react';
import { Data } from '../types';
import { uuid } from '../../utils';

export default (slots, data: Data, summaryColumnData: string) => {
  const { summaryCellTitleCol, summaryColumnContentType, columns } = data;
  const SummaryColumnContentColSpan =
    columns.length - summaryCellTitleCol < 0 ? 0 : columns.length - summaryCellTitleCol;
  let SummaryCellTitleColSpan: number = summaryCellTitleCol < 0 ? 0 : summaryCellTitleCol;
  if (SummaryCellTitleColSpan > columns.length) {
    SummaryCellTitleColSpan = columns.length;
  }
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
          index={1}
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
