import { Data, OutputIds } from './constants';

export default {
  '@init': ({ style }) => {
    style.width = 'fit-content';
  },
  '@resize': {
    options: ['width'],
    value: {
      set({data}, {width, height}) {
        if (width) {
          data.styleWidth = width
        }
      }
    }
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
          title: '禁止冒泡',
          description: '默认关闭，阻止多选框的点击事件冒泡',
          type:'switch',
          value: {
            get({ data }) {
              return data.eventBubble;
            },
           set({ data }, value: boolean) {
              data.eventBubble = value;
            }}
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
          // {
          //   catelog: '默认',
          //   title: '尺寸',
          //   options: [
          //     {
          //       type: 'font',
          //       config: {
          //         disableTextAlign: true,
          //         disableFontFamily: true,
          //         disableFontWeight: true,
          //         disableLetterSpacing: true,
          //         disableColor: true,
          //         //disableFontSize: true,
          //         disableLineHeight: true
          //       }
          //     }
          //   ],
          //   target: `.icon`
          // },
          {
            catelog: '默认',
            title: '颜色',
            options: [
              {
                type: 'font',
                config: {
                  disableTextAlign: true,
                  disableFontFamily: true,
                  disableFontWeight: true,
                  disableLetterSpacing: true,
                  //disableColor: true,
                  disableFontSize: true,
                  disableLineHeight: true
                }
              }
            ],
            target: `.icon`
          },
          // {
          //   catelog: '默认',
          //   title: '行高',
          //   options: [
          //     {
          //       type: 'font',
          //       config: {
          //         disableTextAlign: true,
          //         disableFontFamily: true,
          //         disableFontWeight: true,
          //         disableLetterSpacing: true,
          //         disableFontSize: true,
          //         disableColor: true
          //         //disableLineHeight: true
          //       }
          //     }
          //   ],
          //   target: `.icon`
          // },
          {
            catelog: '默认',
            options: [
              'border',
              'padding',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target: `[data-item-type="icon"]`
          },
          // {
          //   catelog: '默认',
          //   options: ['font'],
          //   target: `.icon`
          // },
          // {
          //   catelog: 'Hover',
          //   title: '尺寸',
          //   options: [
          //     {
          //       type: 'font',
          //       config: {
          //         disableTextAlign: true,
          //         disableFontFamily: true,
          //         disableFontWeight: true,
          //         disableLetterSpacing: true,
          //         disableColor: true,
          //         //disableFontSize: true,
          //         disableLineHeight: true
          //       }
          //     }
          //   ],
          //   target: `.icon:hover`
          // },
          {
            catelog: 'Hover',
            title: '颜色',
            options: [
              {
                type: 'font',
                config: {
                  disableTextAlign: true,
                  disableFontFamily: true,
                  disableFontWeight: true,
                  disableLetterSpacing: true,
                  //disableColor: true,
                  disableFontSize: true,
                  disableLineHeight: true
                }
              }
            ],
            target: `.icon:hover`
          },
          // {
          //   catelog: 'Hover',
          //   title: '行高',
          //   options: [
          //     {
          //       type: 'font',
          //       config: {
          //         disableTextAlign: true,
          //         disableFontFamily: true,
          //         disableFontWeight: true,
          //         disableLetterSpacing: true,
          //         disableFontSize: true,
          //         disableColor: true
          //         //disableLineHeight: true
          //       }
          //     }
          //   ],
          //   target: `.icon:hover`
          // },
          {
            catelog: 'Hover',
            options: [
              'border',
              'padding',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target: '[data-item-type="icon"]:hover'
          },
          // {
          //   catelog: 'Hover',
          //   options: ['font'],
          //   target: `.icon:hover`
          // }
        ]
      }
    ]
  }
};
