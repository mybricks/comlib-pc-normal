import { Data, Tag } from '../types';
import { getTagItem, arrayMove } from './util';
export default {
  '.ant-space-item': ({ data, focusArea, slot }: EditorResult<Data>, cate1, cate2) => {
    if (!focusArea) return;
    const tag: Tag = getTagItem(data, focusArea);
    cate1.title = '标签项';
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
              get({ focusArea }: EditorResult<Data>) {
                return focusArea.index;
              },
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
              get({ focusArea }: EditorResult<Data>) {
                return focusArea.index;
              },
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
              get({ focusArea }: EditorResult<Data>) {
                return focusArea.index;
              },
              set({ data, focusArea }: EditorResult<Data>, val: string) {
                const { index } = focusArea;
                data.tags.splice(index, 1);
              }
            }
          }
        ]
      }
    ];
    cate2.title = '高级';
    cate2.items = [
      {
        title: '可选择',
        type: 'switch',
        description: '标签选择功能与关闭功能互斥',
        ifVisible({}: EditorResult<Data>) {
          return !tag.closable;
        },
        value: {
          get({}: EditorResult<Data>) {
            return !!tag.checkable;
          },
          set({}: EditorResult<Data>, val: boolean) {
            tag.checkable = val;
          }
        }
      },
      {
        title: '可关闭',
        type: 'switch',
        description: '标签关闭功能与选择功能互斥',
        ifVisible({}: EditorResult<Data>) {
          return !tag.checkable;
        },
        value: {
          get({}: EditorResult<Data>) {
            return !!tag.closable;
          },
          set({}: EditorResult<Data>, val: boolean) {
            tag.closable = val;
          }
        }
      }
    ];
    return {
      title: '标签'
    };
  }
};
