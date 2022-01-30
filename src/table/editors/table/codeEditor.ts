import { defaultCode, defaultCodeAnnotation } from '../../constants';
import { Data } from '../../types';

export const CodeEditor = [
  {
    title: '代码编辑',
    type: 'code',
    options: {
      theme: 'light',
      title: '数据赋值-代码编辑',
      comments: defaultCodeAnnotation,
      language: 'javascript',
      width: 600,
      minimap: {
        enabled: false
      }
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return data.onLoadData || defaultCode;
      },
      set({ data }: EditorResult<Data>, value: string) {
        data.onLoadData = value;
      }
    }
  }
];
