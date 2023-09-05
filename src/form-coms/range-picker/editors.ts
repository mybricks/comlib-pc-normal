import moment from 'moment';
import { DisabledDateTimeEditor } from '../../components/editors/DisabledDateTimeEditor';
import { RuleKeys, defaultValidatorExample, defaultRules } from '../utils/validator';
import { Data, DateType } from './runtime';
import { InputIds, OutputIds } from '../types';

export const refreshSchema = ({ data, input, output }: { data: Data; input: any; output: any }) => {
  const baseType = data.contentType === 'timeStamp' ? 'number' : 'string';
  const newSchema = {
    type: 'tuple',
    items: [
      {
        type: baseType
      },
      {
        type: baseType
      }
    ]
  };
  input.get(InputIds.SetInitialValue).setSchema(newSchema);
  input.get(InputIds.SetValue).setSchema(newSchema);
  output.get(OutputIds.OnChange).setSchema(newSchema);
  output.get(OutputIds.OnInitial).setSchema(newSchema);
  output.get(OutputIds.ReturnValue).setSchema(newSchema);
};
const emptyRules = [
  {
    status: true,
    visible: true,
    title: '开始'
  },
  {
    status: true,
    visible: true,
    title: '结束'
  }
];


export default {
  '@resize': {
    options: ['width']
  },
  '@init': ({ style }) => {
    style.width = '100%';
  },
  ':root': {
    style: [
      {
        title: '边框',
        catelog: '表单项',
        options: ['border'],
        target: '.ant-picker'
      },
      {
        title: '表单项背景色',
        catelog: '表单项',
        options: [{ type: 'background', config: { disableBackgroundImage: true } }],
        target: '.ant-picker'
      },
      {
        title: '日历图标',
        catelog: '表单项',
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        target: '.anticon-calendar'
      },
      {
        title: '清除按钮',
        catelog: '表单项',
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        target: '.anticon-close-circle'
      },
      {
        title: '文本内容',
        catelog: '表单项',
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        target: '.ant-picker-input>input'
      },
      {
        title: '提示内容',
        catelog: '表单项',
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        target: 'input::placeholder'
      },
      {
        title: '日期-当前',
        catelog: '默认',
        options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'date' || data.config.picker === 'week';
        },
        target({ id }: EditorResult<Data>) {
          return `.{id} .ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner:before`;
        }
      },
      {
        catelog: '默认',
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'date' || data.config.picker === 'week';
        },
        target({ id }: EditorResult<Data>) {
          return `.{id} .ant-picker-cell-today`;
        }
      },
      {
        title: '日期',
        catelog: '默认',
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'date';
        },
        target({ id }: EditorResult<Data>) {
          return [`.{id} .ant-picker-cell .ant-picker-cell-inner`];
        }
      },
      {
        title: '日期-周',
        catelog: '默认',
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true, useImportant: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'week';
        },
        target({ id }: EditorResult<Data>) {
          return [`.{id} .ant-picker-week-panel .ant-picker-cell .ant-picker-cell-inner`];
        }
      },
      {
        title: '月',
        catelog: '默认',
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'month';
        },
        target({ id }: EditorResult<Data>) {
          return [
            `.{id} .ant-picker-cell .ant-picker-cell-inner`,
            `.{id} .ant-picker-week-panel .ant-picker-cell .ant-picker-cell-inner`
          ];
        }
      },
      {
        title: '季度',
        catelog: '默认',
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'quarter';
        },
        target({ id }: EditorResult<Data>) {
          return [
            `.{id} .ant-picker-cell .ant-picker-cell-inner`,
            `.{id} .ant-picker-week-panel .ant-picker-cell .ant-picker-cell-inner`
          ];
        }
      },
      {
        title: '年份',
        catelog: '默认',
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'year';
        },
        target({ id }: EditorResult<Data>) {
          return [
            `.{id} .ant-picker-cell .ant-picker-cell-inner`,
            `.{id} .ant-picker-week-panel .ant-picker-cell .ant-picker-cell-inner`
          ];
        }
      },
      {
        title: '时间',
        catelog: '默认',
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.showTime;
        },
        global: true,
        target({ id }: EditorResult<Data>) {
          return `.{id} .ant-picker-time-panel-column>li.ant-picker-time-panel-cell .ant-picker-time-panel-cell-inner`;
        }
      },
      {
        title: '确认按钮',
        catelog: '默认',
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } },
          'BoxShadow'
        ],
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.showTime && data.config.picker === 'date';
        },
        target({ id }: EditorResult<Data>) {
          return `.{id} .ant-btn-primary`;
        }
      },
      {
        title: '边框-hover',
        catelog: 'Hover',
        options: ['border'],
        target: '.ant-picker:hover',
        domTarget: '.ant-picker'
      },
      {
        title: '清除按钮',
        catelog: 'Hover',
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        target: '.anticon-close-circle:hover',
        domTarget: '.anticon-close-circle'
      },
      {
        title: '选中日期区间',
        catelog: 'Hover',
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker !== 'week';
        },
        global: true,
        target({ id }: EditorResult<Data>) {
          return [
            `.{id} .ant-picker-cell-in-view.ant-picker-cell-in-range.ant-picker-cell-range-hover:before`,
            `.{id} .ant-picker-cell-in-view.ant-picker-cell-in-range.ant-picker-cell-range-hover-start:before`,
            `.{id} .ant-picker-cell-in-view.ant-picker-cell-in-range.ant-picker-cell-range-hover-end:before`
          ];
        }
      },
      {
        title: '日期',
        catelog: 'Hover',
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'date';
        },
        global: true,
        target({ id }: EditorResult<Data>) {
          return `.{id} .ant-picker-cell:hover:not(.ant-picker-cell-selected):not(.ant-picker-cell-range-start):not(.ant-picker-cell-range-end):not(.ant-picker-cell-range-hover-start):not(.ant-picker-cell-range-hover-end) .ant-picker-cell-inner`;
        }
      },
      {
        title: '日期-周',
        catelog: 'Hover',
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'week';
        },
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        global: true,
        target({ id }: EditorResult<Data>) {
          return `.{id} .ant-picker-week-panel-row:hover td`
        }
      },
      {
        title: '月份',
        catelog: 'Hover',
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'month';
        },
        target({ id }: EditorResult<Data>) {
          return [
            `.{id} .ant-picker-cell:hover:not(.ant-picker-cell-selected):not(.ant-picker-cell-range-start):not(.ant-picker-cell-range-end):not(.ant-picker-cell-range-hover-start):not(.ant-picker-cell-range-hover-end) .ant-picker-cell-inner`
          ];
        }
      },
      {
        title: '季度',
        catelog: 'Hover',
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'quarter';
        },
        target({ id }: EditorResult<Data>) {
          return [
            `.{id} .ant-picker-cell:hover:not(.ant-picker-cell-selected):not(.ant-picker-cell-range-start):not(.ant-picker-cell-range-end):not(.ant-picker-cell-range-hover-start):not(.ant-picker-cell-range-hover-end) .ant-picker-cell-inner`
          ];
        }
      },
      {
        title: '年份',
        catelog: 'Hover',
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'year';
        },
        target({ id }: EditorResult<Data>) {
          return [
            `.{id} .ant-picker-cell:hover:not(.ant-picker-cell-selected):not(.ant-picker-cell-range-start):not(.ant-picker-cell-range-end):not(.ant-picker-cell-range-hover-start):not(.ant-picker-cell-range-hover-end) .ant-picker-cell-inner`
          ];
        }
      },
      {
        title: '时间',
        catelog: 'Hover',
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.showTime && data.config.picker === 'date';
        },
        global: true,
        target({ id }: EditorResult<Data>) {
          return `.{id} .ant-picker-time-panel-column>li.ant-picker-time-panel-cell .ant-picker-time-panel-cell-inner:hover`;
        }
      },
      {
        title: '确认按钮',
        catelog: 'Hover',
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } },
          'BoxShadow'
        ],
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.showTime && data.config.picker === 'date';
        },
        target({ id }: EditorResult<Data>) {
          return `.{id} .ant-btn-primary:hover`;
        }
      },
      {
        title: '边框',
        catelog: 'Focus',
        options: ['border', 'BoxShadow'],
        target: ['.ant-picker-focused.ant-picker']
      },
      {
        title: '边框底线',
        catelog: 'Focus',
        options: [{ type: 'background', config: { disableBackgroundImage: true } }],
        target: '.ant-picker-range .ant-picker-active-bar'
      },
      
      {
        title: '日期-选中',
        catelog: '选中',
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'date';
        },
        global: true,
        target({ id }: EditorResult<Data>) {
          return [
            `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner`,
            `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner`,
            `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-range-end-single):not(.ant-picker-cell-range-start) .ant-picker-cell-inner`,
            `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-range-start-single):not(.ant-picker-cell-range-end) .ant-picker-cell-inner`
          ];
        }
      },
      {
        title: '日期-选中',
        catelog: '选中',
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'week';
        },
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        global: true,
        target({ id }: EditorResult<Data>) {
          return [`.{id} .ant-picker-week-panel-row-selected td`];
        }
      },
      {
        title: '周-选中',
        catelog: '选中',
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'week';
        },
        options: [
          { type: 'font', config: { disableTextAlign: true } }
        ],
        global: true,
        target({ id }: EditorResult<Data>) {
          return [`.{id} .ant-picker-week-panel-row-selected td.ant-picker-cell-week`];
        }
      },
      {
        title: '月份',
        catelog: '选中',
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'month';
        },
        target({ id }: EditorResult<Data>) {
          return [
            `.ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner`,
            `.ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner`
          ];
        }
      },
      {
        title: '季度',
        catelog: '选中',
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'quarter';
        },
        target({ id }: EditorResult<Data>) {
          return [
            `.ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner`,
            `.ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner`
          ];
        }
      },
      {
        title: '年份',
        catelog: '选中',
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'year';
        },
        target({ id }: EditorResult<Data>) {
          return [
            `.ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner`,
            `.ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner`
          ];
        }
      },
      {
        title: '日期-选中区间',
        catelog: '选中',
        options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'date';
        },
        target({ id }: EditorResult<Data>) {
          return [
            `.{id} .ant-picker-cell-in-view.ant-picker-cell-in-range:before`,
            `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-range-end-single):before`,
            `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-range-start-single):before`
          ];
        }
      },
      {
        title: '月-选中区间',
        catelog: '选中',
        options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'month';
        },
        target({ id }: EditorResult<Data>) {
          return [
            `.{id} .ant-picker-cell-in-view.ant-picker-cell-in-range:before`,
            `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-range-end-single):before`,
            `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-range-start-single):before`
          ];
        }
      },
      {
        title: '季度-选中区间',
        catelog: '选中',
        options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'quarter';
        },
        target({ id }: EditorResult<Data>) {
          return [
            `.{id} .ant-picker-cell-in-view.ant-picker-cell-in-range:before`,
            `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-range-end-single):before`,
            `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-range-start-single):before`
          ];
        }
      },
      {
        title: '年份-选中区间',
        catelog: '选中',
        options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'year';
        },
        target({ id }: EditorResult<Data>) {
          return [
            `.{id} .ant-picker-cell-in-view.ant-picker-cell-in-range:before`,
            `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-range-end-single):before`,
            `.{id} .ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-range-start-single):before`
          ];
        }
      },
      {
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        catelog: '选中',
        global: true,
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker !== 'week';
        },
        target({ id }: EditorResult<Data>) {
          return [`.{id} td.ant-picker-cell.ant-picker-cell-in-view.ant-picker-cell-in-range`];
        }
      },
      {
        title: '时间-选中',
        catelog: '选中',
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.showTime && data.config.picker === 'date';
        },
        global: true,
        target({ id }: EditorResult<Data>) {
          return `.{id} .ant-picker-time-panel-column>li.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner`;
        }
      },
      {
        title: '确认按钮',
        catelog: '选中',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.showTime && data.config.picker === 'date';
        },
        options: [
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } },
          { type: 'border' },
        ],
        global: true,
        target: `.{id}  .ant-btn-primary:active`
      },
      {
        title: '表单项',
        catelog: '禁用',
        options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
        target: '.ant-picker.ant-picker-disabled'
      },
      {
        title: '确认按钮',
        catelog: '禁用',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.showTime && data.config.picker === 'date';
        },
        options: [
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } },
          { type: 'border' },
        ],
        global: true,
        target: `.{id}  .ant-btn-primary[disabled]`
      }
    ],
    items: ({ data }: EditorResult<{ type }>, ...catalog) => {
      catalog[0].title = '常规';

      catalog[0].items = [
        {
          title: '前置提示内容',
          type: 'Text',
          description: '该提示内容会在值为空时显示',
          value: {
            get({ data }) {
              return data.config.placeholder[0];
            },
            set({ data }, value: string) {
              data.config.placeholder[0] = value;
            }
          }
        },
        {
          title: '后置提示内容',
          type: 'Text',
          description: '该提示内容会在值为空时显示',
          value: {
            get({ data }) {
              return data.config.placeholder[1];
            },
            set({ data }, value: string) {
              data.config.placeholder[1] = value;
            }
          }
        },
        {
          title: '禁用状态',
          type: 'switch',
          description: '是否禁用状态',
          value: {
            get({ data }) {
              return data.config.disabled;
            },
            set({ data }, value: boolean) {
              data.config.disabled = value;
            }
          }
        },
        {
          title: '日期选择类型',
          type: 'Select',
          options: [
            { label: '日期', value: 'date' },
            { label: '周', value: 'week' },
            { label: '月份', value: 'month' },
            { label: '季度', value: 'quarter' },
            { label: '年份', value: 'year' }
          ],
          value: {
            get({ data }) {
              return data.config.picker;
            },
            set({ data }, value: 'date' | 'week' | 'month' | 'quarter' | 'year' | undefined) {
              data.config.picker = value;
            }
          }
        },
        {
          title: '时间选择',
          type: 'Switch',
          value: {
            get({ data }) {
              return !!data.showTime;
            },
            set({ data }, value: boolean) {
              data.showTime = value;
            }
          }
        },
        {
          title: '预设时间范围快捷选择',
          type: 'Switch',
          value: {
            get({ data }) {
              return data.useRanges;
            },
            set({ data }, value: boolean) {
              data.useRanges = value;
            }
          }
        },
        {
          // title: '预设时间范围',
          ifVisible({ data }) {
            return !!data.useRanges;
          },
          items: [
            {
              type: 'Array',
              options: {
                getTitle: (item, index: number) => {
                  if (!item.title) {
                    item.title = `预设范围${index + 1}`;
                  }
                  return item.title;
                },
                onAdd: (_id: string) => {
                  const actionItem = {
                    title: '',
                    type: DateType.Day,
                    numList: [0, 0]
                  };
                  return actionItem;
                },
                items: [
                  {
                    title: '名称',
                    type: 'Textarea',
                    options: {
                      autoSize: { maxRows: 1 }
                    },
                    value: 'title'
                  },
                  {
                    title: '区间类型',
                    type: 'Select',
                    value: 'type',
                    options: [
                      { label: '年', value: DateType.Year },
                      { label: '月', value: DateType.Month },
                      { label: '周', value: DateType.Week },
                      { label: '天', value: DateType.Day },
                      { label: '时', value: DateType.Hour },
                      { label: '分', value: DateType.Minute },
                      { label: '秒', value: DateType.Second }
                    ]
                  },
                  {
                    title: '区间',
                    type: 'InputNumber',
                    value: 'numList',
                    options: [
                      { title: '前', min: -1000, max: 1000, width: 100 },
                      { title: '后', min: -1000, max: 1000, width: 100 }
                    ]
                  }
                ]
              },
              value: {
                get({ data }) {
                  return data.ranges;
                },
                set({ data }, value: any[]) {
                  data.ranges = value;
                }
              }
            }
          ]
        },
        {
          title: '默认时间',
          type: 'Text',
          description: '用 - 分割开始时间和结束时间，不设置默认使用当前时间',
          options: {
            placeholder: '例：00:00:00-23:59:59'
          },
          ifVisible({ data }) {
            return !!data.showTime;
          },
          value: {
            get({ data }) {
              const showTime: any = data.showTime;
              const defaultValue = showTime?.defaultValue;
              if (Array.isArray(defaultValue)) {
                return defaultValue.join('-');
              }
              if (typeof showTime !== 'object') {
                data.showTime = {};
              }
              return undefined;
            },
            set({ data }, value: string) {
              const arr = value.split('-').map((item) => item.trim());
              const isValid = !arr.some((item) => item && !moment(item, 'HH:mm:ss').isValid());
              data.showTime = { defaultValue: isValid ? arr : undefined };
            }
          }
        },
        ...DisabledDateTimeEditor('RangePicker'),
        {
          title: '始末日期必填',
          description: '通过开关，起始和结束项可部分为空，即不填',
          type: 'ArrayCheckbox',
          options: {
            checkField: 'status',
            visibleField: 'visible',
            getTitle
          },
          value: {
            get({ data }) {
              return data.emptyRules.length > 0 ? data.emptyRules : emptyRules;
            },
            set({ data }, value: any) {
              data.emptyRules = value;
            }
          }
        },
        {
          title: '校验规则',
          description: '提供快捷校验配置',
          type: 'ArrayCheckbox',
          options: {
            checkField: 'status',

            visibleField: 'visible',
            getTitle,
            items: [
              {
                title: '提示文字',
                type: 'Text',
                value: 'message',
                ifVisible(item: any, index: number) {
                  return item.key === RuleKeys.REQUIRED;
                }
              },
              {
                title: '编辑校验规则',
                type: 'code',
                options: {
                  language: 'javascript',
                  enableFullscreen: false,
                  title: '编辑校验规则',
                  width: 600,
                  minimap: {
                    enabled: false
                  },
                  babel: true,
                  eslint: {
                    parserOptions: {
                      ecmaVersion: '2020',
                      sourceType: 'module'
                    }
                  }
                },
                ifVisible(item: any, index: number) {
                  return item.key === RuleKeys.CODE_VALIDATOR;
                },
                value: 'validateCode'
              }
            ]
          },
          value: {
            get({ data }) {
              return data.rules.length > 0 ? data.rules : defaultRules;
            },
            set({ data }, value: any) {
              data.rules = value;
            }
          }
        },
        {
          title: '输出数据处理',
          items: [
            {
              title: '日期格式化模板',
              type: 'Select',
              description: '将输出(值变化事件和表单提交)的数据设置成所需要的格式',
              options: [
                { label: '年-月-日 时:分:秒', value: 'Y-MM-DD HH:mm:ss' },
                { label: '年-月-日 时:分', value: 'Y-MM-DD HH:mm' },
                { label: '年-月-日', value: 'Y-MM-DD' },
                { label: '年-月', value: 'Y-MM' },
                { label: '年', value: 'Y' },
                { label: '时间戳', value: 'timeStamp' },
                { label: '自定义', value: 'custom' }
              ],
              value: {
                get({ data }) {
                  return data.contentType;
                },
                set({ data, input, output }: EditorResult<Data>, value: string) {
                  data.contentType = value;
                  refreshSchema({ data, input, output });
                }
              }
            },
            {
              title: '自定义格式化模板',
              type: 'text',
              description:
                '日期格式化模板 YYYY:年份 MM:月份 DD:日 dd:星期 HH:24小时制 hh:12小时制 mm:分 ss:秒',
              ifVisible({ data }) {
                return data.contentType === 'custom';
              },
              value: {
                get({ data }) {
                  return data.formatter;
                },
                set({ data }, value: string) {
                  data.formatter = value;
                }
              }
            },
            {
              title: '开始时间',
              type: 'Radio',
              options: [
                { label: `00:00:00`, value: 'start' },
                { label: '当前时间', value: 'current' },
                { label: `23:59:59`, value: 'end' }
              ],
              ifVisible({ data }) {
                return !data.showTime && data.config.picker === 'date';
              },
              value: {
                get({ data }) {
                  return data.timeTemplate[0];
                },
                set({ data }, value: 'current' | 'start' | 'end') {
                  data.timeTemplate[0] = value;
                }
              }
            },
            {
              title: '结束时间',
              type: 'Radio',
              options: [
                { label: `00:00:00`, value: 'start' },
                { label: '当前时间', value: 'current' },
                { label: `23:59:59`, value: 'end' }
              ],
              ifVisible({ data }) {
                return !data.showTime && data.config.picker === 'date';
              },
              value: {
                get({ data }) {
                  return data.timeTemplate[1];
                },
                set({ data }, value: 'default' | 'start' | 'end') {
                  data.timeTemplate[1] = value;
                }
              }
            },
            {
              title: '输出格式',
              type: 'Select',
              description: '输出数据结构，数组和字符串两种格式',
              options: [
                { label: '数组', value: 'array' },
                { label: '字符串', value: 'string' }
              ],
              value: {
                get({ data }) {
                  return data.dateType;
                },
                set({ data }, value: 'array' | 'string') {
                  data.dateType = value;
                }
              }
            },
            {
              title: '分隔符',
              type: 'Text',
              description: '默认分隔符为-',
              ifVisible({ data }: EditorResult<Data>) {
                return data.dateType === 'string';
              },
              value: {
                get({ data }) {
                  return data.splitChart;
                },
                set({ data }, value: string) {
                  data.splitChart = value;
                }
              }
            }
          ]
        },
        {
          title: '事件',
          items: [
            {
              title: '值初始化',
              type: '_event',
              options: {
                outputId: 'onInitial'
              }
            },
            {
              title: '值更新',
              type: '_event',
              options: {
                outputId: 'onChange'
              }
            }
          ]
        }
      ];
    }
  }
};

const getTitle = (item: any, index: number) => {
  const { key, title, numericalLimit, regExr } = item;
  return title;
};
