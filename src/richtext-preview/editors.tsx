import { Data } from './runtime';

export default {
  '@resize': {
    options: ['width']
  },
  ':root': [
    {
      title: '内容',
      type: 'RichText',
      options: {
        editConfig: {
          width: '80%'
        },
        contentCss: `
          p {line-height: 1.2; margin: 0}  
        `
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.content;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.content = value;
        },
      },
    },
  ],
};
