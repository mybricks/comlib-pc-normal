import {
  RuleKeys,
  defaultValidatorExample,
  LengthRules,
  getTitle,
  showMessage
} from '../utils/validator';
import { createrCatelogEditor } from '../utils';
import { outputIds } from '../form-container/constants';
import { Data } from './runtime';
import { ValidateTriggerType, SizeOptions, SizeEnum } from '../types';

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
          get({ data }) {
            return data.config.size || 'middle';
          },
          set({ data }, val: SizeEnum) {
            data.config.size = val;
          }
        }
      },
      {
        title: '图标来源',
        type: 'Radio',
        options: [
          { label: '无', value: false },
          { label: '内置图标库', value: 'inner' },
          { label: '自定义上传', value: 'custom' }
        ],
        value: {
          get({ data }) {
            return data.src;
          },
          set({ data }, val: false | 'inner' | 'custom') {
            data.src = val;
          }
        }
      },
      {
        title: '选择图标',
        type: 'icon',
        ifVisible({ data }) {
          return data.src === 'inner';
        },
        value: {
          get({ data }) {
            return data.innerIcon;
          },
          set({ data }, val: string) {
            data.innerIcon = val;
          }
        }
      },
      {
        title: '上传',
        type: 'ImageSelector',
        ifVisible({ data }) {
          return data.src === 'custom';
        },
        value: {
          get({ data }) {
            return data.customIcon;
          },
          set({ data }, val: string) {
            data.customIcon = val;
          }
        }
      },
      {
        items: [
          ...createrCatelogEditor({
            catelog: '默认',
            items: [
              {
                title: '边框',
                options: ['border'],
                target: '.ant-input-affix-wrapper'
              },
              {
                title: '表单项背景色',
                options: ['background'],
                target: ['.ant-input-affix-wrapper', '.ant-input-affix-wrapper>input.ant-input']
              },
              {
                title: '提示内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: 'input::placeholder'
              },
              {
                title: '清除按钮',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-close-circle'
              },
              {
                title: '文本内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.ant-input'
              },
              {
                title: '前置标签',
                options: [
                  'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-input-group-addon:first-child'
              },
              {
                title: '后置标签',
                options: [
                  'border',
                  { type: 'font', config: { disableTextAlign: true } },
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: '.ant-input-group-addon:last-child'
              },
              {
                title: '后缀内置图标',
                options: ['font'],
                target: '.anticon'
              },
              {
                title: '后缀自定义图标',
                options: ['size'],
                target: '.ant-image-img'
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Hover',
            items: [
              {
                catelog: 'Hover',
                title: '边框',
                options: ['border'],
                target: '.ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover',
                domTarget: '.ant-input-affix-wrapper'
              },
              {
                title: '清除按钮',
                catelog: 'Hover',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.anticon-close-circle:hover',
                domTarget: '.anticon-close-circle'
              }
            ]
          }),
          {
            catelog: 'Focus',
            title: '边框',
            options: ['border', 'BoxShadow'],
            target:
              'span.ant-input-affix-wrapper-focused:not(.ant-input-affix-wrapper-disabled).ant-input-affix-wrapper'
          },
          ...createrCatelogEditor({
            catelog: '禁用',
            items: [
              {
                title: '表单项',
                catelog: '禁用',
                options: [
                  'border',
                  { type: 'background', config: { disableBackgroundImage: true } }
                ],
                target: ['.ant-input-affix-wrapper-disabled']
              }
            ]
          })
        ]
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
          title: '前置标签',
          type: 'text',
          options: {
            locale: true
          },
          description: '带标签的 input，设置前置标签',
          value: {
            get({ data }) {
              return data.config.addonBefore;
            },
            set({ data }, value: string) {
              data.config.addonBefore = value;
            }
          }
        },
        {
          title: '后置标签',
          type: 'text',
          options: {
            locale: true
          },
          description: '带标签的 input，设置后置标签',
          value: {
            get({ data }) {
              return data.config.addonAfter;
            },
            set({ data }, value: string) {
              data.config.addonAfter = value;
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
          title: '显示字数',
          type: 'switch',
          description: '是否展示字数',
          value: {
            get({ data }) {
              return data.config.showCount;
            },
            set({ data }, value: boolean) {
              data.config.showCount = value;
            }
          }
        },
        {
          title: '删除两端空白字符',
          type: 'Switch',
          description: '是否删除两端空白字符',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.isTrim;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.isTrim = value;
            }
          }
        },
        {
          title: '最大长度',
          type: 'InputNumber',
          description: '可输入的内容最大长度, -1 为不限制',
          options: [{ min: -1 }],
          value: {
            get({ data }) {
              return [data.config.maxLength];
            },
            set({ data }, value: number) {
              data.config['maxLength'] = value[0];
            }
          }
        },
        {
          title: '校验触发时机',
          type: 'Select',
          description: '配置校验触发的时机',
          options: {
            mode: 'tags',
            multiple: true,
            options: [
              { label: '值变化', value: ValidateTriggerType.OnChange },
              { label: '失去焦点', value: ValidateTriggerType.OnBlur },
              { label: '按下回车', value: ValidateTriggerType.OnPressEnter }
            ]
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.validateTrigger;
            },
            set({ data }: EditorResult<Data>, value: string[]) {
              data.validateTrigger = value;
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
              // {
              //   title: '提示文字',
              //   description: '提示文字的表达式（{}, =, <, >, ||, &&）, 例：${label}不能为空',
              //   type: 'EXPRESSION',
              //   options: {
              //     autoSize: true,
              //     placeholder: '例：${label}不能为空',
              //     // suggestions: getSuggestions(true),
              //   },
              //   value: 'message'
              // },
              {
                title: '提示文字',
                type: 'Text',
                options: {
                  locale: true
                },
                value: 'message',
                ifVisible(item: any, index: number) {
                  return showMessage(item.key);
                }
              },
              {
                title: '正则校验',
                type: 'Text',
                value: 'regExr',
                ifVisible(item: any, index: number) {
                  return item.key === RuleKeys.REG_EXP;
                }
              },
              {
                title: '最小长度',
                type: 'inputNumber',
                value: 'limitMinLength',
                options: [{ min: 0, max: 10000, width: 100 }],
                ifVisible(item: any, index: number) {
                  return item.key === RuleKeys.MIN_LENGTH;
                }
              },
              {
                title: '最大长度',
                type: 'inputNumber',
                value: 'limitMaxLength',
                options: [{ min: 0, max: Infinity, width: 100 }],
                ifVisible(item: any, index: number) {
                  return item.key === RuleKeys.MAX_LENGTH;
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
              return data.rules.length > 0 ? data.rules : LengthRules;
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
            const customRule = (data.rules || LengthRules).find(
              (i) => i.key === RuleKeys.CUSTOM_EVENT
            );
            return !!customRule?.status;
          },
          options: {
            outputId: outputIds.ON_VALIDATE
          }
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
            },
            {
              title: '失去焦点',
              type: '_event',
              options: {
                outputId: 'onBlur'
              }
            },
            {
              title: '按下回车',
              type: '_event',
              options: {
                outputId: 'onPressEnter'
              }
            }
          ]
        }
      ];
    }
  }
};
