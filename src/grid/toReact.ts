import { Data, ColumnParams, WidthUnitEnum } from './constants';
export default function (props: RuntimeParams<Data>) {
  const emptyRow = getEmptyRow(props);
  const rowStr = renderRow(props);
  const str = `<div>
                ${emptyRow}
                ${rowStr}
                </div>`;

  return {
    imports: [
      {
        from: 'antd',
        coms: ['Row', 'Col', 'Tooltip']
      },
      {
        from: 'antd/dist/antd.css',
        coms: []
      }
    ],
    jsx: str,
    style: '',
    js: ''
  };
}

const getEmptyRow = ({ data }: RuntimeParams<Data>) => {
  const style = {
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 5,
    color: '#aaa'
  };
  return data.rows.length === 0 ? `<div style={${JSON.stringify(style)}}>添加行</div>` : '';
};

const renderRow = ({ data, slots, outputs }: RuntimeParams<Data>) => {
  return data.rows
    .map((row) => {
      return `<Row
        style={${JSON.stringify({
          backgroundColor: row.backgroundColor,
          minHeight: row.columns.every((column) => slots[column.slot]?.size === 0)
            ? '50px'
            : undefined
        })}}
        data-row-index={${JSON.stringify(row.key)}}
        data-type-row={${JSON.stringify(`row-${row.key}`)}}
        key={${JSON.stringify(row.key)}}
        justify={${JSON.stringify(row.justify)}}
        align={${JSON.stringify(row.align)}}
        gutter={${JSON.stringify(row.useGutter ? [row.gutter?.[0] || 0, 0] : [0, 0])}}
        wrap={${!!row.wrap}}
      >
        ${row.columns
          .map((item, colIndex) => {
            return renderCol(item, row.key, colIndex, slots, outputs);
          })
          .join('\n')}
      </Row>`;
    })
    .join('\n');
};

const renderCol = (
  column: ColumnParams,
  rowIndex: number | string,
  colIndex: number,
  slots,
  outputs
) => {
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
  const slotStr = slots[column.slot]?.render({ style: column.slotStyle });
  return `<Col
      key={${JSON.stringify(column.key)}}
      span={${column.widthOption === WidthUnitEnum.Span ? column.span : undefined}}
      flex={${JSON.stringify(flex)}}
      ${Object.keys(breakPointConfig)
        .map((key) => `${key}={${breakPointConfig[key]}}`)
        .join('\n')}
      data-col-coordinate={${JSON.stringify([rowIndex, column.key])}}
      data-type-col={${JSON.stringify(`col-${column.key}`)}}
      style={${JSON.stringify({
        ...column.colStyle,
        ...getMinMaxWidth(column),
        width,
        cursor: column.useClick ? 'pointer' : 'unset'
      })}}
    >
      ${slotStr}
    </Col>`;
};

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
