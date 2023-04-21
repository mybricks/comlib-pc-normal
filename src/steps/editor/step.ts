import { Data, INTO, LEAVE, CLICK } from '../constants';
import { removeEventIO } from './util'
export default {
  '[data-item-type="step"]': {
    title: '步骤',
    items: [
      function ({ data, focusArea }: EditorResult<Data>) {
        data.current = focusArea.index;
      },
      {
        title: '标题',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const { index } = focusArea;
            return data.stepAry[index].title;
          },
          set({ data, focusArea, input }: EditorResult<Data>, values: string) {
            const { index } = focusArea;
            data.stepAry[index].title = values;
          }
        }
      },
      {
        title: '子标题',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const { index } = focusArea;
            return data.stepAry[index].subTitle;
          },
          set({ data, focusArea }: EditorResult<Data>, values: string) {
            const { index } = focusArea;
            data.stepAry[index].subTitle = values;
          }
        }
      },
      {
        title: '描述',
        type: 'Text',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const { index } = focusArea;
            return data.stepAry[index].description;
          },
          set({ data, focusArea }: EditorResult<Data>, values: string) {
            const { index } = focusArea;
            data.stepAry[index].description = values;
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
            const step = data.stepAry[focusArea.index];
            output.remove(step.id);
            slots.remove(step.id);

            if (focusArea.index === data.stepAry.length - 1) {
              //删掉最后一步
              const preStep = data.stepAry[focusArea.index - 1]
              //兼容最后一步没有下一步事件i/o，删掉最后一步时，同时删除上一步的“下一步”event
              const { id, title, schema } = output.get(preStep.id)
              console.log(id, title)
              output.remove(preStep.id);
              output.add(id, title, schema);
            }
            

            //移除i/o事件
            removeEventIO(output, step.id)

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
};
