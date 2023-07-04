import { Data, OutputIds, SizeOptions, SlotIds, Item } from './constants';
import { Editor, EditorType } from '../utils/editor';
import { uuid } from '../utils';

let ItemsLength, addItem, delItem;

const initItems = (data: Data, slot) => {
  ItemsLength = (data.items || []).length;
  addItem = (item) => {
    data.items.push(item);
    slot.add(item.key, item.name);
  };
  delItem = (index: number) => {
    let indexArr = data.items.map((item) => {
      return item['_id'];
    });
    let indexNum = indexArr.indexOf(index);
    slot.remove(data.items[indexNum].key, data.items[indexNum].name);
  };
};

export default {
  '@init'({ style }: EditorResult<Data>) {
    style.height = 'auto';
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': {
    style: [
      {
        title: '标题',
        options: ['font'],
        target:
          '> .card > .ant-card > .ant-card-head > .ant-card-head-wrapper > .ant-card-head-title'
      },
      {
        title: '卡片边框',
        options: ['border'],
        target: '> .card > .ant-card'
      },
      Editor<Data>('鼠标移过时可浮起', EditorType.Switch, 'hoverable'),
      Editor<Data>('尺寸', EditorType.Select, 'size', {
        options: SizeOptions
      }),
      {
        title: '内边距',
        type: 'text',
        description: '卡片内容的内边距',
        value: {
          get({ data }: EditorResult<Data>) {
            return String(data.padding) || '24px';
          },
          set({ data }: EditorResult<Data>, value: string) {
            if (/^\d+$/.test(value)) {
              data.padding = `${value}px`;
            } else {
              data.padding = value;
            }
          }
        }
      }
    ],
    items: ({}: EditorResult<Data>, cate1, cate2) => {
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
              description:
                '点击按钮向外输出的值, 输出值无数据即为空对象，举例: {"name": "poweros"}',
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
      const actionItems = [
        {
          title: '卡片操作区',
          items: [
            {
              title: '操作组',
              type: 'switch',
              description: '卡片操作组，位置在卡片底部',
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.isAction;
                },
                set({ data, slot }: EditorResult<Data>, value: boolean) {
                  data.isAction = value;
                  if (data.isAction === true && data.items.length >= 1) {
                    data.items.map((item) => {
                      slot.add(item.key, item.name);
                    });
                  } else if (data.isAction !== true) {
                    data.items.map((item) => {
                      slot.remove(item.key, item.name);
                    });
                  }
                }
              }
            },
            {
              title: '操作项配置',
              type: 'array',
              ifVisible({ data }: EditorResult<Data>) {
                return data.isAction;
              },
              options: {
                editable: false,
                getTitle: ({ name }) => {
                  return name;
                },
                onRemove: (index: number) => {
                  delItem(index);
                },
                onAdd: () => {
                  const defaultItem = {
                    name: `操作项${ItemsLength + 1}`,
                    key: uuid()
                  };
                  addItem(defaultItem);
                  return defaultItem;
                }
              },
              value: {
                get({ data, slot }: EditorResult<Data>) {
                  initItems(data, slot);
                  return data.items;
                },
                set({ data, slot }: EditorResult<Data>, value) {
                  data.items = value;
                }
              }
            }
          ]
        }
      ];
      cate1.title = '常规';
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
        ...eventItems,
        ...actionItems
      ];
    }
  }
};
