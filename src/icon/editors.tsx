import { Data, OutputIds } from './constants';

export default {
  '@init': ({ style }) => {
    style.width = 'auto';
  },
  ':root': {
    items: ({}: EditorResult<Data>, cate1) => {
      cate1.title = '常规';
      cate1.items = [
        {
          title: '选择图标',
          type: 'Icon',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.icon;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.icon = value;
            }
          }
        },
        {
          title: '点击',
          type: '_Event',
          options: () => {
            return {
              outputId: OutputIds.Click
            };
          }
        }
      ];
    },
    style: [
      {
        items: [
          {
            catelog: '默认',
            title: '默认',
            options: [
              {
                type: 'font', 
                config: { 
                  disableTextAlign: true, 
                  disableFontFamily: true, 
                  disableFontWeight: true,
                  disableLetterSpacing: true 
                }
              }
            ],
            target: `.icon`
          },
          {
            catelog: '默认',
            options: [
              'border',
              'padding',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target: `[data-item-type="icon"]`
          },
          {
            catelog: 'Hover',
            title: 'Hover',
            options: [
              {
                type: 'font', 
                config: { 
                  disableTextAlign: true, 
                  disableFontFamily: true, 
                  disableFontWeight: true,
                  disableLetterSpacing: true 
                }
              }
            ],
            target: `.icon:hover`
          },
          {
            catelog: 'Hover',
            options: [
              'border',
              'padding',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target: '[data-item-type="icon"]:hover'
          }
        ]
      }
    ]
  }
};
