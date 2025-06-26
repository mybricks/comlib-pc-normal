import { RuleKeys, defaultRules } from '../utils/validator';
import { Data } from './runtime';
import { SlotIds, InputIds } from './constant';
import styleEditor from './styleEditor';
import { OutputIds, SizeEnum, SizeOptions } from '../types';
import { templateRender } from '../utils';

export default {
  '@resize': {
    options: ['width']
  },
  '@init': ({ style, data }) => {
    style.width = '100%';
    data.formatMap = {
      日期: encodeURIComponent('YYYY-MM-DD'),
      '日期+时间': encodeURIComponent('YYYY-MM-DD HH:mm:ss'),
      周: encodeURIComponent('YYYY-wo'),
      月份: encodeURIComponent('YYYY-MM'),
      季度: encodeURIComponent('YYYY-\\QQ'),
      年份: encodeURIComponent('YYYY')
    };
  },
  ':root': {
    style: [
      {
        items: styleEditor
      }
    ],
    items: ({ data }: EditorResult<{ type }>, ...catalog) => {
      catalog[0].title = '常规';

      catalog[0].items = [
        {
          title: '禁用状态',
          type: 'switch',
          description: '是否禁用状态',
          value: {
            get({ data }) {
              return data.disabled;
            },
            set({ data }, value: boolean) {
              data.disabled = value;
            }
          }
        },
        {
          title: '提示内容',
          type: 'Text',
          options: {
            locale: true
          },
          description: '该提示内容会在值为空时显示',
          value: {
            get({ data }) {
              return data.placeholder;
            },
            set({ data }, value: string) {
              data.placeholder = value;
            }
          }
        },
        {
          title: '范围选择',
          type: 'switch',
          value: {
            get({ data }) {
              return data.isMulti;
            },
            set({ data }, value: boolean) {
              data.isMulti = value;
            }
          }
        },
        {
          title: '是否显示“至今”',
          type: 'switch',
          description: '勾选后在最左列最下方增加新选项“至今”，选中后为当前时刻',
          value: {
            get({ data }) {
              return data.config.tillNow;
            },
            set({ data }, value: boolean) {
              data.config.tillNow = value;
            }
          }
        },
        {
          title: '最大选择日期',
          type: 'text',
          description: '请输入满足【Date】对象参数的值',
          value: {
            get({ data }) {
              return data.config.max;
            },
            set({ data }, value: string) {
              data.config.max = value;
            }
          }
        },
        {
          title: '最小选择日期',
          type: 'text',
          description: '请输入满足【Date】对象参数的值',
          value: {
            get({ data }) {
              return data.config.min;
            },
            set({ data }, value: string) {
              data.config.min = value;
            }
          }
        },
        {
          title: '确认按钮文案',
          type: 'text',
          value: {
            get({ data }) {
              return data.config.confirmText;
            },
            set({ data }, value: string) {
              data.config.confirmText = value;
            }
          }
        },
        {
          title: '取消按钮文案',
          type: 'text',
          value: {
            get({ data }) {
              return data.config.cancelText;
            },
            set({ data }, value: string) {
              data.config.cancelText = value;
            }
          }
        },
        {
          title: '日期精度',
          type: 'Select',
          options: [
            { label: '年', value: 'year' },
            { label: '月', value: 'month' },
            { label: '日', value: 'day' },
            { label: '时', value: 'hour' },
            { label: '分', value: 'minute' },
            { label: '秒', value: 'second' },
            { label: '周', value: 'week' },
            { label: '周-日', value: 'week-day' }
          ],
          value: {
            get({ data }) {
              return data.config.precision;
            },
            set(
              { data },
              value:
                | 'year'
                | 'month'
                | 'day'
                | 'hour'
                | 'minute'
                | 'second'
                | 'week'
                | 'week-day'
                | undefined
            ) {
              data.config.precision = value;
            }
          }
        },
        {
          title: '默认面板日期',
          type: 'Text',
          description: '设置面板的默认日期',
          value: {
            get({ data }) {
              return data.config.defaultValue;
            },
            set({ data }, value: string) {
              data.config.defaultValue = value;
            }
          }
        },
        {
          title: '显示此刻',
          type: 'switch',
          description: '当开启时间选择的时候，面板是否显示“此刻”按钮',
          value: {
            get({ data }: EditorResult<Data>) {
              return !!data.showNow;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.showNow = val;
            }
          }
        },
        {
          title: '不可选时间',
          description: '配置不可选择的时间段',
          type: 'ArrayCheckbox',
          options: {
            checkField: 'status',
            visibleField: 'visible',
            getTitle: (item) => item.title,
            items: [
              {
                title: '编辑禁用规则',
                description: '这里返回的number数组为禁用的时刻',
                type: 'code',
                options: {
                  language: 'javascript',
                  enableFullscreen: false,
                  title: '编辑禁用规则',
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
                value: 'validateCode'
              }
            ]
          },
          value: {
            get({ data }) {
              return data?.disabledTimeRules?.length > 0
                ? data.disabledTimeRules
                : ['year', 'month', 'day', 'hour', 'minute', 'second', 'week', 'week-day'].map(
                    (key) => ({
                      key: key,
                      status: false,
                      visible: true,
                      title: `设置 ${key} 禁用规则`,
                      validateCode:
                        encodeURIComponent(`return function (val, exts) {
  // val: number exts: { date: Date }
  return true;
}`)
                    })
                  );
            },
            set({ data }, val) {
              data.disabledTimeRules = val;
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
                description: '提示文字的表达式（{}）, 例：${标题}不能为空',
                type: 'EXPRESSION',
                options: {
                  autoSize: true,
                  placeholder: '例:${标题}不能为空',
                  suggestions: [
                    {
                      label: '标题',
                      insertText: '标题',
                      detail: `标题`
                    }
                  ],
                  runCode: (script) => {
                    return {
                      success: templateRender(script, { label: 'xx标题' })
                    };
                  }
                },
                value: 'message'
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
          description: '自定义校验的触发事件，开启自定义校验后校验时会触发【触发校验】输出项事件',
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
              type: 'text',
              description:
                '日期格式化模板 YYYY:年份 MM:月份 DD:日 dd:星期 HH:24小时制 mm:分 ss:秒',
              options: {
                notaddel: true,
                noteditkey: true,
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.showFormatter;
                },
                set({ data }: EditorResult<Data>, value: string) {
                  data.showFormatter = value;
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
              description:
                '设置日期选择框的初始值时触发，可以通过逻辑连线连接日期选择框的输入项【设置初始值】触发【值初始化】输出项事件',
              options: {
                outputId: 'onInitial'
              }
            },
            {
              title: '值更新',
              type: '_event',
              description:
                '日期选择框的值发生变化时触发，可以通过逻辑连线连接日期选择框的输入项【设置值】或用户选择日期触发【值更新】输出项事件',
              options: {
                outputId: 'onChange'
              }
            },
            {
              title: '值确认',
              type: '_event',
              description:
                '日期选择框的值点击确认时触发，可以通过逻用户选择日期触发【值确认】输出项事件',
              options: {
                outputId: 'onConfirm'
              }
            }
          ]
        }
      ];

      // catalog[1].title = '高级';
      // catalog[1].items = [
      //   {
      //     title: '开启日期插槽',
      //     type: 'Switch',
      //     value: {
      //       get({ data }) {
      //         return data.useCustomDateCell;
      //       },
      //       set({ data, slot }: EditorResult<Data>, value: boolean) {
      //         if (value) {
      //           slot.add({ id: SlotIds.DateCell, title: '插槽', type: 'scope' });
      //         } else {
      //           slot.remove(SlotIds.DateCell);
      //         }
      //         data.useCustomDateCell = value;
      //       }
      //     }
      //   },
      //   // {
      //   //   title: '日期选择面板受控',
      //   //   type: 'Switch',
      //   //   description: '可以通过逻辑连线连接输入项【打开日期选择面板】控制面板是否打开',
      //   //   value: {
      //   //     get({ data }) {
      //   //       return data.controlled || false;
      //   //     },
      //   //     set({ data, inputs }: EditorResult<Data>, value: boolean) {
      //   //       data.controlled = value;
      //   //       if (value) {
      //   //         inputs.add('setOpen', '打开日期选择面板', { type: 'boolean' });
      //   //       } else {
      //   //         inputs.remove('setOpen');
      //   //       }
      //   //     }
      //   //   }
      //   // },
      // ];
    }
  }
};

const getTitle = (item: any, index: number) => {
  const { key, title, numericalLimit, regExr } = item;
  return title;
};
