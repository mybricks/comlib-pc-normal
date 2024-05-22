import { Data, OutputIds } from './constants';

export default {
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
            title: '默认',
            catelog: '默认',
            options: [
              'border',
              'padding',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target: `[data-item-type="icon"]`
          },
          {
            catelog: '默认',
            options: ['font'],
            target: `.icon`
          },
          {
            title: 'Hover',
            catelog: 'Hover',
            options: [
              'border',
              'padding',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target: '[data-item-type="icon"]:hover'
          },
          {
            catelog: 'Hover',
            options: ['font'],
            target: `.icon:hover`
          }
        ]
      }
    ]
  }
};
