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
        form: 'antd',
        coms: ['Row', 'Col', 'Tooltip']
      },
      {
        form: 'antd/dist/antd.css',
        coms: []
      }
    ],
    jsx: str,
    style: '',
    js: ''
  };
}

const getEmptyRow = ({ data, env }: RuntimeParams<Data>) => {
  const style = {
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 5,
    color: '#aaa'
  };
  return data.rows.length === 0 && env.edit
    ? `<div style={${JSON.stringify(style)}}>添加行</div>`
    : '';
};

const renderRow = ({ data, slots, env, outputs }: RuntimeParams<Data>) => {
  return data.rows
    .map((row) => {
      return `<Row
        style={${JSON.stringify({
          backgroundColor: row.backgroundColor,
          minHeight:
            env.edit && row.columns.every((column) => slots[column.slot]?.size === 0)
              ? '50px'
              : undefined
        })}}
        data-row-index={${row.key}}
        data-type-row={${`row-${row.key}`}}
        key={${row.key}}
        justify={${row.justify}}
        align={${row.align}}
        gutter={${row.useGutter ? [row.gutter?.[0] || 0, 0] : [0, 0]}}
        wrap={${row.wrap}}
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
      key={${column.key}}
      span={${column.widthOption === WidthUnitEnum.Span ? column.span : undefined}}
      flex={${flex}}
      ${Object.keys(breakPointConfig)
        .map((key) => `${key}={${breakPointConfig[key]}}`)
        .join('\n')}
      data-col-coordinate={${JSON.stringify([rowIndex, column.key])}}
      data-type-col={${`col-${column.key}`}}
      style={${JSON.stringify({
        ...column.colStyle,
        ...getMinMaxWidth(column),
        width,
        cursor: column.useClick ? 'pointer' : 'unset'
      })}}
      onClick={${JSON.stringify(() => {
        if (column.useClick && outputs[column.key]) {
          outputs[column.key](true);
        }
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
