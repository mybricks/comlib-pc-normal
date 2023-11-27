import { Data, Tag, Preset } from '../types';
import {
  getTagItem,
  arrayMove,
  getTagIndex,
  createStyleForDefault,
  createStyleForChecked,
  createStyleForCheckableHover
} from './util';

export default {
  '[data-item-tag="tag"]': {
    title: '标签',
    items: ({ data, focusArea }: EditorResult<Data>, cate1) => {
      if (!focusArea) return;
      const [tag, index]: [Tag, number] = getTagItem(data, focusArea);
      cate1.title = '基础配置';
      cate1.items = [
        {
          title: '属性',
          items: [
            {
              title: '标签内容',
              type: 'text',
              options: {
                locale: true,
              },
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
                get({}: EditorResult<Data>) {
                  return tag.color;
                },
                set({}: EditorResult<Data>, val: Preset) {
                  tag.color = val;
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
          title: '操作',
          items: [
            {
              title: '前移',
              type: 'button',
              ifVisible({ data, focusArea }: EditorResult<Data>) {
                const [tag, index]: [Tag, number] = getTagItem(data, focusArea);
                return index > 0 && tag.key != data.tags[0].key;
              },
              value: {
                set({ data, focusArea }: EditorResult<Data>) {
                  const index = getTagIndex({ focusArea });
                  if (index === 0) return;
                  data.tags = arrayMove<Tag>(data.tags, index, index - 1);
                }
              }
            },
            {
              title: '后移',
              type: 'button',
              ifVisible({ data, focusArea }: EditorResult<Data>) {
                const index = getTagIndex({ focusArea });
                return index < data.tags.length - 1;
              },
              value: {
                set({ data, focusArea }: EditorResult<Data>) {
                  const index = getTagIndex({ focusArea });
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
                  const index = getTagIndex({ focusArea });
                  data.tags.splice(index, 1);
                }
              }
            }
          ]
        }
      ];
    },
    style: [
      {
        items: [
          {
            catelog: '默认',
            ...createStyleForDefault({
              target({ focusArea }: EditorResult<Data>) {
                const { index } = focusArea.dataset;
                return `div[data-root] span[data-index="${index}"]`;
              }
            })
          },
          {
            catelog: 'Hover',
            ...createStyleForCheckableHover({
              target({ focusArea }: EditorResult<Data>) {
                const { index } = focusArea.dataset;
                return `div[data-root] span[data-index="${index}"].ant-tag-checkable:not(.ant-tag-checkable-checked):hover`;
              }
            })
          },
          {
            catelog: '激活',
            ...createStyleForChecked({
              target({ focusArea }: EditorResult<Data>) {
                const { index } = focusArea.dataset;
                return `div[data-root] span[data-index="${index}"].ant-tag-checkable-checked`;
              }
            })
          }
        ]
      }
    ]
  }
};
