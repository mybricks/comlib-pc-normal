import { SlotLayoutEditor } from '../components/editors/SlotLayoutEditor';
import { uuid, unitConversion, deepCopy } from '../utils';
import {
  Data,
  IRow,
  JustifyType,
  AlignType,
  ColumnParams
} from './runtime';

interface Result {
  data: Data;
  focusArea: any;
  output: any;
  slot: any;
}

function getRowItem(data: Data, focusArea: any) {
  const index = ~~focusArea.dataset.rowIndex;
  return data.rows[index];
}

function getColItem(data: Data, focusArea: any) {
  const [rowIndex, colIndex]: number[] = getColIndex(focusArea);
  return data.rows[rowIndex] && data.rows[rowIndex].columns[colIndex];
}

function getColIndex(focusArea: any) {
  const [rowIndex, colIndex]: number[] = JSON.parse(focusArea.dataset.index);

  return [rowIndex, colIndex];
}

function setRowColumnsForEvenlySpan(columns: ColumnParams[]) {
  const [span, lastSpan] = evenlySplitSpan(columns.length);
  columns.map((item, index) => {
    if (index + 1 === columns.length && lastSpan !== 0) {
      item.widthOption = 'span';
      item.span = lastSpan;
      return { ...item };
    }
    item.widthOption = 'span';
    item.span = span;
    return { ...item };
  });
}

function evenlySplitSpan(columnCount: number, nextCount?: number) {
  if (!nextCount) {
    nextCount = columnCount;
  }

  if (Math.floor(24 / nextCount) * columnCount > 24) {
    return evenlySplitSpan(columnCount, nextCount - 1);
  }

  const span = Math.floor(24 / nextCount);
  const lastSpan = 24 - span * columnCount + span;

  return [span, lastSpan];
}

function copyColumns(columns: ColumnParams[]) {
  const copy = {
    columns: [] as ColumnParams[],
    columnIds: [] as string[]
  };

  columns.map((item) => {
    const columnId = uuid();
    item.key = columnId;
    item.slot = columnId;
    copy.columns.push({ ...item });
    copy.columnIds.push(columnId);
  });

  return copy;
}

function generateColumns(columnCount: number) {
  const results = {
    columns: [] as ColumnParams[],
    columnIds: [] as string[]
  };

  for (let i = 0; i < columnCount; i++) {
    const columnId = uuid();
    results.columns.push({
      flex: 'row',
      justify: 'flex-start',
      align: 'center',
      span: 24 / columnCount,
      key: columnId,
      slot: columnId,
      widthOption: 'span',
      width: 300,
      colStyle: {}
    });

    results.columnIds.push(columnId);
  }

  return results;
}

function generateColumnsTitle(columnCount: number) {
  return `col-${24 / columnCount} (${(100 / columnCount).toFixed(2)}%)`;
}

// 重新计算列标题
function updateColumnsTitle(col: ColumnParams, slot: any) {
  switch (col.widthOption) {
    case 'span':
      slot.setTitle(col.slot, `col-${col.span} (${((col.span / 24) * 100).toFixed(2)}%)`);
      break;
    case 'px':
      slot.setTitle(col.slot, `col-${col.width}px`);
      break;
    case 'auto':
      slot.setTitle(col.slot, `col-自适应`);
      break;
    case '@media':
      slot.setTitle(col.slot, `col-响应式`);
      break;
    default:
      slot.setTitle(col.slot, `col-默认`);
  }
}

function calculateSpans(data: Data, focusArea: any) {
  const [rowIndex, colIndex]: number[] = getColIndex(focusArea);
  let existSpans = 0;
  data.rows[rowIndex].columns.forEach((column, index) => {
    if (index !== colIndex) {
      existSpans += column.span as number;
    }
  });

  return 24 - existSpans;
}

