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
      {
        items: [
          ...createrCatelogEditor({
            catelog: '表单项',
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
                catelog: '激活',
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
                ifVisible({ data }) {
                  return data.disabled;
                },
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
