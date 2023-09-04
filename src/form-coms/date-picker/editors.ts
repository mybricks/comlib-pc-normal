import moment from 'moment';
import { RuleKeys, defaultValidatorExample, defaultRules } from '../utils/validator';
import { Data } from './runtime';

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
        target: '.anticon-close-circle',
        initValue: { color: 'rgba(0, 0, 0, 0.25)' }
      },
      {
        title: '表单项内容',
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
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'week' || data.config.picker === 'date';
        },
        global: true,
        target({ id }: EditorResult<Data>) {
          return `.{id} .ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner:before`;
        }
      },
      {
        catelog: '默认',
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'week' || data.config.picker === 'date';
        },
        global: true,
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
          return data.config.picker === 'week' || data.config.picker === 'date';
        },
        target({ id }: EditorResult<Data>) {
          return [
            `.{id} .ant-picker-cell .ant-picker-cell-inner`,
            `.{id} .ant-picker-week-panel .ant-picker-cell .ant-picker-cell-inner`
          ];
        }
      },
      {
        title: '月份',
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
        title: '边框',
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
        initValue: { color: 'rgba(0, 0, 0, 0.45)' },
        domTarget: '.anticon-close-circle'
      },
      {
        title: '日期',
        catelog: 'Hover',
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'date';
        },
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
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
          return !!data.showTime;
        },
        global: true,
        target({ id }: EditorResult<Data>) {
          return `.{id} .ant-picker-time-panel-column>li.ant-picker-time-panel-cell .ant-picker-time-panel-cell-inner:hover`;
        }
      },
      {
        title: '边框',
        catelog: 'Focus',
        options: ['border', 'BoxShadow'],
        target: '.ant-picker-focused.ant-picker'
      },
      {
        title: '日期-选中',
        catelog: 'Focus',
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'date';
        },
        options: [
          'border',
          { type: 'background', config: { disableBackgroundImage: true } },
          { type: 'font', config: { disableTextAlign: true } }
        ],
        global: true,
        target({ id }: EditorResult<Data>) {
          return [`.{id} .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner`];
        }
      },
      {
        title: '日期-选中',
        catelog: 'Focus',
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
        catelog: 'Focus',
        ifVisible({ data }: EditorResult<Data>) {
          return data.config.picker === 'week';
        },
        options: [
          { type: 'font', config: { disableTextAlign: true } }
        ],
        global: true,
        target({ id }: EditorResult<Data>) {
          return [`.{id} .ant-picker-week-panel-row-selected td.ant-picker-cell-week`];
        },
        initValue: { color: 'rgba(255, 255, 255, 0.5)' }
        //initValue: { color: 'rgba(255, 255, 255, 0.5)' }
      },
      //.ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner
      {
        title: '月份',
        catelog: 'Focus',
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
            `.ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner`
          ];
        }
      },
      {
        title: '季度',
        catelog: 'Focus',
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
            `.ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner`
          ];
        }
      },
      {
        title: '年份',
        catelog: 'Focus',
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
            `.ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner`
          ];
        }
      },
      {
        title: '时间-选中',
        catelog: 'Focus',
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
          return `.{id} .ant-picker-time-panel-column>li.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner`;
        }
      },
      {
        title: '表单项',
        catelog: '禁用',
        options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
        target: '.ant-picker.ant-picker-disabled'
      },
    ],
    items: ({ data }: EditorResult<{ type }>, ...catalog) => {
      catalog[0].title = '常规';

      catalog[0].items = [
        {
          title: '提示内容',
          type: 'Text',
          description: '该提示内容会在值为空时显示',
          value: {
            get({ data }) {
              return data.config.placeholder;
            },
            set({ data }, value: string) {
              data.config.placeholder = value;
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
          title: '默认时间',
          type: 'Text',
          description: '不设置默认使用当前时间',
          options: {
            placeholder: '例:00:00:00'
          },
          ifVisible({ data }) {
            return !!data.showTime;
          },
          value: {
            get({ data }) {
              let showTime: any = data.showTime;
              if (typeof showTime?.defaultValue === 'string') {
                return data.showTime?.defaultValue;
              }
              if (typeof showTime !== 'object') {
                data.showTime = {};
              }
              return undefined;
            },
            set({ data }, value: string) {
              data.showTime = {
                defaultValue: moment(value, 'HH:mm:ss').isValid() ? value : undefined
              };
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
                set({ data }, value: string) {
                  data.contentType = value;
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
