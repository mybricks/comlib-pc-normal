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
      items: [
        {
          title: '文字标题',
          type: 'text',
          value: {
            get({ data }) {
              return data.text;
            },
            set({ data }, value: string) {
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
            get: ({ data }) => {
              return data.style;
            },
            set: ({ data }, value) => {
              data.style = value;
            }
          }
        }
      ]
    },
    {
      title: '单击',
      type: '_Event',
      options: {
        outputId: 'click'
      }
    },
    {
      title: '双击',
      type: '_Event',
      options: {
        outputId: 'dblClick'
      }
    }
  ]
};
