import { Data } from './types';
import { RuleKeys, defaultRules, getTitle } from '../utils/validator';
import { createrCatelogEditor } from '../utils';
import { OutputIds, SizeEnum, SizeOptions } from '../types';
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
        items: [
          ...createrCatelogEditor({
            catelog: '默认',
            items: [
              {
                title: '文本内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.ant-picker-input>input'
              },
              {
                title: '提示内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: 'input::placeholder'
              },
              {
                title: '时间图标',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-clock-circle'
              },
              {
                title: '清除按钮',
                options: [
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.anticon-close-circle'
              },
              {
                title: '弹出菜单挂载点',
                description: '可在预览态下看到效果，调试态基于画布元素',
                type: 'select',
                options: [
                  { label: 'Body元素', value: 'body' },
                  { label: '当前节点', value: 'current' }
                ],
                value: {
                  get({ data }) {
                    return data.mount || `body`;
                  },
                  set({ data }, value: string) {
                    data.mount = value;
                  }
                }
              },
              {
                title: '选择框',
                options: ['border', 'background'],
                target: '.ant-picker'
              },
              {
                title: '时间',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target: `.{id} .ant-picker-time-panel-column>li.ant-picker-time-panel-cell .ant-picker-time-panel-cell-inner`
              },
              {
                title: '确认按钮',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'border' },
                  'BoxShadow'
                ],
                global: true,
                target: `.{id} .ant-btn-primary`
              },
              {
                title: '下拉区域',
                options: [{ type: 'background', config: { disableBackgroundImage: true } }],
                global: true,
                target: '.{id} .ant-picker-panel-container'
              },
              {
                title: '底部操作栏',
                options: [{ type: 'background', config: { disableBackgroundImage: true } }],
                global: true,
                target: `.{id} .ant-picker-ranges`
              },
              {
                title: '此刻',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                global: true,
                target: `.{id} a`
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Hover',
            items: [
              {
                title: '清除按钮',
                catelog: 'Hover',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-close-circle:hover',
                domTarget: '.anticon-close-circle'
              },
              {
                title: '选择框',
                options: ['border'],
                target: '.ant-picker:hover',
                domTarget: '.ant-picker'
              },
              {
                title: '时间',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target: `.{id} .ant-picker-time-panel-column>li.ant-picker-time-panel-cell .ant-picker-time-panel-cell-inner:hover`
              },
              {
                title: '确认按钮',
                catelog: 'Hover',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'border' },
                  'BoxShadow'
                ],
                global: true,
                target: `.{id}  .ant-btn:not([disabled]):hover`
              },
              {
                title: '此刻',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                global: true,
                target: `.{id} a:hover`
              }
              // {
              //   title: '确认按钮-禁用态',
              //   options: [
              //     { type: 'background', config: { disableBackgroundImage: true } },
              //     { type: 'font', config: { disableTextAlign: true } },
              //     { type: 'border' },
              //   ],
              //   global: true,
              //   target: `.{id} .ant-btn-primary[disabled]:hover`
              // },
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Focus',
            items: [
              {
                title: '选择框',
                options: ['border', 'BoxShadow'],
                target: '.ant-picker-focused.ant-picker'
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Select',
            items: [
              {
                title: '时间',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } }
                ],
                global: true,
                target: `.{id} .ant-picker-panel .ant-picker-time-panel-column>li.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner`
              },
              {
                title: '确认按钮',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'border' },
                  'BoxShadow'
                ],
                global: true,
                target: `.{id}  .ant-btn-primary:active`
              },
              {
                title: '此刻',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                global: true,
                target: `.{id} a:active`
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: '禁用',
            items: [
              {
                title: '确认按钮',
                options: [
                  { type: 'background', config: { disableBackgroundImage: true } },
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'border' },
                  'BoxShadow'
                ],
                global: true,
                target: `.{id}  .ant-btn-primary[disabled]`
              },
              {
                title: '表单项',
                catelog: '禁用',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-picker.ant-picker-disabled'
              }
            ]
          })
        ]
      }
    ],
    items: ({ data }: EditorResult<Data>, ...cate) => {
      cate[0].title = '配置';
      cate[0].items = [
        {
          title: '属性',
          items: [
            {
              title: '提示内容',
              type: 'Text',
              options: {
                locale: true
              },
              description: '该提示内容会在值为空时显示',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.placeholder;
                },
                set({ data }: EditorResult<Data>, val: string) {
                  data.placeholder = val;
                }
              }
            },
            {
              title: '禁用状态',
              type: 'switch',
              description: '配置默认是否禁用状态',
              value: {
                get({ data }: EditorResult<Data>) {
                  return !!data.disabled;
                },
                set({ data }: EditorResult<Data>, val: boolean) {
                  data.disabled = val;
                }
              }
            },
            {
              title: '显示此刻',
              type: 'switch',
              description: '配置面板是否展示“此刻”按钮',
              value: {
                get({ data }: EditorResult<Data>) {
                  return !!data.showNow;
                },
                set({ data }: EditorResult<Data>, val: boolean) {
                  data.showNow = val;
                }
              }
            }
          ]
        },
        {
          title: '输出数据处理',
          items: [
            {
              title: '时间格式模版',
              type: 'select',
              description: '将输出(值变化事件和表单提交)的数据设置成所需要的格式',
              options: {
                options: [
                  { label: '时:分:秒', value: 'HH:mm:ss' },
                  { label: '时:分', value: 'HH:mm' },
                  { label: '时', value: 'HH' },
                  { label: '时间戳', value: 'timeStamp' },
                  { label: '自定义', value: 'custom' }
                ]
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.format || 'HH:mm:ss';
                },
                set({ data, output }: EditorResult<Data>, val: string) {
                  data.format = val;
                  let valueSchema = {
                    type: 'string'
                  };
                  if (data.format === 'timeStamp') {
                    valueSchema = {
                      type: 'number'
                    };
                  }
                  output.get(OutputIds.OnValidate).setSchema(valueSchema);
                }
              }
            },
            {
              title: '自定义模版',
              description: '自定义输出数据的时间格式，选中【时间格式模版】的自定义项后可配置',
              type: 'text',
              ifVisible({ data }: EditorResult<Data>) {
                return data.format === 'custom';
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.customFormat || 'HH:mm:ss';
                },
                set({ data }: EditorResult<Data>, val: string) {
                  data.customFormat = val;
                }
              }
            }
          ]
        },
        {
          title: '步长',
          items: [
            {
              title: '时',
              description: '设置小时的步长，展示可选的小时',
              type: 'inputNumber',
              options: [{ width: 100, min: 1, max: 24 }],
              value: {
                get({ data }: EditorResult<Data>) {
                  return [data.config?.hourStep || 1];
                },
                set({ data }: EditorResult<Data>, value: number[]) {
                  data.config.hourStep = value[0];
                }
              }
            },
            {
              title: '分',
              description: '设置分钟的步长，展示可选的分钟',
              type: 'inputNumber',
              options: [{ width: 100, min: 0, max: 60 }],
              value: {
                get({ data }: EditorResult<Data>) {
                  return [data.config?.minuteStep || 1];
                },
                set({ data }: EditorResult<Data>, value: number[]) {
                  data.config.minuteStep = value[0];
                }
              }
            },
            {
              title: '秒',
              description: '设置秒的步长，展示可选的秒',
              type: 'inputNumber',
              options: [{ width: 100, min: 0, max: 60 }],
              value: {
                get({ data }: EditorResult<Data>) {
                  return [data.config?.secondStep || 1];
                },
                set({ data }: EditorResult<Data>, value: number[]) {
                  data.config.secondStep = value[0];
                }
              }
            }
          ]
        },
        {
          title: '校验',
          items: [
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
              description:
                '自定义校验的触发事件，开启自定义校验后校验时会触发【触发校验】输出项事件',
              ifVisible({ data }: EditorResult<Data>) {
                const customRule = (data.rules || defaultRules).find(
                  (i) => i.key === RuleKeys.CUSTOM_EVENT
                );
                return !!customRule?.status;
              },
              options: {
                outputId: OutputIds.OnValidate
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
                '设置时间选择框的初始值时触发，可以通过逻辑连线连接时间选择框的输入项【设置初始值】触发【值初始化】输出项事件',
              options: {
                outputId: 'onInitial'
              }
            },
            {
              title: '值更新',
              type: '_Event',
              description:
                '时间选择框的值发生变化时触发，可以通过逻辑连线连接时间选择框的输入项【设置值】或用户选择时间触发【值更新】输出项事件',
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
