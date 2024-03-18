import { RuleKeys, defaultRules } from '../utils/validator';
import { InputIds, OutputIds } from '../types';
import { SlotIds, SlotInputIds, SlotOutputIds } from './constants';
import { Data } from './types';
import { outputIds } from '../form-container/constants';

export default {
  '@resize': {
    options: ['width']
  },
  '@init': ({ style }) => {
    style.width = '100%';
  },
  // '@inputUpdated'({ data, input, output, slots }: EditorResult<any>, updatePin) {
  //   if (updatePin.id === InputIds.SetInitialValue) {
  //     slots.get(SlotIds.FormItem).inputs.get(SlotInputIds.CurValue).setSchema(updatePin.schema);
  //     output.get(OutputIds.OnInitial).setSchema(updatePin.schema);
  //     if (output.get(OutputIds.OnChange).schema?.type === 'any') {
  //       output.get(OutputIds.OnChange).setSchema(updatePin.schema);
  //     }
  //   }
  //   if (updatePin.id === InputIds.SetValue) {
  //     slots.get(SlotIds.FormItem).inputs.get(SlotInputIds.CurValue).setSchema(updatePin.schema);
  //     output.get(OutputIds.OnChange).setSchema(updatePin.schema);
  //     if (output.get(OutputIds.OnInitial).schema?.type === 'any') {
  //       output.get(OutputIds.OnInitial).setSchema(updatePin.schema);
  //     }
  //   }
  // },
  // '@inputDisConnected'({ data, output, input, slots }: EditorResult<any>, formPin, toPin) {
  //   if (toPin.id === InputIds.SetValue) {
  //     console.log(toPin.schema, 'inputDisConnected')
  //     slots.get(SlotIds.FormItem).inputs.get(SlotInputIds.CurValue).setSchema(toPin.schema);
  //   }
  // },
  ':root'({ data }: EditorResult<{ type }>, ...catalog) {
    catalog[0].title = '常规';

    catalog[0].items = [
      {
        title: '值数据类型',
        type: '_schema',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.valueSchema || { type: 'any' };
          },
          set({ data, input, output, slot }: EditorResult<Data>, value: object) {
            data.valueSchema = value;

            input.get(InputIds.SetInitialValue).setSchema(value);
            input.get(InputIds.SetValue).setSchema(value);
            output.get(OutputIds.OnInitial).setSchema(value);
            output.get(OutputIds.OnChange).setSchema(value);
            output.get(OutputIds.ReturnValue).setSchema(value);
            output.get(OutputIds.OnValidate).setSchema(value);
            slot.get(SlotIds.FormItem).inputs.get(SlotInputIds.CurValue).setSchema(value);
            slot.get(SlotIds.FormItem).outputs.get(SlotOutputIds.SetCurValue).setSchema(value);
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
              options: {
                locale: true
              },
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
            return data.rules.length > 0 ? data.rules : [defaultRules[1], defaultRules[2]];
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
          }
        ]
      }
    ];
  }
};
