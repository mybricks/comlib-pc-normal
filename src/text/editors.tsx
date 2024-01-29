import { Data, AlignTypeEnum, OutputIds, Schemas, InputIds } from './constants';

export default {
  '@init'({ style }) {
    style.width = 'fit-content';
  },
  '@resize': {
    options: ['width']
  },
  ':root': {
    style: [
      {
        title: '动态默认样式',
        description: '开启后，可以通过逻辑连线修改默认样式',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useDynamicStyle;
          },
          set({ data, input }: EditorResult<Data>, value: boolean) {
            const event = input.get(InputIds.SetStyle);
            if (value) {
              !event && input.add(InputIds.SetStyle, '设置默认样式', Schemas.Style);
            } else {
              event && input.remove(InputIds.SetStyle);
            }
            data.useDynamicStyle = value;
          }
        }
      },
      {
        items: [
          {
            title: '默认',
            catelog: '默认',
            options: [
              'font',
              'border',
              'padding',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target: '[data-item-type="root"]'
          },
          {
            title: 'Hover',
            catelog: 'Hover',
            options: [
              'font',
              'border',
              'padding',
              { type: 'background', config: { disableBackgroundImage: true } }
            ],
            target: '[data-item-type="root"]:hover',
            domTarget: '[data-item-type="root"]'
          }
        ]
      }
    ],
    items: ({}: EditorResult<Data>, cate1) => {
      cate1.title = '常规';
      const eventItems = [
        {
          title: '点击事件',
          type: 'Switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.useClick;
            },
            set({ data, output }: EditorResult<Data>, value: boolean) {
              const event = output.get(OutputIds.Click);
              if (value) {
                !event && output.add(OutputIds.Click, '点击', Schemas.String);
              } else {
                event && output.remove(OutputIds.Click);
              }
              data.useClick = value;
            }
          }
        },
        {
          title: '点击输出内容',
          type: 'text',
          options: {
            placeholder: '默认输出文本内容'
          },
          ifVisible({ data }: EditorResult<Data>) {
            return data.useClick;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.outputContent;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.outputContent = value;
            }
          }
        },
        {
          title: '点击事件',
          type: '_Event',
          ifVisible({ data }: EditorResult<Data>) {
            return data.useClick;
          },
          options: () => {
            return {
              outputId: OutputIds.Click
            };
          }
        }
      ];
      cate1.items = [
        {
          title: '内容',
          type: 'textarea',
          options: {
            locale: true
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.content;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.content = value;
            }
          }
        },
        {
          title: '文本溢出/省略',
          type: 'switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.isEllipsis;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.isEllipsis = value;
              if (value === true && !data.ellipsis) {
                data.ellipsis = { rows: 3 };
              }
            }
          }
        },
        {
          title: '最大显示行数',
          type: 'InputNumber',
          options: [{ min: 1, width: '100%' }],
          ifVisible({ data }: EditorResult<Data>) {
            return data.isEllipsis;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return [data.ellipsis.rows];
            },
            set({ data }: EditorResult<Data>, value: number[]) {
              data.ellipsis = { rows: value[0] };
            }
          }
        },
        ...eventItems
      ];

      return {
        title: '文本'
      };
    }
  }
};
