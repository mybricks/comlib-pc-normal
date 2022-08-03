import { Data, defaultCode, defaultCodeAnnotation } from './constants';

export default {
  ':root': [
    // {
    //   title: '源slotKey',
    //   type: 'Text',
    //   value: {
    //     get({ data }: EditorResult<Data>) {
    //       return data.sourceSlotKey;
    //     },
    //     set({ data }: EditorResult<Data>, value: string) {
    //       data.sourceSlotKey = value;
    //     }
    //   }
    // },
    // {
    //   title: '目标slotKey',
    //   type: 'Text',
    //   value: {
    //     get({ data }: EditorResult<Data>) {
    //       return data.targetSlotKey;
    //     },
    //     set({ data }: EditorResult<Data>, value: string) {
    //       data.targetSlotKey = value;
    //     }
    //   }
    // },
    {
      title: '数据适配',
      type: 'Code',
      options: {
        theme: 'light',
        title: '插槽数据适配 - 代码编辑',
        comments: defaultCodeAnnotation,
        language: 'javascript',
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
      value: {
        get({ data }: EditorResult<Data>) {
          return data.adapterCode || defaultCode;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.adapterCode = value;
        }
      }
    }
  ]
};
