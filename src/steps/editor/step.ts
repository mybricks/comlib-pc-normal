import { Data, INTO, LEAVE, CLICK } from '../constants';
import { removeEventIO } from './util';
import { setSlotLayout } from '../../utils/editorTools'

export default {
  '[data-item-type="step"]': {
    title: '步骤',
    items({ data, focusArea, slot }: EditorResult<Data>, cate1) {
      if (!focusArea) return;

      const { index } = focusArea;
      const stepItem = data.stepAry[index];

      cate1.title = '常规';
      cate1.items = [
        {
          title: '插槽布局',
          type: 'layout',
          description: '配置插槽内部的布局类型',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.hideSlots;
          },
          value: {
            get({ data, focusArea }: EditorResult<Data>) {
              return stepItem?.slotLayuotStyle;
            },
            set({ slots, data }: EditorResult<Data>, val: any) {
              if (!stepItem.slotLayuotStyle) {
                stepItem.slotLayuotStyle = {};
              }

              stepItem.slotLayuotStyle = { ...val }

              const slotInstance = slots.get(stepItem.id);
              setSlotLayout(slotInstance, val);
            }
          }
        },
        {
          title: '标题',
          type: 'Text',
          options: {
            locale: true
          },
          description: '设置当前步骤的标题',
          value: {
            get({ }: EditorResult<Data>) {
              console.log('标题', stepItem.title)
              return stepItem.title;
            },
            set({ }: EditorResult<Data>, values: string) {
              stepItem.title = values;
            }
          }
        },
        {
          title: '子标题',
          type: 'Text',
          options: {
            locale: true
          },
          description: '设置当前步骤的子标题',
          value: {
            get({ }: EditorResult<Data>) {
              return stepItem.subTitle ?? '';
            },
            set({ }: EditorResult<Data>, values: string) {
              stepItem.subTitle = values;
            }
          }
        },
        {
          title: '自定义描述',
          type: 'switch',
          description: '是否使用自定义描述，开启后描述将变成插槽，可自定义内容',
          ifVisible({ data }: EditorResult<Data>) {
            return !!data.steps.showDesc;
          },
          value: {
            get({ }: EditorResult<Data>) {
              return !!stepItem.useCustomDesc;
            },
            set({ slots }: EditorResult<Data>, val: boolean) {
              stepItem.useCustomDesc = val;
              const slotId = `${stepItem.id}_customDescSlot`;
              if (val) {
                slots.add({
                  id: slotId,
                  title: '自定义描述'
                });
              } else {
                slots.remove(slotId);
              }
            }
          }
        },
        {
          title: '描述',
          type: 'textArea',
          options: {
            locale: true
          },
          ifVisible({ data }: EditorResult<Data>) {
            return !!data.steps.showDesc && !stepItem.useCustomDesc;
          },
          description: '设置当前步骤的描述信息',
          value: {
            get({ }: EditorResult<Data>) {
              return stepItem.description;
            },
            set({ }: EditorResult<Data>, values: string) {
              stepItem.description = values;
            }
          }
        },
        {
          title: '图标',
          type: 'switch',
          description: '是否使用图标，开启后可以配置步骤的图标',
          value: {
            get({ data }: EditorResult<Data>) {
              return !!stepItem.useIcon;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              stepItem.useIcon = val;
            }
          }
        },
        {
          title: '自定义图标',
          type: 'switch',
          description: '开启后可以上传自己的图片资源替代当前步骤的图标',
          ifVisible({ data }: EditorResult<Data>) {
            return !!stepItem.useIcon;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return !!stepItem.customIcon;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              stepItem.customIcon = val;
            }
          }
        },
        {
          title: '图标库',
          type: 'icon',
          description: '可以选择内置的图标库资源',
          ifVisible({ data }: EditorResult<Data>) {
            return !!stepItem.useIcon && !stepItem.customIcon;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return stepItem.icon;
            },
            set({ data }: EditorResult<Data>, val: string) {
              stepItem.icon = val;
            }
          }
        },
        {
          title: '上传',
          type: 'imageSelector',
          description: '开启后可以自定义上传资源替换当前步骤的图标',
          ifVisible({ data }: EditorResult<Data>) {
            return !!stepItem.useIcon && stepItem.customIcon;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return stepItem.iconSrc;
            },
            set({ data }: EditorResult<Data>, val: string) {
              stepItem.iconSrc = val;
            }
          }
        },
        {
          title: '尺寸',
          type: 'InputNumber',
          description: '步骤图标的大小',
          options: [
            { title: '高度', min: 0, width: 100 },
            { title: '宽度', min: 0, width: 100 }
          ],
          ifVisible({ data }: EditorResult<Data>) {
            return stepItem.useIcon;
          },
          value: {
            get({ data, focusArea }: EditorResult<Data>) {
              return stepItem.iconSize;
            },
            set({ data, focusArea }: EditorResult<Data>, value: [number, number]) {
              stepItem.iconSize = value;
            }
          }
        },
        {
          title: '事件',
          ifVisible({ data }: EditorResult<Data>) {
            return !!data.steps.canClick;
          },
          items: [
            {
              title: '点击',
              type: '_Event',
              description: '步骤图标的点击事件',
              options: ({ data }) => {
                const id = data.stepAry[data.current]?.id;
                return {
                  outputId: `${id}${CLICK}`
                };
              }
            }
            // {
            //   title: '显示',
            //   type: '_Event',
            //   options: ({ data, focusArea }: EditorResult<Data>) => {
            //     const id = data.stepAry[focusArea.index]?.id
            //     return {
            //       outputId: `${id}${INTO}`
            //     };
            //   }
            // },
            // {
            //   title: '隐藏',
            //   type: '_Event',
            //   options: ({ data, focusArea }: EditorResult<Data>) => {
            //     const id = data.stepAry[focusArea.index]?.id
            //     return {
            //       outputId: `${id}${LEAVE}`
            //     };
            //   }
            // }
          ]
        },
        {
          title: '删除',
          type: 'Button',
          description: '点击删除这一步骤，并同时去除对应的输入输出项',
          value: {
            set({ data, focusArea, input, output, slots }: EditorResult<Data>) {
              if (data.stepAry.length === 1) return;
              output.remove(stepItem.id);
              slots.remove(stepItem.id);

              if (focusArea.index === data.stepAry.length - 1) {
                //删掉最后一步
                const preStep = data.stepAry[focusArea.index - 1];
                //兼容最后一步没有下一步事件i/o，删掉最后一步时，同时删除上一步的“下一步”event
                const { id, title, schema } = output.get(preStep.id);
                output.remove(preStep.id);
                output.add(id, title, schema);
              }

              //移除i/o事件
              removeEventIO(output, stepItem.id);

              data.stepAry.splice(focusArea.index, 1);
              if (data.stepAry.length > 0) {
                if (focusArea.index == 0) {
                  data.current = 0;
                } else {
                  data.current = data.current - 1;
                }
              } else {
                data.current = -1;
              }

              data.stepAry.forEach((item, idx) => {
                slots.get(item.id).setTitle(`步骤${idx + 1}`);
                output.setTitle(item.id, `步骤${idx + 1}下一步`);
              });

              input.setTitle('jumpTo', `跳转（0～${data.stepAry.length - 1}）`);
            }
          }
        }
      ];
    }
  },
  '.ant-steps-item-title': {
    '@dblclick': {
      type: 'text',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          const { index } = focusArea;
          const stepItem = data.stepAry[index];

          return stepItem.title;
        },
        set({ data, focusArea }: EditorResult<Data>, values: string) {
          const { index } = focusArea;
          const stepItem = data.stepAry[index];
          stepItem.title = values;
        }
      }
    }
  },
  '.ant-steps-item-subtitle': {
    '@dblclick': {
      type: 'text',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          const { index } = focusArea;
          const stepItem = data.stepAry[index];

          return stepItem.subTitle;
        },
        set({ data, focusArea }: EditorResult<Data>, values: string) {
          const { index } = focusArea;
          const stepItem = data.stepAry[index];
          stepItem.subTitle = values;
        }
      }
    }
  },
  '.ant-steps-item-description': {
    '@dblclick': {
      type: 'text',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          const { index } = focusArea;
          const stepItem = data.stepAry[index];

          return stepItem.description;
        },
        set({ data, focusArea }: EditorResult<Data>, values: string) {
          const { index } = focusArea;
          const stepItem = data.stepAry[index];
          stepItem.description = values;
        }
      }
    }
  }
};
