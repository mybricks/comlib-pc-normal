import { Data, INTO, LEAVE, CLICK } from '../constants';
import { removeEventIO } from './util'
export default {
  '[data-item-type="step"]': {
    title: '步骤',
    items({ data, focusArea, slot }: EditorResult<Data>, cate1) {
      if(!focusArea) return
      const { index } = focusArea;
      const stepItem = data.stepAry[index]
      cate1.title = '常规';
      cate1.items =  [
        {
          title: '标题',
          type: 'Text',
          options: {
            locale: true
          },
          value: {
            get({ }: EditorResult<Data>) {
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
          value: {
            get({ }: EditorResult<Data>) {
              return stepItem.subTitle??'';
            },
            set({ }: EditorResult<Data>, values: string) {
              stepItem.subTitle = values;
            }
          }
        },
        {
          title: '自定义描述',
          type: 'switch',
          ifVisible({ data }: EditorResult<Data>) {
            return !!data.steps.showDesc;
          },
          value: {
            get({ }: EditorResult<Data>) {
              return !!stepItem.useCustomDesc;
            },
            set({ slots }: EditorResult<Data>, val: boolean) {
              stepItem.useCustomDesc = val
              const slotId = `${stepItem.id}_customDescSlot` 
              if(val) {
                slots.add({
                  id: slotId,
                  title: '自定义描述'
                })
              }else{
                slots.remove(slotId)
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
          title: '',
          type: '',
          value: {
            get({ data }: EditorResult<Data>) {
              return data;
            },
            set({ data }: EditorResult<Data>, val: string) {}
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
              options: ({ data }) => {
                const id = data.stepAry[data.current]?.id;
                return {
                  outputId: `${id}${CLICK}`
                };
              }
            },
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
          value: {
            set({ data, focusArea, output, slots }: EditorResult<Data>) {
              if (data.stepAry.length === 1) return;
              output.remove(stepItem.id);
              slots.remove(stepItem.id);
  
              if (focusArea.index === data.stepAry.length - 1) {
                //删掉最后一步
                const preStep = data.stepAry[focusArea.index - 1]
                //兼容最后一步没有下一步事件i/o，删掉最后一步时，同时删除上一步的“下一步”event
                const { id, title, schema } = output.get(preStep.id)
                output.remove(preStep.id);
                output.add(id, title, schema);
              }
              
  
              //移除i/o事件
              removeEventIO(output, stepItem.id)
  
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
                slots.get(item.id).setTitle(`步骤${idx + 1}`)
                output.setTitle(
                  item.id,
                  `步骤${idx + 1}下一步`
                );
              });
            }
          }
        }
      ]
    }
  }
};
