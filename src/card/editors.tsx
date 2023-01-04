import { Data, OutputIds, SizeOptions, SlotIds } from './constants';
import { Editor, EditorType } from '../utils/editor';

export default {
  '@init'({ style }: EditorResult<Data>) {
    style.height = 'auto';
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': ({}, cate1, cate2, cate3) => {
    cate1.title = '常规';
    const eventItems = [
      Editor<Data>('点击', EditorType.Switch, 'useClick', {
        value: {
          set({ data, output }: EditorResult<Data>, value: boolean) {
            const hasEvent = output.get(OutputIds.Click);
            if (value) {
              !hasEvent && output.add(OutputIds.Click, '点击', { type: 'string' });
            } else {
              hasEvent && output.remove(OutputIds.Click);
            }
            data.useClick = value;
          }
        }
      }),
      {
        title: '触发数据',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.useClick;
        },
        items: [
          {
            title: '类型',
            type: 'Select',
            options: [
              { value: 'null', label: '无' },
              { value: 'number', label: '数字' },
              { value: 'string', label: '字符' },
              { value: 'object', label: '对象' },
              { value: 'boolean', label: '布尔' },
              { value: 'external', label: '外部传入' }
            ],
            value: {
              get({ data, output }: EditorResult<Data>) {
                const click = output.get(OutputIds.Click);
                if (data.dataType === 'number') {
                  click.setSchema({
                    type: 'number'
                  });
                }
                return data.dataType;
              },
              set(
                { data, output, input }: EditorResult<Data>,
                value: 'null' | 'number' | 'string' | 'object' | 'boolean' | 'external'
              ) {
                const click = output.get(OutputIds.Click);
                click.setSchema({
                  type: 'any'
                });
                if (value === 'number') {
                  click.setSchema({
                    type: 'number'
                  });
                  data.outputContent = 0;
                } else if (value === 'string') {
                  click.setSchema({
                    type: 'string'
                  });
                  data.outputContent = '';
                } else if (value === 'object') {
                  click.setSchema({
                    type: 'object',
                    properties: {}
                  });
                  data.outputContent = {};
                } else if (value === 'boolean') {
                  click.setSchema({
                    type: 'boolean'
                  });
                  data.outputContent = false;
                } else {
                  data.outputContent = null;
                }
                if (value === 'external') {
                  click.setSchema({
                    type: 'follow'
                  });
                  input.add('external', '设置输出数据', {
                    type: 'follow'
                  });
                } else {
                  if (input.get('external')) {
                    input.remove('external');
                  }
                }
                data.dataType = value;
              }
            }
          },
          {
            title: '输出值',
            type: 'Text',
            options: {
              type: 'number'
            },
            ifVisible({ data }: EditorResult<Data>) {
              return data.dataType === 'number';
            },
            description: '点击按钮向外输出的值，只可输入数字',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.outputContent;
              },
              set({ data }: EditorResult<Data>, value: string) {
                data.outputContent = Number(value) || 0;
              }
            }
          },
          {
            title: '输出值',
            type: 'Text',
            ifVisible({ data }: EditorResult<Data>) {
              return data.dataType === 'string';
            },
            description: '点击按钮向外输出的值,可以为任意字符',
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
            title: '输出值',
            type: 'Switch',
            ifVisible({ data }: EditorResult<Data>) {
              return data.dataType === 'boolean';
            },
            description: '点击按钮向外输出的值,打开输出true,关闭输出false',
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
            title: '输出值',
            type: 'TextArea',
            ifVisible({ data }: EditorResult<Data>) {
              return data.dataType === 'object';
            },
            description: '点击按钮向外输出的值, 输出值无数据即为空对象，举例: {"name": "poweros"}',
            value: {
              get({ data }: EditorResult<Data>) {
                try {
                  return JSON.stringify(data.outputContent) || '{}';
                } catch {
                  return '{}';
                }
              },
              set({ data }: EditorResult<Data>, value: string) {
                try {
                  const resValue = JSON.parse(value.replace(/\n/g, '').replace(/\r/g, ''));
                  data.outputContent = resValue;
                } catch {
                  message.warning('输出值格式有误, 参考格式{"name": "poweros"}');
                }
              }
            }
          }
        ]
      },
      Editor<Data>('点击卡片', EditorType.Event, null, {
        options: () => {
          return {
            outputId: OutputIds.Click
          };
        },
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.useClick;
        }
      })
    ];
    cate1.items = [
      Editor<Data>('标题内容', EditorType.Text, 'title'),
      {
        title: '开启卡片右上角操作',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useExtra;
          },
          set({ data, slot }: EditorResult<Data>, value: boolean) {
            data.useExtra = value;
            if (data.useExtra === true) {
              slot.add(SlotIds.Extra, '卡片操作容器');
            } else {
              slot.remove(SlotIds.Extra, '卡片操作容器');
            }
          }
        }
      },
      ...eventItems
    ];

    cate2.title = '样式';
    cate2.items = [
      Editor<Data>('卡片边框', EditorType.Switch, 'bordered'),
      Editor<Data>('鼠标移过时可浮起', EditorType.Switch, 'hoverable'),
      Editor<Data>('尺寸', EditorType.Select, 'size', {
        options: SizeOptions
      })
    ];

    return { title: '卡片' };
  }
};