export default {
  ':root': [
    {
      title: '样式',
      type: 'style',
      options: ['BGCOLOR', 'BORDER', 'BGIMAGE'],
      value: {
        get({ data }: Result) {
          return data.style;
        },
        set({ data }: Result, value: any) {
          if (!data.style) {
            data.style = {};
          }
          data.style = {
            ...data.style,
            ...value
          };
        }
      }
    },
    {
      title: '添加行',
      type: 'Button',
      value: {
        set({ data, slot }: Result) {
          const columnCount = 1;
          const rowId = uuid();
          const columnsInfo = generateColumns(columnCount);
          const row: IRow = {
            key: rowId,
            justify: 'start',
            gutter: [4, 4],
            align: 'middle',
            columns: columnsInfo.columns
          };

          const title = generateColumnsTitle(columnCount);
          columnsInfo.columnIds.forEach((columnId) => slot.add(columnId, title));
          data.rows.push(row);
        }
      }
    },
    {
      title: '添加行(2列)',
      type: 'Button',
      value: {
        set({ data, slot }: Result) {
          const columnCount = 2;
          const rowId = uuid();
          const columnsInfo = generateColumns(columnCount);
          const row: IRow = {
            key: rowId,
            justify: 'start',
            gutter: [4, 4],
            align: 'middle',
            columns: columnsInfo.columns
          };

          const title = generateColumnsTitle(columnCount);
          columnsInfo.columnIds.forEach((columnId) => slot.add(columnId, title));
          data.rows.push(row);
        }
      }
    },
    {
      title: '添加行(3列)',
      type: 'Button',
      value: {
        set({ data, slot }: Result) {
          const columnCount = 3;
          const rowId = uuid();
          const columnsInfo = generateColumns(columnCount);
          const row: IRow = {
            key: rowId,
            justify: 'start',
            gutter: [4, 4],
            align: 'middle',
            columns: columnsInfo.columns
          };

          const title = generateColumnsTitle(columnCount);
          columnsInfo.columnIds.forEach((columnId) => slot.add(columnId, title));
          data.rows.push(row);
        }
      }
    },
    {
      title: '宽度设置',
      items: [
        {
          type: 'Select',
          options: [
            { value: '%', label: '百分比宽度' },
            { value: 'px', label: '固定宽度' }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.widthUnit || '%';
            },
            set({ data, style }: EditorResult<Data>, value: string) {
              data.widthUnit = value;
              style.width = parseInt(style.width, 10) + value;
            }
          }
        },
        {
          title: '百分比宽度(%)',
          type: 'Text',
          options: {
            type: 'number',
            placeholder: '设置百分比宽度/%'
          },
          ifVisible({ data }: EditorResult<Data>) {
            return data.widthUnit !== 'px';
          },
          value: {
            get({ style }: EditorResult<Data>) {
              return parseInt(style.width, 10);
            },
            set({ style }: EditorResult<Data>, value: string) {
              style.width = value ? `${value}%` : '100%';
            }
          }
        },
        {
          title: '固定宽度(px)',
          type: 'Text',
          options: {
            type: 'number',
            placeholder: '设置固定宽度/px'
          },
          ifVisible({ data }: EditorResult<Data>) {
            return data.widthUnit === 'px';
          },
          value: {
            get({ style }: EditorResult<Data>) {
              return parseInt(style.width, 10);
            },
            set({ style }: EditorResult<Data>, value: string) {
              style.width = value ? `${value}px` : '100%';
            }
          }
        }
      ]
    },
    {
      title: '滚动设置',
      items: [
        {
          title: '上下滚动',
          type: 'Switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.style?.overflowY === 'auto';
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              if (!data.style) {
                data.style = {};
              }
              data.style.overflowY = value ? 'auto' : 'none';
            }
          }
        },
        {
          title: '左右滚动',
          type: 'Switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.style?.overflowX === 'auto';
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              if (!data.style) {
                data.style = {};
              }
              data.style.overflowX = value ? 'auto' : 'none';
            }
          }
        }
      ]
    }
  ],
  '.ant-row': {
    title: '行',
    items: [
      {
        title: '水平排列方式',
        type: 'Select',
        options: [
          { value: 'start', label: '居左排列' },
          { value: 'end', label: '居右排列' },
          { value: 'center', label: '居中排列' },
          { value: 'space-around', label: '均匀排列' },
          { value: 'space-between', label: '两端对齐' }
        ],
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return;
            const item = getRowItem(data, focusArea);
            return item.justify;
          },
          set({ data, focusArea }: Result, value: JustifyType) {
            if (!focusArea) return;
            const item = getRowItem(data, focusArea);
            item.justify = value;
          }
        }
      },
      {
        title: '垂直对齐方式',
        type: 'Select',
        options: [
          { value: 'top', label: '置顶排列' },
          { value: 'middle', label: '居中排列' },
          { value: 'bottom', label: '置底排列' }
        ],
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return;
            const item = getRowItem(data, focusArea);
            return item.align;
          },
          set({ data, focusArea }: Result, value: AlignType) {
            if (!focusArea) return;
            const item = getRowItem(data, focusArea);
            item.align = value;
          }
        }
      },
      {
        title: '高度',
        type: 'Text',
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return;
            const item = getRowItem(data, focusArea);
            return item.height;
          },
          set({ data, focusArea }: Result, value: string) {
            if (!focusArea) return;
            const item = getRowItem(data, focusArea);
            item.height = unitConversion(value);
            // if (/^\d+(?:%)$/.test(value)) {
            //   item.height = value
            // } else {
            //   item.height = /^\d+(?:px)?$/.test(value) ? parseInt(value, 10) + 'px' : void 0
            // }
          }
        }
      },
      {
        title: '自动换行',
        type: 'Switch',
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return;
            const item = getRowItem(data, focusArea);
            if (typeof item.wrap !== 'boolean')
              item.wrap = true;
            return item.wrap;
          },
          set({ data, focusArea }: Result, value: boolean) {
            if (!focusArea) return;
            const item = getRowItem(data, focusArea);
            item.wrap = value;
          }
        }
      },
      // {
      //   title: '高度自动伸缩',
      //   type: 'Switch',
      //   description: '自动填满容器剩余高度',
      //   value: {
      //     get({ data, focusArea }: Result) {
      //       if (!focusArea) return
      //       const item = getRowItem(data, focusArea)
      //       return item.flex
      //     },
      //     set({ data, slot, focusArea }: Result, value: boolean) {
      //       if (!focusArea) return
      //       const item = getRowItem(data, focusArea)
      //       item.flex = value ? 1 : 0;

      //       if (value) {
      //         data.style.display = 'flex'
      //         data.style.flexDirection = 'column'
      //         data.style.height = '100%'
      //         data.rowStyle = {
      //           flex: 1,
      //           alignItems: 'flex-start'
      //         }
      //       } else {
      //         data.style.display = ''
      //         data.style.flexDirection = ''
      //         data.style.height = ''
      //         data.rowStyle = {
      //           flex: 0,
      //           alignItems: ''
      //         }
      //       }
      //     }
      //   }
      // },
      {
        title: '背景颜色',
        type: 'ColorPicker',
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return;
            const item = getRowItem(data, focusArea);
            return item?.backgroundColor;
          },
          set({ data, focusArea }: Result, value: string) {
            if (!focusArea) return;
            const item = getRowItem(data, focusArea);

            if (typeof item.backgroundColor == 'undefined') {
              item.backgroundColor = '';
            }
            item['backgroundColor'] = value;
          }
        }
      },
      {
        title: '间隔配置',
        items: [
          {
            title: '开启',
            type: 'Switch',
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const item = getRowItem(data, focusArea);
                return item.useGutter;
              },
              set({ data, focusArea }: EditorResult<Data>, value: boolean) {
                if (!focusArea) return;
                const item = getRowItem(data, focusArea);
                item.useGutter = value;
              }
            }
          },
          {
            title: '水平间隔',
            type: 'Slider',
            options: [
              {
                max: 1000,
                min: 0,
                step: 1,
                formatter: 'px'
              }
            ],
            ifVisible({ focusArea, data }: EditorResult<Data>) {
              if (!focusArea) return;
              const item = getRowItem(data, focusArea);
              return !!item.useGutter;
            },
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const item = getRowItem(data, focusArea);
                return item.gutter[0];
              },
              set({ data, focusArea }: EditorResult<Data>, value: string) {
                if (!focusArea) return;
                const item = getRowItem(data, focusArea);
                item.gutter[0] = value;
              }
            }
          }
          // {
          //   title: '垂直间隔',
          //   type: 'Slider',
          //   options: [
          //     {
          //       max: 1000,
          //       min: 0,
          //       step: 1,
          //       formatter: 'px'
          //     }
          //   ],
          //   value: {
          //     get({data, focusArea}: EditorResult<Data>) {
          //       if (!focusArea) return;
          //       const item = getRowItem(data, focusArea);
          //       return item.gutter[1];
          //     },
          //     set({data, focusArea}: EditorResult<Data>, value: string) {
          //       if (!focusArea) return;
          //       const item = getRowItem(data, focusArea);
          //       item.gutter[1] = value;
          //     }
          //   }
          // }
        ]
      },
      {
        title: '列等分',
        type: 'Button',
        value: {
          // get({data, focusArea}: Result) {
          //   if (!focusArea) return
          //   const item = getRowItem(data, focusArea)
          //   const columnCount = item.columns.length

          //   return item.isEvenly
          // },
          set({ data, slot, focusArea }: Result) {
            if (!focusArea) return;
            const item = getRowItem(data, focusArea);
            // item.isEvenly = value
            // if (value) {
            setRowColumnsForEvenlySpan(item.columns);
            // }
            const title = generateColumnsTitle(item.columns.length);
            item.columns.forEach((column) => {
              slot.setTitle(column.slot, title);
            });
          }
        }
      },
      {
        title: '上移',
        type: 'Button',
        ifVisible({ focusArea }: Result) {
          if (!focusArea) return;
          const index = ~~focusArea.dataset.rowIndex;
          return index !== 0;
        },
        value: {
          set({ data, focusArea }: Result) {
            if (!focusArea) return;
            const index = ~~focusArea.dataset.rowIndex;
            const oldRow = data.rows[index];
            data.rows[index] = data.rows[index - 1];
            data.rows[index - 1] = oldRow;
          }
        }
      },
      {
        title: '下移',
        type: 'Button',
        ifVisible({ data, focusArea }: Result) {
          if (!focusArea) return;
          const index = ~~focusArea.dataset.rowIndex;
          return index + 1 < data.rows.length;
        },
        value: {
          set({ data, focusArea }: Result) {
            if (!focusArea) return;
            const index = ~~focusArea.dataset.rowIndex;
            const oldRow = data.rows[index];
            data.rows[index] = data.rows[index + 1];
            data.rows[index + 1] = oldRow;
          }
        }
      },
      {
        title: '添加列',
        type: 'Button',
        value: {
          set({ data, slot, focusArea }: Result) {
            if (!focusArea) return;
            const item = getRowItem(data, focusArea);
            const lastColumn = item.columns[item.columns.length > 0 ? item.columns.length - 1 : 0];
            const id = uuid();
            const column = {
              key: id,
              slot: id,
              flex: lastColumn ? lastColumn.flex : 'row',
              align: lastColumn ? lastColumn.align : 'center',
              justify: lastColumn ? lastColumn.justify : 'flex-start',
              span: lastColumn ? (lastColumn.span as number) : 4,
              widthOption: 'span',
              width: 300
            };

            item.columns.push(column);
            const title = generateColumnsTitle(24 / column?.span);
            slot.add(id, title);
          }
        }
      },
      {
        title: '复制',
        type: 'Button',
        value: {
          set({ data, slot, focusArea }: Result) {
            if (!focusArea) return;
            const item = deepCopy(getRowItem(data, focusArea));
            const rowId = uuid();
            const columnsInfo = copyColumns(item.columns);
            const row: IRow = {
              key: rowId,
              justify: item.justify,
              gutter: deepCopy(item.gutter),
              align: item.align,
              columns: columnsInfo.columns
            };
            columnsInfo.columns.forEach((column, index) => {
              if (column.span) {
                slot.add(
                  columnsInfo.columnIds[index],
                  generateColumnsTitle(24 / Number(column.span))
                );
              }
            });
            data.rows.push(row);
          }
        }
      },
      {
        title: '删除',
        type: 'Button',
        value: {
          set({ data, slot, focusArea }: Result) {
            if (!focusArea) return;
            const item = getRowItem(data, focusArea);
            const index = ~~focusArea.dataset.rowIndex;
            if (!item) {
              return;
            }
            item.columns.forEach((columnItem) => {
              slot.remove(columnItem.slot);
            });
            data.rows.splice(index, 1);
          }
        }
      }
    ]
  },
  '.ant-row > .ant-col': ({ data, focusArea, slot }: EditorResult<Data>, cate1, cate2, cate3) => {
    if (!focusArea) return;
    const item = getColItem(data, focusArea);
    const mySlot = slot.get(item.slot);
    cate1.title = '常规';
    cate1.items = [
      // {
      //   title: '宽度自适应',
      //   type: 'Switch',
      //   description: '根据列里的内容宽度自适应',
      //   value: {
      //     get({data, focusArea}: Result) {
      //       if (!focusArea) return
      //       const item = getColItem(data, focusArea)
      //       return !Boolean(item.span) && !item.flex
      //     },
      //     set({data, focusArea}: Result, value: boolean) {
      //       if (!focusArea) return
      //       const item = getColItem(data, focusArea)
      //       item.span = value ? '' : 4
      //       item.flex = void 0
      //     },
      //   },
      // },
      {
        title: '宽度填充模式',
        type: 'Select',
        options: [
          { value: 'span', label: '24栅格' },
          { value: 'auto', label: '自动填充' },
          { value: 'px', label: '固定宽度' },
          { value: '@media', label: '响应式宽度' }
        ],
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return;
            return getColItem(data, focusArea).widthOption
              ? getColItem(data, focusArea).widthOption
              : 'span';
          },
          set({ data, slot, focusArea }: Result, value: string) {
            if (!focusArea) return;
            const item = getColItem(data, focusArea);
            item.widthOption = value;
            updateColumnsTitle(item, slot);
          }
        }
      },
      {
        title: '宽度(共24格)',
        type: 'Slider',
        options: [
          {
            max: 24,
            min: 1,
            steps: 1,
            formatter: '/24'
          }
        ],
        ifVisible({ data, focusArea }: Result) {
          if (!focusArea) return;
          return (
            !getColItem(data, focusArea).widthOption ||
            getColItem(data, focusArea).widthOption === 'span'
          );
        },
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return;
            return getColItem(data, focusArea).span;
          },
          set({ data, slot, focusArea }: Result, value: number) {
            if (!focusArea) return;
            const item = getColItem(data, focusArea);
            item.span = value;
            updateColumnsTitle(item, slot);
            // const title = generateColumnsTitle(24 / item?.span)
            // slot.setTitle(item.slot, title)
          }
        }
      },
      {
        title: '指定宽度(px)',
        type: 'Text',
        ifVisible({ data, focusArea }: Result) {
          if (!focusArea) return;
          return getColItem(data, focusArea).widthOption === 'px';
        },
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return;
            return getColItem(data, focusArea).width;
          },
          set({ data, slot, focusArea }: Result, value: number) {
            if (!focusArea) return;
            const item = getColItem(data, focusArea);
            item.width = value;
            updateColumnsTitle(item, slot);
            // const title = generateColumnsTitle(24 / item?.span)
            // slot.setTitle(item.slot, title)
          }
        }
      },
      {
        title: '断点配置(24栅格)',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColItem(data, focusArea);
          return item?.widthOption === '@media';
        },
        items: [
          {
            type: 'Map',
            options: {
              notaddel: true,
              noteditkey: true
            },
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const item = getColItem(data, focusArea);
                if (!item.breakPoints) {
                  item.breakPoints = {
                    'xs <576px': item.span.toString(),
                    'sm ≥576px': item.span.toString(),
                    'md ≥768px': item.span.toString(),
                    'lg ≥992px': item.span.toString(),
                    'xl ≥1200px': item.span.toString(),
                    'xxl ≥1600px': item.span.toString()
                  };
                }
                return item.breakPoints;
              },
              set({ data, focusArea }: EditorResult<Data>, values: any) {
                if (!focusArea) return;
                const item = getColItem(data, focusArea);
                item.breakPoints = Object.assign(item.breakPoints || {}, values);
              }
            }
          }
        ]
      },
      {
        title: '最小/最大宽度单位',
        type: 'Select',
        options: [
          { value: '%', label: '百分比' },
          { value: 'px', label: '像素' },
          { value: 'auto', label: '默认' }
        ],
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return;
            if (!getColItem(data, focusArea).minMaxWidthOption)
              getColItem(data, focusArea).minMaxWidthOption = 'auto';
            return getColItem(data, focusArea).minMaxWidthOption;
          },
          set({ data, focusArea }: Result, value: string) {
            if (!focusArea) return;
            const item = getColItem(data, focusArea);
            item.minMaxWidthOption = value;
          }
        }
      },
      {
        type: 'InputNumber',
        ifVisible({ data, focusArea }: Result) {
          if (!focusArea) return;
          return getColItem(data, focusArea).minMaxWidthOption !== 'auto';
        },
        options: [
          { title: '最小宽度', min: 0, width: '100px' },
          { title: '最大宽度', min: 0, width: '100px' }
        ],
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return;
            const item = getColItem(data, focusArea);
            return [item.minWidth, item.maxWidth || 100];
          },
          set({ data, focusArea }: Result, value: number[]) {
            if (!focusArea) return;
            const item = getColItem(data, focusArea);
            [item.minWidth, item.maxWidth] = value;
          }
        }
      },
      {
        title: '内容宽度',
        type: 'Select',
        options: [
          { value: '', label: '正常' },
          { value: 'fit-content', label: '自适应' },
          { value: '100%', label: '100%' }
        ],
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return;
            const item = getColItem(data, focusArea);
            return item.contentWidth;
          },
          set({ data, focusArea }: Result, value) {
            if (!focusArea) return;
            const item = getColItem(data, focusArea);
            item.contentWidth = value;
          }
        }
      },
      ...SlotLayoutEditor(mySlot),
      {
        title: '前移',
        type: 'Button',
        ifVisible({ focusArea }: Result) {
          if (!focusArea) return;
          const [rowIndex, colIndex] = getColIndex(focusArea);
          return colIndex !== 0;
        },
        value: {
          set({ data, focusArea }: Result) {
            if (!focusArea) return;
            const [rowIndex, colIndex] = getColIndex(focusArea);
            const row = data.rows[rowIndex];
            const oldColumn = row.columns[colIndex];
            row.columns[colIndex] = row.columns[colIndex - 1];
            row.columns[colIndex - 1] = oldColumn;
          }
        }
      },
      {
        title: '后移',
        type: 'Button',
        ifVisible({ data, focusArea }: Result) {
          if (!focusArea) return;
          const [rowIndex, colIndex] = getColIndex(focusArea);
          return colIndex + 1 < data.rows[rowIndex].columns.length;
        },
        value: {
          set({ data, focusArea }: Result) {
            if (!focusArea) return;
            const [rowIndex, colIndex] = getColIndex(focusArea);
            const row = data.rows[rowIndex];
            const oldColumn = row.columns[colIndex];
            row.columns[colIndex] = row.columns[colIndex + 1];
            row.columns[colIndex + 1] = oldColumn;
          }
        }
      },
      {
        title: '删除',
        type: 'Button',
        value: {
          set({ data, slot, focusArea }: Result) {
            if (!focusArea) return;
            const item = getColItem(data, focusArea);
            const [rowIndex, colIndex] = getColIndex(focusArea);
            if (!item) {
              return;
            }
            slot.remove(item?.slot);
            data.rows[rowIndex].columns.splice(colIndex, 1);
          }
        }
      }
    ];
    cate2.title = '样式';
    cate2.items = [
      {
        title: '样式',
        type: 'style',
        options: ['BGCOLOR', 'BORDER', 'BGIMAGE'],
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return;
            const item = getColItem(data, focusArea);
            return {
              ...item?.colStyle,
              styleEditorUnfold: true
            };
          },
          set({ data, focusArea }: Result, value: any) {
            if (!focusArea) return;
            const item = getColItem(data, focusArea);

            if (typeof item.backgroundColor == 'undefined') {
              item.colStyle = {};
            }
            item.colStyle = {
              ...item?.colStyle,
              ...value
            };
          }
        }
      },
      {
        title: '滚动设置',
        items: [
          {
            title: '上下滚动',
            type: 'Switch',
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const item = getColItem(data, focusArea);
                return item?.colStyle?.overflowY === 'auto';
              },
              set({ data, focusArea }: EditorResult<Data>, value: boolean) {
                if (!focusArea) return;
                const item = getColItem(data, focusArea);
                if (!item.colStyle) {
                  item.colStyle = {};
                }
                item.colStyle.overflowY = value ? 'auto' : 'none';
              }
            }
          },
          {
            title: '左右滚动',
            type: 'Switch',
            value: {
              get({ data, focusArea }: EditorResult<Data>) {
                if (!focusArea) return;
                const item = getColItem(data, focusArea);
                return item?.colStyle?.overflowX === 'auto';
              },
              set({ data, focusArea }: EditorResult<Data>, value: boolean) {
                if (!focusArea) return;
                const item = getColItem(data, focusArea);
                if (!item.colStyle) {
                  item.colStyle = {};
                }
                item.colStyle.overflowX = value ? 'auto' : 'none';
              }
            }
          }
        ]
      }
    ];

    cate3.title = '事件';
    cate3.items = [
      {
        title: '点击',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const item = getColItem(data, focusArea);
            return item?.useClick;
          },
          set({ data, focusArea, output }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;
            const item = getColItem(data, focusArea);
            if (value && !output.get(item.key)) {
              output.add(item.key, '列点击', { type: 'boolean' });
            }
            if (!value && output.get(item.key)) {
              output.remove(item.key);
            }
            item.useClick = value;
          }
        }
      },
      {
        title: '点击事件',
        type: '_Event',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = getColItem(data, focusArea);
          return !!item?.useClick;
        },
        options({ data, focusArea }: EditorResult<Data>) {
          const item = getColItem(data, focusArea);
          return {
            outputId: item.key
          };
        }
      }
    ];
    return {
      title: '列'
    };
  }
};
