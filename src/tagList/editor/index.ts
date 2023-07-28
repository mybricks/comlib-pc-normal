import { Data, TagSize, Preset } from '../types';
import TagEditor from './tag';
import AppendEditor from './append';
import { createTag, createStyle } from './util';

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
      cate[0].title = '配置';
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
      cate[1].title = '高级';
      cate[1].items = [
        {
          title: '动态数据',
          type: 'switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return !!data.dynamic;
            },
            set({ data, input }: EditorResult<Data>, val: boolean) {
              data.dynamic = val;
              if (val) {
                input.add('dynamicTags', '输入动态标签列表', {
                  type: 'array',
                  items: TagSchema
                });
              } else {
                input.remove('dynamicTags');
              }
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
          title: '标签改变时',
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
    style: createStyle({ target: 'div[data-root="root"] span[data-item-tag="tag"]' })
  },
  ...TagEditor,
  ...AppendEditor
};
