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
      const rowStyle = !!row.backgroundColor
        ? `style={{backgroundColor: ${row.backgroundColor}}}`
        : '';
      return `<Row
        ${rowStyle}
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
  if (column.widthOption === WidthUnitEnum.Auto) {
    flex = `flex={"${column.flex} ${column.flex} 0"}`;
  }
  let breakPointConfig = {};
  if (column.widthOption === WidthUnitEnum.Media) {
    Object.entries(column.breakPoints || []).map(([key, val]) => {
      isNaN(parseInt(val)) ? null : (breakPointConfig[key.split(' ')[0]] = parseInt(val));
    });
  }
  const slotStr = slots[column.slot]?.render({ style: column.slotStyle });
  const span = column.widthOption === WidthUnitEnum.Span ? `span={${column.span}}` : '';
  return `<Col
      ${span}
      ${flex}
      ${Object.keys(breakPointConfig)
        .map((key) => `${key}={${breakPointConfig[key]}}`)
        .join('\n')}
      style={${JSON.stringify({
        ...column.colStyle,
        ...getMinMaxWidth(column),
        width:
          column.widthOption === WidthUnitEnum.Px ? `${column.width}${WidthUnitEnum.Px}` : 'unset',
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
