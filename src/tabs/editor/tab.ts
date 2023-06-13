import { Data } from '../constants';
import { updateIO, getFocusTab, removeIOAndSlot } from './common';
export default {
  '.ant-tabs-tab': {
    title: "标签",
    items: (props: EditorResult<Data>, cate1, cate2, cate3) => {
      if (!props.focusArea) return;
      const item = getFocusTab(props);
      cate1.title = '常规';
      cate1.items = [
        {
          title: '名称',
          type: 'Text',
          value: {
            get({}: EditorResult<Data>) {
              return item?.name;
            },
            set({ input, output }: EditorResult<Data>, title: string) {
              item.name = title;
              updateIO({ input, output, item });
            }
          }
        },
        {
          title: '显示icon',
          type: 'Switch',
          value: {
            get({}: EditorResult<Data>) {
              return item?.showIcon;
            },
            set({}: EditorResult<Data>, value: boolean) {
              item.showIcon = value;
              if(!item.icon){
                item.icon = 'BellOutlined';
              }
            }
          }
        },
        {
          title: '选择图标',
          type: 'icon',
          ifVisible({}: EditorResult<Data>) {
            return !!item.showIcon;
          },
          value: {
            get({}: EditorResult<Data>) {
              return item?.icon;
            },
            set({}: EditorResult<Data>, value: string) {
              item.icon = value;
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
            get({}: EditorResult<Data>) {
              return item?.tooltipText;
            },
            set({}: EditorResult<Data>, value: string) {
              item.tooltipText = value;
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
            get({}: EditorResult<Data>) {
              return item?.closable;
            },
            set({}: EditorResult<Data>, value: boolean) {
              item.closable = value;
            }
          }
        },
        {
          title: '事件',
          items: [
            {
              title: '显示',
              type: '_Event',
              options: ({}: EditorResult<Data>) => {
                const id = item?.id;
                return {
                  outputId: `${id}_into`
                };
              }
            },
            {
              title: '隐藏',
              type: '_Event',
              options: ({}: EditorResult<Data>) => {
                const id = item?.id;
                return {
                  outputId: `${id}_leave`
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
        },
      ];
  
      cate2.title = '高级';
      cate2.items = [
        {
          title: '支持动态通知显示',
          type: 'Switch',
          value: {
            get({}: EditorResult<Data>) {
              return !!item?.dynamic;
            },
            set({ input }: EditorResult<Data>, value: boolean) {
              item.dynamic = value;
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
                get({}: EditorResult<Data>) {
                  return item?.permissionKey;
                },
                set({}: EditorResult<Data>, value: string) {
                  item.permissionKey = value;
                }
              }
            }
          ]
        }
      ];
    }
  }
};
