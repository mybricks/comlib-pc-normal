import { Data, OutputIds } from './constants';

export default {
  '@init'({ style }) {
    style.width = 80;
    style.height = 50;
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': [
    {
      title: '作为热区使用',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.asMapArea;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.asMapArea = value;
        }
      }
    },
    {
      ifVisible({ data }: EditorResult<Data>) {
        return !data.asMapArea;
      },
      items: [
        {
          title: '文字标题',
          type: 'text',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.text;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.text = value;
            }
          }
        },
        {
          title: '样式',
          type: 'style',
          options: {
            defaultOpen: true,
            plugins: ['border', 'font', 'bgcolor', 'bgimage']
          },
          value: {
            get: ({ data }: EditorResult<Data>) => {
              return data.style;
            },
            set: ({ data }: EditorResult<Data>, value) => {
              data.style = value;
            }
          }
        }
      ]
    },
    {
      title: '点击',
      type: '_Event',
      options: {
        outputId: OutputIds.Click
      }
    }
  ]
};
