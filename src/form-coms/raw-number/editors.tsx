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
        }
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
