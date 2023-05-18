import { Data, TagSize } from '../types';
import TagEditor, { TagSchema } from './tag';
import { createTag } from './util';
export default {
  ':root'({ data }: EditorResult<Data>, ...cate) {
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
          // {
          //   title: '标签大小',
          //   type: 'select',
          //   options: {
          //     options: [
          //       {
          //         label: '小号',
          //         value: 'small-tag'
          //       },
          //       {
          //         label: '中号',
          //         value: 'middle-tag'
          //       },
          //       {
          //         label: '大号',
          //         value: 'large-tag'
          //       }
          //     ]
          //   },
          //   value: {
          //     get({ data }: EditorResult<Data>) {
          //       return data.tagSize || 'small-tag';
          //     },
          //     set({ data }: EditorResult<Data>, val: TagSize) {
          //       data.tagSize = val;
          //     }
          //   }
          // },
          // {
          //   title: '对齐方式',
          //   type: 'select',
          //   options: {
          //     options: [
          //       {
          //         label: '左对齐',
          //         value: 'start'
          //       },
          //       {
          //         label: '右对齐',
          //         value: 'end'
          //       },
          //       {
          //         label: '中间对齐',
          //         value: 'center'
          //       },
          //       {
          //         label: '下边对齐',
          //         value: 'baseline'
          //       }
          //     ],
          //     defaultValue: 'start'
          //   },
          //   value: {
          //     get({ data }: EditorResult<Data>) {
          //       return data.align || 'start';
          //     },
          //     set({ data }: EditorResult<Data>, val: 'start' | 'end' | 'center' | 'baseline') {
          //       data.align = val;
          //     }
          //   }
          // }
        ]
      },
      {
        title: '样式',
        items: [
          {
            title: '背景色',
            type: 'colorPicker',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.tagStyle.color;
              },
              set({ data }: EditorResult<Data>, val: string) {
                data.tagStyle.color = val;
                data.tags.forEach((tag) => (tag.color = val));
              }
            }
          },
          {
            title: '文本颜色',
            type: 'colorPicker',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.tagStyle.textColor;
              },
              set({ data }: EditorResult<Data>, val: string) {
                data.tagStyle.textColor = val;
                data.tags.forEach((tag) => (tag.textColor = val));
              }
            }
          },
          {
            title: '边框颜色',
            type: 'colorPicker',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.tagStyle.borderColor;
              },
              set({ data }: EditorResult<Data>, val: string) {
                data.tagStyle.borderColor = val;
                data.tags.forEach((tag) => (tag.borderColor = val));
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
        title: '动态新增',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return !!data.canInsert;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.canInsert = val;
          }
        }
      }
    ];
  },
  ...TagEditor
};
