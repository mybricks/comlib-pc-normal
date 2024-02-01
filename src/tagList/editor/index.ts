import { Data, TagSize, Preset } from '../types';
import TagEditor from './tag';
import AppendEditor from './append';
import {
  createTag,
  createStyleForDefault,
  createStyleForChecked,
  createStyleForCheckableHover
} from './util';

const TagSchema = {
  type: 'object',
  properties: {
    icon: {
      title: '图标',
      type: 'string'
    },
    content: {
      title: '标签内容',
      type: 'string'
    },
    color: {
      title: '背景颜色',
      type: 'string'
    },
    closable: {
      title: '是否可关闭',
      type: 'boolean'
    }
  }
};
export default {
  ':root': {
    items({ data }: EditorResult<Data>, ...cate) {
      cate[0].title = '常规';
      cate[0].items = [
        {
          title: '添加标签',
          type: 'button',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.dynamic;
          },
          value: {
            set({ data }: EditorResult<Data>, val: string) {
              const tag = createTag();
              data.tags.push(tag);
            }
          }
        },
        {
          title: '基础',
          items: [
            {
              title: '方向',
              type: 'select',
              options: {
                options: [
                  {
                    label: '水平',
                    value: 'horizontal'
                  },
                  {
                    label: '垂直',
                    value: 'vertical'
                  }
                ],
                defaultValue: 'horizontal'
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.direction || 'horizontal';
                },
                set({ data }: EditorResult<Data>, val: 'horizontal' | 'vertical') {
                  data.direction = val;
                }
              }
            },
            {
              title: '类型',
              type: 'select',
              options: {
                options: [
                  { label: '默认', value: 'default' },
                  { label: '成功', value: 'success' },
                  { label: '进行中', value: 'processing' },
                  { label: '警告', value: 'warning' },
                  { label: '失败', value: 'error' }
                ]
              },
              value: {
                get({ data }: EditorResult<Data>) {
                  return data.type;
                },
                set({ data }: EditorResult<Data>, val: Preset) {
                  data.type = val;
                  data.tags.forEach((tag) => {
                    tag.color = val;
                  });
                }
              }
            },
            {
              title: '标签间距',
              type: 'inputNumber',
              options: [{ min: 0, max: 50, width: 100 }],
              value: {
                get({ data }: EditorResult<Data>) {
                  return [data.size || 8];
                },
                set({ data }: EditorResult<Data>, val: number[]) {
                  data.size = val[0];
                }
              }
            }
          ]
        }
      ];
      cate[1].title = '交互';
      cate[1].items = [
        {
          title: '动态数据',
          type: 'switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return !!data.dynamic;
            },
            set({ data, input, output }: EditorResult<Data>, val: boolean) {
              data.dynamic = val;
              if (val) {
                output.add('dynamicComplete', '完成', { type: 'any' });
                input.add('dynamicTags', '输入动态标签列表', {
                  type: 'array',
                  items: TagSchema
                });
                input.get('dynamicTags').setRels(['dynamicComplete']);
              } else {
                input.remove('dynamicTags');
                output.remove('dynamicComplete');
              }
            }
          }
        },
        {
          title: '可关闭',
          type: 'switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return !!data.closeAble;
            },
            set({ data, output }: EditorResult<Data>, val: boolean) {
              data.closeAble = val;
            }
          }
        },
        {
          title: '可新增',
          type: 'switch',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.checkable;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return !!data.appendAble;
            },
            set({ data, output }: EditorResult<Data>, val: boolean) {
              data.appendAble = val;
              if (val) {
                output.add('onChange', '标签改变时', {
                  type: 'object',
                  properties: {
                    changed: TagSchema,
                    allTag: {
                      type: 'array',
                      items: TagSchema
                    }
                  }
                });
              } else if (output.get('onChange')) {
                output.remove('onChange');
              }
            }
          }
        },
        {
          title: '显示新增按钮',
          type: 'switch',
          ifVisible({ data }: EditorResult<Data>) {
            return !!data.appendAble;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return !!data.useAppendBtn;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.useAppendBtn = val;
            }
          }
        },
        {
          title: '标签删除/改变时',
          description: '标签关闭/勾选/删除时触发',
          type: '_Event',
          ifVisible({}: EditorResult<Data>) {
            return data.appendAble;
          },
          options: () => {
            return {
              outputId: 'onChange'
            };
          }
        },
        {
          title: '可选择',
          type: 'switch',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.appendAble;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return !!data.checkable;
            },
            set({ data, output }: EditorResult<Data>, val: boolean) {
              data.checkable = val;
              if (val) {
                output.add('onCheck', '选中状态改变时', {
                  type: 'object',
                  properties: {
                    changed: TagSchema,
                    allTag: {
                      type: 'array',
                      items: TagSchema
                    }
                  }
                });
              } else if (output.get('onCheck')) {
                output.remove('onCheck');
              }
            }
          }
        },
        {
          title: '选中状态改变时',
          type: '_Event',
          ifVisible({}: EditorResult<Data>) {
            return data.checkable;
          },
          options: () => {
            return {
              outputId: 'onCheck'
            };
          }
        }
      ];
    },
    style: [
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
              data.ellipsis = {
                maxWidth: 120
              };
            }
          }
        }
      },
      {
        title: '最大显示宽度',
        type: 'text',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.isEllipsis;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data?.ellipsis?.maxWidth || 120;
          },
          set({ data }: EditorResult<Data>, value) {
            data.ellipsis = {
              maxWidth: value
            };
          }
        }
      },
      {
        items: [
          {
            catelog: '默认',
            ...createStyleForDefault({ target: 'div[data-root="root"] span[data-item-tag="tag"]' })
          },
          {
            catelog: 'Hover',
            ...createStyleForCheckableHover({
              target:
                'div[data-root="root"] span[data-item-tag="tag"].ant-tag-checkable:not(.ant-tag-checkable-checked):hover'
            })
          },
          {
            catelog: '激活',
            ...createStyleForChecked({
              target: 'div[data-root="root"] span[data-item-tag="tag"].ant-tag-checkable-checked',
              domTarget: '.ant-tag.ant-tag-checkable.ant-tag-checkable-checked'
            })
          }
        ]
      }
    ]
  },
  ...TagEditor,
  ...AppendEditor
};
