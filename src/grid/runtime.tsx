import { Row, Col } from 'antd';
import React, { useMemo, useCallback } from 'react';
import { ColumnParams, Data, WidthUnitEnum } from './constants';
import css from './runtime.less';

export default function ({ env, data, slots, outputs }: RuntimeParams<Data>) {
  const { edit } = env;

  const noRows = useMemo(() => {
    if (edit && data.rows.length <= 0) {
      return <div className={css.gridText}>添加行</div>;
    }
    return null;
  }, [data.rows.length]);

  const getMinMaxWidth = (col: ColumnParams) => {
    let minWidth, maxWidth;
    const unit = col.minMaxWidthOption || WidthUnitEnum.Auto;
    if (unit !== WidthUnitEnum.Auto) {
      minWidth = `${col.minWidth || 0}${unit}`;
      maxWidth = `${col.maxWidth || 100}${unit}`;
    } else {
      //保证最后一列自适应自动换行，且文本溢出正常省略
      minWidth = 1;
    }
    return { minWidth, maxWidth };
  };

  const column = useCallback(
    (column: ColumnParams, rowIndex: number | string, colIndex: number) => {
      let flex = '';
      let width;
      if (column.widthOption === WidthUnitEnum.Px) {
        flex = column.width + 'px';
        width = column.width + 'px';
      }
      if (column.widthOption === WidthUnitEnum.Auto) {
        flex = `${column.flex} ${column.flex} 0`;
      }
      let breakPointConfig = {};
      if (column.widthOption === WidthUnitEnum.Media) {
        Object.entries(column.breakPoints || []).map(([key, val]) => {
          isNaN(parseInt(val)) ? null : (breakPointConfig[key.split(' ')[0]] = parseInt(val));
        });
      }
      return (
        <Col
          key={column.key}
          span={column.widthOption === WidthUnitEnum.Span ? column.span : undefined}
          flex={flex}
          {...breakPointConfig}
          data-col-coordinate={JSON.stringify([rowIndex, column.key])}
          data-type-col={`col-${column.key}`}
          style={{
            ...column.colStyle,
            ...getMinMaxWidth(column),
            width,
            cursor: column.useClick ? 'pointer' : 'unset'
          }}
          onClick={() => {
            if (column.useClick && outputs[column.key]) {
              outputs[column.key](true);
            }
          }}
        >
          {slots[column.slot]?.render()}
        </Col>
      );
    },
    [slots, data]
  );

  return (
    <div className={css.gridWrapper} style={{ ...data.style }}>
      {noRows}
      {data.rows.map((row, rowIndex) => {
        return (
          <Row
            style={{
              backgroundColor: row.backgroundColor,
              minHeight:
                edit && row.columns.every((column) => slots[column.slot]?.size === 0)
                  ? '50px'
                  : undefined
            }}
            data-row-index={row.key}
            data-type-row={`row-${row.key}`}
            key={row.key}
            justify={row.justify}
            align={row.align}
            gutter={row.useGutter ? [row.gutter?.[0] || 0, 0] : [0, 0]}
            wrap={row.wrap}
          >
            {row.columns.map((item, colIndex) => {
              return column(item, row.key, colIndex);
            })}
          </Row>
        );
      })}
    </div>
  );
}
