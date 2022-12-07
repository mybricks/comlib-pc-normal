import { RuleKeys, defaultRules } from '../utils/validator';
import { InputIds } from '../types';
import { SlotIds, SlotInputIds } from './constants';

export default {
  '@resize': {
    options: ['width']
  },
  // '@inputUpdated'({ data, input, output, slots }: EditorResult<any>, updatePin) {
  //   if (updatePin.id === InputIds.SetValue) {
  //     console.log(updatePin.schema, 'inputUpdated')
  //     slots.get(SlotIds.FormItem).inputs.get(SlotInputIds.CurValue).setSchema(updatePin.schema);
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
          get({ data }) {
            return data.rules.length > 0 ? data.rules : [defaultRules[1]];
          },
          set({ data }, value: any) {
            data.rules = value;
          }
        }
      },
      {
        title: '事件',
        items: [
          {
            title: '值发生改变',
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
