import { Data } from '../constants';
import { updateIO, getFocusTab, removeIOAndSlot } from './common';

export default {
  '.ant-tabs-tab': {
    title: '标签',
    items: (props: EditorResult<Data>, cate1, cate2, cate3) => {
      if (!props.focusArea) return;
      const item = getFocusTab(props);
      cate1.title = '常规';
      cate1.items = [
        {
          title: '名称',
          type: 'Text',
          description: '配置标签默认名称',
          options: {
            locale: true
          },
          value: {
            get({ }: EditorResult<Data>) {
              return item?.name;
            },
            set({ input, output, slots, env }: EditorResult<Data>, title: string) {
              item.name = title;
              updateIO({ input, output, item, slots, env });
            }
          }
        },
        {
          title: 'Key',
          type: 'Text',
          description: '配置标签Key',
          options: {
            locale: true
          },
          value: {
            get({ }: EditorResult<Data>) {
              return item?.key;
            },
            set({ input, output, slots, env }: EditorResult<Data>, key: string) {
              item.key = key;
              updateIO({ input, output, item, slots, env });
            }
          }
        },
        {
          title: '显示icon',
          type: 'Switch',
          description: '是否显示图标（icon)',
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
          description: '选择配置图标',
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
          description: '配置标签页的文字提示',
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
          title: '文字提示样式',
          type: 'TextArea',
          ifVisible({ }: EditorResult<Data>) {
            return !!item.tooltipText;
          },
          description: '配置标签页的文字提示样式',
          options: {
            placeholder: 'tab标题的文字提示样式，请一定保证为JSON格式，否则不生效，例如：{"color":"#fff"}',
            locale: true
          },
          value: {
            get({ }: EditorResult<Data>) {
              return item?.tooltipTextStyle;
            },
            set({ }: EditorResult<Data>, value: string) {
              item.tooltipTextStyle = value;
            }
          }
        },
        {
          title: '提示文案箭头样式',
          description: '设置提示文案的CSS样式，请保证内容为string，否则不会生效（默认样式已打印在控制台）',
          type: 'Textarea',
          options: {
            locale: true
          },
          ifVisible({ }: EditorResult<Data>) {
            return !!item.tooltipText;
          },
          value: {
            get({ }: EditorResult<Data>) {
              return item?.tipArrowStyle;
            },
            set({ }: EditorResult<Data>, value: string) {
              item.tipArrowStyle = value;
            }
          }
        },
        {
          title: '支持关闭',
          type: 'Switch',
          description: '开启后，支持关闭标签页',
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
              description: '标签页的显示事件',
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
              description: '标签页的隐藏事件',
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
              description: '向前移动该标签页',
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
              description: '向后移动该标签页',
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
              description: '删除该标签页',
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

      cate2.title = '高级';
      cate2.items = [
        {
          title: '支持动态通知显示',
          type: 'Switch',
          description: '开启后，可以通过逻辑连线连接标签的输入项【设置标签页的通知数】动态显示通知',
          value: {
            get({ }: EditorResult<Data>) {
              return !!item?.dynamic;
            },
            set({ input, output, env }: EditorResult<Data>, value: boolean) {
              item.dynamic = value;
              if (value) {
                input.add(item.key, `${env.i18n(item.name)}的通知数`, {
                  type: 'string'
                });
                output.add(`${item.key}Done`, '通知数', {
                  type: 'string'
                });
                input.get(item.key).setRels([`${item.key}Done`]);
              } else {
                input.remove(`${item.key}`);
                output.remove(`${item.key}Done`);
              }
            }
          }
        },
        {
          title: '通知类型',
          type: 'select',
          description: '配置通知的展示类型，包括文本和状态点类型',
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
          description: '配置标签页的尺寸，默认是常规类型',
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
              if (!item?.offset) return [0, 0];
              return [item.offset[0], item.offset[1]];
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
            { label: '警告', value: 'warning' }
          ],
          description: '设置状态点的类型, 有成功、进行中、默认、错误、警告等类型',
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
                set({ }: EditorResult<Data>, value: ConfigPermission) {
                  item.permission = value;
                  value.register?.();
                }
              }
            }
          ]
        }
      ];
    },
    '@dblclick': {
      type: 'text',
      value: {
        get(props: EditorResult<Data>) {
          const item = getFocusTab(props);
          return item?.name;
        },
        set(props: EditorResult<Data>, title: string) {
          const item = getFocusTab(props);
          item.name = title;
          const { input, output, slots, env } = props;
          updateIO({ input, output, item, slots, env });
        }
      }
    }
  }
};
