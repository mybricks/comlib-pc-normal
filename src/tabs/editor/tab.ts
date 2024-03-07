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
          options: {
            locale: true
          },
          value: {
            get({ }: EditorResult<Data>) {
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
            get({ }: EditorResult<Data>) {
              return item?.showIcon;
            },
            set({ }: EditorResult<Data>, value: boolean) {
              item.showIcon = value;
              item.icon = 'BellOutlined';
            }
          }
        },
        {
          title: '图标自定义',
          type: 'Switch',
          description: '可选择是否需要自定义图标',
          ifVisible({ }: EditorResult<Data>) {
            return item.showIcon;
          },
          value: {
            get({ }: EditorResult<Data>) {
              return item.isChoose;
            },
            set({ }: EditorResult<Data>, value: boolean) {
              item.isChoose = value;
              if (!item.isChoose) {
                item.icon = 'BellOutlined';
              }
            }
          }
        },
        {
          title: '选择图标',
          type: 'icon',
          ifVisible({ }: EditorResult<Data>) {
            return !!item.isChoose;
          },
          value: {
            get({ }: EditorResult<Data>) {
              return item?.icon;
            },
            set({ }: EditorResult<Data>, value: string) {
              item.icon = value;
            }
          }
        },
        {
          title: '文字提示',
          type: 'TextArea',
          options: {
            placeholder: 'tab标题的文字提示，不填写则不显示',
            locale: true
          },
          value: {
            get({ }: EditorResult<Data>) {
              return item?.tooltipText;
            },
            set({ }: EditorResult<Data>, value: string) {
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
            get({ }: EditorResult<Data>) {
              return item?.closable;
            },
            set({ }: EditorResult<Data>, value: boolean) {
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
              options: ({ }: EditorResult<Data>) => {
                const id = item?.id;
                return {
                  outputId: `${id}_into`
                };
              }
            },
            {
              title: '隐藏',
              type: '_Event',
              options: ({ }: EditorResult<Data>) => {
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
              title: '前移',
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
              title: '后移',
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
            get({ }: EditorResult<Data>) {
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
          title: '通知类型',
          type: 'select',
          options: [
            { label: '文本', value: 'text' },
            { label: '状态点', value: 'icon' }
          ],
          ifVisible({ }) {
            return !!item?.dynamic;
          },
          value: {
            get({ }) {
              return item.infoType || 'text';
            },
            set({ data }, value: 'text' | 'icon') {
              item.infoType = value;
            }
          }
        },
        {
          title: '尺寸',
          type: 'select',
          options: [
            { label: '常规', value: 'default' },
            { label: '迷你', value: 'small' }
          ],
          ifVisible({ }) {
            return !!item?.dynamic && item.infoType === 'icon';
          },
          value: {
            get({ }) {
              return item.size || 'default';
            },
            set({ data }, value: 'text' | 'icon') {
              item.size = value;
            }
          }
        },
        {
          title: '数值-0-状态点显示',
          description: '数值为0时, 状态点是否显示',
          type: 'switch',
          ifVisible({ }) {
            return !!item?.dynamic && item.infoType === 'icon';
          },
          value: {
            get({ }) {
              return item.showZero || false;
            },
            set({ }, value: number[]) {
              item.showZero = value;
            }
          }
        },
        {
          title: '位置偏移',
          type: 'inputNumber',
          options: [
            { title: '横向', min: -100, max: 100, width: 100 },
            { title: '纵向', min: -100, max: 100, width: 100 }
          ],
          description: '设置状态点的位置偏移, 横向和纵向',
          ifVisible({ }) {
            return !!item?.dynamic && item.infoType === 'icon';
          },
          value: {
            get({ }) {
              return [item.offset[0], item.offset[1]] || [0, 0];
            },
            set({ }, value: number[]) {
              item.offset = value;
            }
          }
        },
        {
          title: '状态',
          type: 'select',
          options: [
            { label: '成功', value: 'success' },
            { label: '进行中', value: 'processing' },
            { label: '默认', value: 'default' },
            { label: '错误', value: 'error' },
            { label: '警告', value: 'warning' },
          ],
          ifVisible({ }) {
            return !!item?.dynamic && item.infoType === 'icon';
          },
          value: {
            get({ }) {
              return item.status || 'error';
            },
            set({ data }, value: 'success' | 'processing' | 'default' | 'error' | 'warning') {
              item.status = value;
            }
          }
        },
        {
          title: '权限控制',
          items: [
            {
              title: '权限信息配置',
              description: '权限信息配置',
              type: '_permission',
              value: {
                get({ }: EditorResult<Data>) {
                  return item.permission;
                },
                set({ }: EditorResult<Data>, value: { id: string, register: () => void }) {
                  item.permission = { id: value.id };
                  value.register();
                }
              }
            }
          ]
        }
      ];
    }
  }
};
