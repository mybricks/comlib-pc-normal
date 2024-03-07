import { Data } from './types';
import { RuleKeys, LengthRules, showMessage, getTitle } from '../utils/validator';
import { createrCatelogEditor } from '../utils';
import { SizeEnum, SizeOptions, ValidateTriggerType } from '../types';

export default {
  '@resize': {
    options: ['width']
  },
  '@init': ({ style }) => {
    style.width = '100%'
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
                target: '.ant-input-affix-wrapper'
              },
              {
                title: '表单项背景色',
                options: [{ type: 'background', config: { disableBackgroundImage: true } }],
                target:  ['.ant-input-affix-wrapper', '.ant-input-affix-wrapper>input.ant-input']
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
                title: '密码图标',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.ant-input-password-icon.anticon'
              },
              {
                title: '文本内容',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.ant-input'
              }
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Hover',
            items: [
              {
                title: 'Hover',
                catelog: 'Hover',
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
              },
              {
                title: '密码图标',
                options: [{ type: 'font', config: { disableTextAlign: true } }],
                target: '.ant-input-password-icon.anticon:hover'
              },
            ]
          }),
          ...createrCatelogEditor({
            catelog: 'Focus',
            items: [
              {
                title: '激活',
                options: ['border','BoxShadow'],
                target: 'span.ant-input-affix-wrapper-focused:not(.ant-input-affix-wrapper-disabled).ant-input-affix-wrapper'
              },
            ]
          }),
          ...createrCatelogEditor({
            catelog: '禁用',
            items: [
              {
                title: '表单项',
                catelog: '禁用',
                options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
                target: [
                  '.ant-input-affix-wrapper-disabled'
                ]
              },
            ]
          }),
        ]
      },
    ],
    items: ({ data }: EditorResult<{ type }>, ...cate) => {
      cate[0].title = '配置';
      cate[0].items = [
        {
          title: '属性',
          items: [
            {
              title: '提示内容',
              type: 'Text',
              description: '该提示内容会在值为空时显示',
              options: {
                locale: true
              },
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
        // {
        //   title: '校验触发时机',
        //   type: 'Select',
        //   description: '配置校验触发的时机',
        //   options: {
        //     mode: 'tags',
        //     multiple: true,
        //     options: [
        //       { label: '值初始化', value: ValidateTriggerType.OnInit },
        //       { label: '值更新', value: ValidateTriggerType.OnChange },
        //       { label: '按下回车', value: ValidateTriggerType.OnPressEnter }
        //     ]
        //   },
        //   value: {
        //     get({ data }) {
        //       return data.validateTrigger;
        //     },
        //     set({ data }, value: string[]) {
        //       data.validateTrigger = value;
        //     }
        //   }
        // },
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
                    options: {
                      locale: true
                    },
                    ifVisible(item: any, index: number) {
                      return showMessage(item.key);
                    }
                  },
                  {
                    title: '正则表达式',
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
            }
          ]
        },
        {
          title: '校验触发事件',
          type: '_event',
          ifVisible({ data }) {
            const customRule = (data.rules || LengthRules).find(
              (i) => i.key === RuleKeys.CUSTOM_EVENT
            );
            return !!customRule?.status;
          },
          options: {
            outputId: 'onValidate'
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
              type: '_Event',
              options: {
                outputId: 'onChange'
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
