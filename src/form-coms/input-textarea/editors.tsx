import {
  RuleKeys,
  defaultValidatorExample,
  LengthRules,
  getTitle,
  showMessage
} from '../utils/validator';
import { Data } from './runtime';
import { createrCatelogEditor } from '../utils';
import { outputIds } from '../form-container/constants';
import { SizeEnum, SizeOptions } from '../types';

export default {
  '@resize': {
    options: ['width']
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
                title: '边框',
                options: ['border'],
                target: '.ant-input'
              },
              {
                title: '表单项背景色',
                options: ['background'],
                target: ['.ant-input']
              },
              {
                title: '提示内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: 'textarea.ant-input::placeholder'
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
                title: '字数',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.ant-input-textarea-show-count::after'
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Hover',
            items: [
              {
                title: '边框',
                catelog: 'Hover',
                options: ['border'],
                target: '.ant-input:hover',
                domTarget: '.ant-input'
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
          ...createrCatelogEditor({
            catelog: 'Focus',
            items: [
              {
                title: '边框',
                catelog: 'Focus',
                options: ['border', 'BoxShadow'],
                target: 'textarea.ant-input:focus'
              }
            ]
          }),
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
                target: ['.ant-input[disabled]']
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
          title: '行数限制',
          type: 'Inputnumber',
          options: [
            { title: '最小', min: 3, width: 100 },
            { title: '最大', min: 6, width: 100 }
          ],
          description: '行数限制',
          value: {
            get({ data }) {
              return [data.minRows || 3, data.maxRows || 6];
            },
            set({ data }, value: number[]) {
              data.minRows = value[0];
              data.maxRows = value[1];
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
          title: '内容最大长度',
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
