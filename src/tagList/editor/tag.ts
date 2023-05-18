import { Data, Tag } from '../types';
import { getTagItem, arrayMove } from './util';

export default {
  '.ant-space-item': {
    title: "标签",
    items: ({ data, focusArea, slot }: EditorResult<Data>, cate1, cate2) => {
      if (!focusArea) return;
      if(data.appendAble && focusArea.index===data.tags.length) return;
      const tag: Tag = getTagItem(data, focusArea);
      cate1.title = '基础配置';
      cate1.items = [
        {
          title: '属性',
          items: [
            {
              title: '标签内容',
              type: 'text',
              value: {
                get({}: EditorResult<Data>) {
                  return tag.content;
                },
                set({}: EditorResult<Data>, val: string) {
                  tag.content = val;
                }
              }
            },
            {
              title: '图标',
              type: 'icon',
              value: {
                get({}: EditorResult<Data>) {
                  return tag.icon;
                },
                set({}: EditorResult<Data>, val: string) {
                  tag.icon = val;
                }
              }
            }
          ]
        },
        {
          title: '样式',
          items: [
            {
              title: '背景色',
              type: 'colorPicker',
              value: {
                get({}: EditorResult<Data>) {
                  return tag.color;
                },
                set({}: EditorResult<Data>, val: string) {
                  tag.color = val;
                }
              }
            },
            {
              title: '文本颜色',
              type: 'colorPicker',
              value: {
                get({}: EditorResult<Data>) {
                  return tag.textColor;
                },
                set({}: EditorResult<Data>, val: string) {
                  tag.textColor = val;
                }
              }
            },
            {
              title: '边框颜色',
              type: 'colorPicker',
              value: {
                get({}: EditorResult<Data>) {
                  return tag.borderColor;
                },
                set({}: EditorResult<Data>, val: string) {
                  tag.borderColor = val;
                }
              }
            }
          ]
        },
        {
          title: '操作',
          items: [
            {
              title: '向前移动',
              type: 'button',
              value: {
                set({ data, focusArea }: EditorResult<Data>) {
                  const { index } = focusArea;
                  if (index === 0) return;
                  data.tags = arrayMove<Tag>(data.tags, index, index - 1);
                }
              }
            },
            {
              title: '向后移动',
              type: 'button',
              value: {
                set({ data }: EditorResult<Data>) {
                  const { index } = focusArea;
                  if (index === data.tags.length - 1) return;
                  data.tags = arrayMove<Tag>(data.tags, index, index + 1);
                }
              }
            },
            {
              title: '删除',
              type: 'button',
              ifVisible({ data }: EditorResult<Data>) {
                return data.tags.length > 1;
              },
              value: {
                set({ data, focusArea }: EditorResult<Data>, val: string) {
                  const { index } = focusArea;
                  data.tags.splice(index, 1);
                }
              }
            }
          ]
        }
      ];
    }
  }
};
