import { Data } from './constants';

export default {
  '@init': ({ style }: EditorResult<Data>) => {
    style.height = 200;
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': [
    {
      title: '链接地址',
      type: 'Textarea',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.url;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.url = value;
        }
      }
    },
    {
      title: '使用srcDoc',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useSrcDoc;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.useSrcDoc = value;
        }
      }
    },
    {
      title: 'ID',
      type: 'text',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.id;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.id = value;
        }
      }
    }
  ]
};
