import { Data } from '../constants';
import { updateIO, removeIOAndSlot } from './common';
export default {
  '.ant-tabs-tab': ({}: EditorResult<Data>, cate1, cate2, cate3) => {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '名称',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const { index } = focusArea;
            return data.tabList[index]?.name;
          },
          set({ data, focusArea, input, output }: EditorResult<Data>, title: string) {
            const { index } = focusArea;
            const item = data.tabList[index];
            item.name = title;
            updateIO({ input, output, item });
          }
        }
      },
      {
        title: '事件',
        items: [
          {
            title: '显示',
            type: '_Event',
            options: ({ data, focusArea }: EditorResult<Data>) => {
              const key = data.tabList[focusArea.index]?.key;
              return {
                outputId: `${key}_into`
              };
            }
          },
          {
            title: '隐藏',
            type: '_Event',
            options: ({ data, focusArea }: EditorResult<Data>) => {
              const key = data.tabList[focusArea.index]?.key;
              return {
                outputId: `${key}_leave`
              };
            }
          }
        ]
      },
      {
        title: '操作',
        items: [
          {
            title: '向前移动',
            type: 'Button',
            value: {
              get({ focusArea }: EditorResult<Data>) {
                return focusArea.index;
              },
              set({ data, focusArea }: EditorResult<Data>) {
                const { index } = focusArea;
                const { tabList } = data;
                if (index === 0) return;
                [tabList[index - 1], tabList[index]] = [tabList[index], tabList[index - 1]];
              }
            }
          },
          {
            title: '向后移动',
            type: 'Button',
            value: {
              get({ focusArea }: EditorResult<Data>) {
                return focusArea.index;
              },
              set({ data, focusArea }: EditorResult<Data>) {
                const { index } = focusArea;
                const { tabList } = data;
                if (index === tabList.length - 1) return;
                [tabList[index], tabList[index + 1]] = [tabList[index + 1], tabList[index]];
              }
            }
          },
          {
            title: '删除',
            type: 'Button',
            value: {
              get({ focusArea }: EditorResult<Data>) {
                return focusArea.index;
              },
              set(props: EditorResult<Data>) {
                const { data, focusArea } = props;
                if (data.tabList.length > 1) {
                  const item = data.tabList[focusArea.index];
                  if (item) {
                    removeIOAndSlot(props, item);
                  }
                  data.tabList.splice(focusArea.index, 1);
                  data.defaultActiveKey = data.tabList[0].key;
                }
              }
            }
          }
        ]
      }
    ];

    cate2.title = '样式';
    cate2.items = [
      {
        title: '显示icon',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { index } = focusArea;
            return data.tabList[index]?.showIcon;
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;
            const { index } = focusArea;
            data.tabList[index].showIcon = value;
            data.tabList[index].icon = 'BellOutlined';
          }
        }
      },
      {
        title: '图标自定义',
        type: 'Switch',
        description: '可选择是否需要自定义图标',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          const { index } = focusArea;
          return data.tabList[index].showIcon;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const { index } = focusArea;
            return data.tabList[index].isChoose;
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            const { index } = focusArea;
            data.tabList[index].isChoose = value;
            if (!data.tabList[index].isChoose) {
              data.tabList[index].icon = 'BellOutlined';
            }
          }
        }
      },
      {
        title: '选择图标',
        type: 'icon',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          const { index } = focusArea;
          return data.tabList[index].isChoose;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const { index } = focusArea;
            return data.tabList[index].icon;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            const { index } = focusArea;
            data.tabList[index].icon = value;
          }
        }
      },
      {
        title: '文字提示',
        type: 'TextArea',
        options: {
          placeholder: 'tab标题的文字提示，不填写则不显示'
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { index } = focusArea;
            return data.tabList[index]?.tooltipText;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const { index } = focusArea;
            data.tabList[index].tooltipText = value;
          }
        }
      },
      {
        title: '支持关闭',
        type: 'Switch',
        ifVisible({ data }: EditorResult<Data>) {
          return data.type === 'editable-card';
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { index } = focusArea;
            return data.tabList[index]?.closable;
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;
            const { index } = focusArea;
            data.tabList[index].closable = value;
          }
        }
      }
    ];

    cate3.title = '高级';
    cate3.items = [
      {
        title: '支持动态通知显示',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { index } = focusArea;
            return !!data.tabList[index]?.dynamic;
          },
          set({ data, focusArea, input }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;
            const { index } = focusArea;
            const item = data.tabList[index];
            data.tabList[index].dynamic = value;
            if (value) {
              input.add(item.key, `${item.name}的通知数`, {
                type: 'string'
              });
            } else {
              input.remove(`${item.key}`);
            }
          }
        }
      },
      {
        title: '权限控制',
        items: [
          {
            title: '权限Key',
            description: '唯一标识的权限key',
            type: 'text',
            value: {
              get({ data, focusArea }) {
                if (!focusArea) return;
                const { index } = focusArea;
                const item = data.tabList[index];
                return item.permissionKey;
              },
              set({ data, focusArea }, value: string) {
                if (!focusArea) return;
                const { index } = focusArea;
                const item = data.tabList[index];
                item.permissionKey = value;
              }
            }
          }
        ]
      }
    ];
    return { title: '标签页' };
  }
};
