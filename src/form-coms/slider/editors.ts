import { RuleKeys, defaultValidatorExample, defaultRules } from '../utils/validator';
import { Data } from './types';
import { InputIds, OutputIds } from '../types';

export default {
  '@init'({ style }) {
    style.width = '100%';
    style.height = '100%';
  },
  '@resize': {
    options: ['width']
  },
  ':root'({ data }: EditorResult<{ type }>, ...catalog) {
    catalog[0].title = '常规';

    catalog[0].items = [
      {
        title: '范围',
        type: 'inputnumber',
        description: '设置滑动输入条的范围',
        options: [
          { title: '最小值', width: 100 },
          { title: '最大值', width: 100 }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.config.min, data.config.max];
          },
          set({ data }: EditorResult<Data>, value: [number, number]) {
            [data.config.min, data.config.max] = value;
          }
        }
      },
      {
        title: '展示单位',
        type: 'text',
        description: '设置数值格式化展示的单位',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.formatter;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.formatter = value;
          }
        }
      },
      {
        title: '区间选择',
        type: 'switch',
        description: '是否开启区间范围选择',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.config.range;
          },
          set({ data, input, output }, value: boolean) {
            data.config.range = value;
            if (value) {
              const schema = {
                type: 'array',
                items: {
                  type: 'number'
                }
              };
              input.get(InputIds.SetInitialValue)?.setSchema(schema);
              output.get(OutputIds.OnInitial)?.setSchema(schema);
              input.get(InputIds.SetValue).setSchema(schema);
              output.get(OutputIds.OnChange).setSchema(schema);
              output.get(OutputIds.ReturnValue).setSchema(schema);
            } else {
              const schema = {
                type: 'number'
              };
              input.get(InputIds.SetInitialValue)?.setSchema(schema);
              output.get(OutputIds.OnInitial)?.setSchema(schema);
              input.get(InputIds.SetValue).setSchema(schema);
              output.get(OutputIds.OnChange).setSchema(schema);
              output.get(OutputIds.ReturnValue).setSchema(schema);
            }
          }
        }
      },
      {
        title: '输入功能',
        type: 'switch',
        description: '是否开启后置输入框',
        ifVisible({ data }) {
          return !data.config.range;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useInput;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.useInput = value;
          }
        }
      },
      {
        title: '滑动条宽度',
        type: 'slider',
        options: {
          max: 24,
          min: 1,
          steps: 1,
          formatter: "/24栅格"
        },
        ifVisible({ data }: EditorResult<Data>) {
          return !data.config.range && data.useInput;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.sliderSpan;
          },
          set({ data }: EditorResult<Data>, value: number) {
            data.sliderSpan = value;
          }
        }
      },
      {
        title: '数字输入框宽度',
        type: 'slider',
        options: {
          max: 24,
          min: 1,
          steps: 1,
          formatter: "/24栅格"
        },
        ifVisible({ data }: EditorResult<Data>) {
          return !data.config.range && data.useInput;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.inputSpan;
          },
          set({ data }: EditorResult<Data>, value: number) {
            data.inputSpan = value;
          }
        }
      },
      {
        title: '禁用状态',
        type: 'switch',
        description: '是否禁用状态',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.config.disabled;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.config.disabled = value;
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
          getTitle: ({ title }: any) => {
            return title;
          },
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
          get({ data }: EditorResult<Data>) {
            return data?.rules?.length > 0 ? data.rules : defaultRules;
          },
          set({ data }: EditorResult<Data>, value: any) {
            data.rules = value;
          }
        }
      },
      {
        title: '事件',
        items: [
          {
            title: '初始化',
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
        ]
      }
    ];
  },
}