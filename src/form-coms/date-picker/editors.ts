import moment from 'moment';
import { RuleKeys, defaultRules } from '../utils/validator';
import { Data } from './runtime';
import { SlotIds, InputIds } from './constant'
import styleEditor from './styleEditor';
import { OutputIds, SizeEnum, SizeOptions } from '../types';

export const defaultDisabledDateRule = [
  {
    title: '当前日期',
    checked: true,
    offset: [7],
    direction: 'before'
  },
  {
    title: '当前日期',
    checked: true,
    offset: [7],
    direction: 'after'
  }
];

export default {
  '@resize': {
    options: ['width']
  },
  '@init': ({ style, data }) => {
    style.width = '100%';
    data.formatMap = {
      "日期": encodeURIComponent("YYYY-MM-DD"),
      "日期+时间": encodeURIComponent("YYYY-MM-DD HH:mm:ss"),
      "周": encodeURIComponent("YYYY-wo"),
      "月份": encodeURIComponent("YYYY-MM"),
      "季度": encodeURIComponent("YYYY-\\QQ"),
      "年份": encodeURIComponent("YYYY")
    }
  },
  ':root': {
    style: [
      {
        title: '尺寸',
        description: '控件大小, 默认是中(middle)',
        type: 'Select',
        options: SizeOptions,
        value: {
          get({ data }: EditorResult<Data>) {
            return data.config.size || 'middle';
          },
          set({ data }: EditorResult<Data>, val: SizeEnum) {
            data.config = {
              ...data.config,
              size: val
            };
          }
        }
      },
      {
        items: styleEditor
      }
    ],
    items: ({ data }: EditorResult<{ type }>, ...catalog) => {
      catalog[0].title = '常规';

      catalog[0].items = [
        {
          title: '提示内容',
          type: 'Text',
          options: {
            locale: true
          },
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
          title: '显示清除图标',
          type: 'switch',
          description: '可以点击清除图标删除内容',
          value: {
            get({ data }) {
              return data.config.allowClear;
            },
            set({ data }, value: boolean) {
              data.config.allowClear = value;
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
          title: '默认面板日期',
          type: 'Text',
          value: {
            get({ data }) {
              return data.defaultPickerValue;
            },
            set({ data }, value: string) {
              data.defaultPickerValue = value;
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
          title: '周号隐藏',
          type: 'Switch',
          description: '开启后，日期选择类型为周时，周号隐藏',
          ifVisible({ data }: EditorResult<Data>) {
            return data.config.picker === 'week';
          },
          value: {
            get({ data }) {
              return data.isWeekNumber;
            },
            set({ data }, value: boolean) {
              data.isWeekNumber = value;
            }
          }
        },
        {
          title: '日期禁止选择',
          type: 'select',
          description: '选中“无”时的默认限制：结束日期小于开始日期，开启配置后默认前后7天可选',
          options: [
            {
              label: '无',
              value: 'default'
            },
            {
              label: '静态配置',
              value: 'static'
            }
          ],
          value: {
            get({ data }) {
              return data.useDisabledDate ?? 'default';
            },
            set({ data }, val: string) {
              data.useDisabledDate = val;
            }
          }
        },
        {
          type: 'ArrayCheckbox',
          ifVisible({ data }) {
            return data.useDisabledDate === 'static';
          },
          options: {
            checkField: 'checked',
            deletable: false,
            addable: false,
            getTitle: (item, index: number) => {
              const { direction, offset, title } = item;
              return `${title}${direction === 'before' ? '之前' : '之后'} ${offset} 天禁止选择`;
            },
            items: [
              {
                title: '方向',
                type: 'Select',
                value: 'direction',
                options: [
                  { label: '之前', value: 'before' },
                  { label: '之后', value: 'after' }
                ]
              },
              {
                title: '偏移',
                type: 'InputNumber',
                value: 'offset',
                options: [{ min: -1000, max: 1000, width: 200 }]
              }
            ]
          },
          value: {
            get({ data }) {
              return data.staticDisabledDate ?? defaultDisabledDateRule;
            },
            set({ data }, val: []) {
              data.staticDisabledDate = val;
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
                options: {
                  locale: true
                },
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
          title: '校验触发事件',
          type: '_event',
          ifVisible({ data }: EditorResult<Data>) {
            const customRule = (data.rules || defaultRules).find(
              (i) => i.key === RuleKeys.CUSTOM_EVENT
            );
            return !!customRule?.status;
          },
          options: {
            outputId: OutputIds.OnValidate
          }
        },
        {
          title: '日期展示格式',
          items: [
            {
              title: '格式化目标',
              type: 'Map',
              description:
                '日期格式化模板 YYYY:年份 MM:月份 DD:日 dd:星期 HH:24小时制 hh:12小时制 mm:分 ss:秒',
              options: {
                notaddel: true,
                noteditkey: true
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  if (data.formatMap && Object.keys(data.formatMap).length === 6) {
                    let newValueArr = Object.keys(data.formatMap).map((key, index) => {
                      return decodeURIComponent(data.formatMap[key]);
                    })
                    let newValue = {
                      "日期": newValueArr[0],
                      "日期+时间": newValueArr[1],
                      "周": newValueArr[2],
                      "月份": newValueArr[3],
                      "季度": newValueArr[4],
                      "年份": newValueArr[5]
                    }
                    return newValue
                  } else {
                    return {
                      "日期": "YYYY-MM-DD",
                      "日期+时间": "YYYY-MM-DD HH:mm:ss",
                      "周": "YYYY-wo",
                      "月份": "YYYY-MM",
                      "季度": "YYYY-\\QQ",
                      "年份": "YYYY"
                    };
                  }
                },
                set({ data }: EditorResult<Data>, value: any) {
                  let newValueArr = Object.keys(value).map((key, index) => {
                    return encodeURIComponent(value[key]);
                  })
                  let newValue = {
                    "日期": newValueArr[0],
                    "日期+时间": newValueArr[1],
                    "周": newValueArr[2],
                    "月份": newValueArr[3],
                    "季度": newValueArr[4],
                    "年份": newValueArr[5]
                  }
                  data.formatMap = newValue;
                }
              }
            }
          ]
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
                { label: '年-月-日 时', value: 'Y-MM-DD HH' },
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

      catalog[1].title = '高级';
      catalog[1].items = [
        {
          title: '日期面板切换事件',
          type: '_event',
          options: {
            outputId: 'onPanelChange'
          }
        },
        {
          title: '开启日期插槽',
          type: 'Switch',
          value: {
            get({ data }) {
              return data.useCustomDateCell;
            },
            set({ data, slot }: EditorResult<Data>, value: boolean) {
              if (value) {
                data.hideDatePanel = false
                slot.add({ id: SlotIds.DateCell, title: '插槽', type: 'scope' });
                slot
                  .get(SlotIds.DateCell)
                  .inputs.add(InputIds.CurrentDate, '当前日期', {
                    type: 'any'
                  })
                slot
                  .get(SlotIds.DateCell)
                  .inputs.add(InputIds.Today, '今天', {
                    type: 'any'
                  })
              } else {
                slot.remove(SlotIds.DateCell);
              }
              data.useCustomDateCell = value;
            }
          }
        },
        {
          title: '动态设置日期文本',
          description: '',
          type: 'Switch',
          value: {
            get({ data }) {
              return data.customExtraText;
            },
            set({ data, input }: EditorResult<Data>, value: boolean) {
              if (value) {
                const hasEvent = input.get(InputIds.ConfigExtraText);
                !hasEvent && input.add(InputIds.ConfigExtraText, `自定义日期文本`, { type: 'any' });

              } else {
                input.remove(InputIds.ConfigExtraText);
              }
              data.customExtraText = value;
            }
          }
        },
        {
          title: '开启日期选择面板顶部插槽',
          type: 'Switch',
          value: {
            get({ data }) {
              return data.useCustomPanelHeader;
            },
            set({ data, slot }: EditorResult<Data>, value: boolean) {
              if (value) {
                data.hideDatePanel = false
                slot.add({ id: SlotIds.DatePanelHeader, title: '插槽', type: 'scope' });
              } else {
                slot.remove(SlotIds.DatePanelHeader);
              }
              data.useCustomPanelHeader = value;
            }
          }
        },
        {
          title: '开启日期选择面板底部插槽',
          type: 'Switch',
          value: {
            get({ data }) {
              return data.useCustomPanelFooter;
            },
            set({ data, slot }: EditorResult<Data>, value: boolean) {
              if (value) {
                data.hideDatePanel = false
                slot.add({ id: SlotIds.DatePanelFooter, title: '插槽', type: 'scope' });
              } else {
                slot.remove(SlotIds.DatePanelFooter);
              }
              data.useCustomPanelFooter = value;
            }
          }
        },
        {
          title: '隐藏日期选择面板',
          description: '仅在搭建时生效',
          type: 'Switch',
          ifVisible({ data }: EditorResult<Data>) {
            return data.useCustomDateCell || data.useCustomPanelHeader || data.useCustomPanelFooter;
          },
          value: {
            get({ data }) {
              return data.hideDatePanel || false
            },
            set({ data, slot }: EditorResult<Data>, value: boolean) {
              data.hideDatePanel = value
            }
          }
        },
        {
          title: '日期选择面板受控',
          type: 'Switch',
          value: {
            get({ data }) {
              return data.controlled || false
            },
            set({ data, inputs }: EditorResult<Data>, value: boolean) {
              data.controlled = value
              if (value) {
                inputs.add("setOpen", "打开日期选择面板", { type: "boolean" })
              } else {
                inputs.remove("setOpen")
              }
            }
          }
        },
        {
          title: '点击日期选择面板外部关闭',
          type: 'Switch',
          ifVisible({ data }: EditorResult<Data>) {
            return data.controlled;
          },
          value: {
            get({ data }) {
              return data.closeWhenClickOutOfPanel || false;
            },
            set({ data, inputs }: EditorResult<Data>, value: boolean) {
              data.closeWhenClickOutOfPanel = value
            }
          }
        },
      ];
    }
  }
};

const getTitle = (item: any, index: number) => {
  const { key, title, numericalLimit, regExr } = item;
  return title;
};
