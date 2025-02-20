import { Data, AlignTypeEnum, OutputIds, Schemas, InputIds, ContextTypeEnum } from './constants';

export default {
  '@init'({ style }) {
    style.width = 'fit-content';
  },
  '@resize': {
    options: ['width']
  },
  ':root': {
    '@dblclick': {
      type: 'text',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.content;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.content = value;
        }
      }
    },
    style: [
      {
        title: '动态默认样式',
        description: '开启后，可以通过逻辑连线连接文本的输入项【设置默认样式】动态修改默认样式',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useDynamicStyle;
          },
          set({ data, input, output }: EditorResult<Data>, value: boolean) {
            const event = input.get(InputIds.SetStyle);
            if (value) {
              if (!event) {
                input.add(InputIds.SetStyle, '设置默认样式', Schemas.Style);
                output.add(`${InputIds.SetStyle}Done`, '默认样式', { type: 'follow' });
                input.get(InputIds.SetStyle).setRels([`${InputIds.SetStyle}Done`]);
              }
            } else {
              if (event) {
                input.remove(InputIds.SetStyle);
                output.remove(`${InputIds.SetStyle}Done`);
              }
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
          type: '_Event',
          description: '点击文本时触发，触发【点击】输出项事件',
          options: {
            outputId: OutputIds.Click
          }
        },
        {
          title: '点击输出内容',
          type: 'text',
          description: '设置【点击】输出项事件输出的文本内容',
          options: {
            placeholder: '默认输出文本内容'
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.outputContent;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.outputContent = value;
            }
          }
        }
      ];
      cate1.items = [
        {
          title: '标题',
          type: 'text',
          description:
            '设置文本的标题',
          options: {
            locale: true
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.title;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.title = value;
            }
          }
        },
        {
          title: '标题提示',
          type: 'textarea',
          description:
            '设置标题的提示语',
          options: {
            locale: true
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.tips;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.tips = value;
            }
          }
        },
        {
          title: '内容类型',
          type: 'Select',
          options() {
            return [
              { value: ContextTypeEnum.Text, label: '文本' },
              { value: ContextTypeEnum.Number, label: '数字' },
            ];
          },
          value: {
            get({ data }: EditorResult<Data>): ContextTypeEnum {
              return data.contentType;
            },
            set({ data }: EditorResult<Data>, value: ContextTypeEnum) {
              data.contentType = value;
              data.content = ''
            }
          }
        },
        {
          title: '内容',
          type: 'textarea',
          ifVisible({ data }: EditorResult<Data>) {
            return data.contentType === 'text';
          },
          description:
            '设置文本的默认内容，也可以通过逻辑连线连接文本的输入项【内容】动态修改文本的内容',
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
          title: '内容',
          type: 'InputNumber',
          options: [
            { min: -Infinity, max: Infinity, width: '100%' },
          ],
          ifVisible({ data }: EditorResult<Data>) {
            return data.contentType === 'number';
          },
          description:
            '设置文本的默认内容，也可以通过逻辑连线连接文本的输入项【内容】动态修改文本的内容',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.content;
            },
            set({ data }: EditorResult<Data>, value: [number]) {
              data.content = value[0];
            }
          }
        },
        {
          title: '文本溢出/省略',
          type: 'switch',
          description: '设置文本溢出换行时是否省略溢出部分',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.isEllipsis;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.isEllipsis = value;
              if (value === true && !data.ellipsis) {
                data.ellipsis = { rows: 1 };
              }
            }
          }
        },
        {
          title: '最大显示行数',
          type: 'InputNumber',
          description: '设置文本的最大显示行数，开启【文本溢出/省略】配置项后才能配置',
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
