import { Data } from './types';
import { RuleKeys, defaultRules, getTitle } from '../utils/validator';
import { createrCatelogEditor } from '../utils';
export default {
  '@resize': {
    options: ['width']
  },
  '@init': ({ style }) => {
    style.width = '100%'
  },
  ':root': {
    style: [
      ...createrCatelogEditor({
        catelog: '默认',
        items: [
          {
            title: '边框',
            options: ['border'],
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
          }
        ]
      }),
      ...createrCatelogEditor({
        catelog: 'Hover',
        items: [
          {
            title: '边框',
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
            title: '边框',
            options: ['border', 'BoxShadow'],
            target: '.ant-picker-focused.ant-picker'
          },
        ]
      }),
      ...createrCatelogEditor({
        catelog: '选中',
        items: [
          {
            title: '时间',
            options: [
              'border',
              { type: 'background', config: { disableBackgroundImage: true } },
              { type: 'font', config: { disableTextAlign: true } }
            ],
            global: true,
            target: `.{id} .ant-picker-time-panel-column>li.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner`
          },
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
            ],
            global: true,
            target: `.{id}  .ant-btn-primary[disabled]`
          },
        ]
      }),
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
              value: {
                get({ data }: EditorResult<Data>) {
                  return !!data.disabled;
                },
                set({ data }: EditorResult<Data>, val: boolean) {
                  data.disabled = val;
                }
              }
            }
          ]
        },
        {
          title: "输出数据处理",
          items: [
            {
              title: '时间格式模版',
              type: 'select',
              options: {
                options: [
                  { label: '时:分:秒', value: 'HH:mm:ss' },
                  { label: '时:分', value: 'HH:mm' },
                  { label: '时', value: 'HH' },
                  { label: "时间戳", value: "timeStamp" },
                  { label: '自定义', value: 'custom' },
                ]
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.format || 'HH:mm:ss';
                },
                set({ data }: EditorResult<Data>, val: string) {
                  data.format = val
                }
              }
            },
            {
              title: '自定义模版',
              type: 'text',
              ifVisible({ data }: EditorResult<Data>) {
                return data.format === 'custom';
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.customFormat || 'HH:mm:ss';
                },
                set({ data }: EditorResult<Data>, val: string) {
                  data.customFormat = val
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
              type: '_Event',
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
