import { RuleKeys, defaultValidatorExample, defaultRules } from '../utils/validator';
import { SizeEnum, SizeOptions, ValidateTriggerType } from '../types';
import { Data } from './runtime';

export default {
  '@init'({ data, style }) {
    style.width = '100%';
  },
  '@resize': {
    options: ['width']
  },
  ':root': {
    style: [],
    items: ({ data }: EditorResult<{ type }>, ...catalog) => {
      catalog[0].title = '常规';
      catalog[0].items = [
        {
          title: '内容',
          type: 'text',
          description:
            '设置文本的默认内容，也可以通过逻辑连线连接文本的输入项【内容】动态修改文本的内容',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.content;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.content = value;
            }
          }
        },
        {
          title: '格式化',
          type: 'switch',
          description:
            '勾选后自动对数字进行两位小数格式化',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.isFormat;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.isFormat = value;
            }
          }
        },
        {
          title: '前置内容',
          type: 'text',
          options: {
            locale: true
          },
          description: '拼接在内容前方',
          value: {
            get({ data }) {
              return data.addonBefore;
            },
            set({ data }, value: string) {
              data.addonBefore = value;
            }
          }
        },
        {
          title: '后置内容',
          type: 'text',
          options: {
            locale: true
          },
          description: '拼接在内容后方',
          value: {
            get({ data }) {
              return data.addonAfter;
            },
            set({ data }, value: string) {
              data.addonAfter = value;
            }
          }
        },
        // {
        //   title: '事件',
        //   items: [
        //     {
        //       title: '值初始化',
        //       type: '_event',
        //       options: {
        //         outputId: 'onInitial'
        //       }
        //     },
        //     {
        //       title: '值更新',
        //       type: '_event',
        //       options: {
        //         outputId: 'onChange'
        //       }
        //     },
        //     {
        //       title: '按下回车',
        //       type: '_event',
        //       options: {
        //         outputId: 'onPressEnter'
        //       }
        //     }
        //   ]
        // }
      ];
    }
  }
};
