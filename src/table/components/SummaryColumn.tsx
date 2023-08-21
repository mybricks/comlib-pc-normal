import { Table } from 'antd';
import React from 'react';
import { Data } from '../types';
import { uuid } from '../../utils';

export default (slots, data: Data, summaryColumnData: string) => {
  const { SummaryCellTitleCol, SummaryColumnContentType, columns } = data;
  const SummaryColumnContentColSpan =
    columns.length - SummaryCellTitleCol < 0 ? 0 : columns.length - SummaryCellTitleCol;
  let SummaryCellTitleColSpan: number = SummaryCellTitleCol < 0 ? 0 : SummaryCellTitleCol;
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
          {data.SummaryColumnTitle}
        </Table.Summary.Cell>
        <Table.Summary.Cell
          index={1}
          key={uuid()}
          className={SummaryColumnContentType === 'text' ? 'summaryCellContent' : ''}
          colSpan={SummaryColumnContentColSpan}
        >
          {SummaryColumnContentType === 'slotItem'
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
