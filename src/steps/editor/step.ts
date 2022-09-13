import { Data } from '../constants';
import { updateStepOutput } from './index'
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
            // const { id, useDynamicDisplay, title } = data.stepAry[index];
            // if (useDynamicDisplay) {
            //   input.setTitle(`show${id}`, `显示${title}`, {
            //     type: 'any'
            //   });
            //   input.setTitle(`hide${id}`, `隐藏${title}`, {
            //     type: 'any'
            //   });
            // }
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
      // {
      //   title: '动态显示隐藏',
      //   type: 'Switch',
      //   value: {
      //     get({ data, focusArea }: EditorResult<Data>) {
      //       const { index } = focusArea;
      //       return data.stepAry[index].useDynamicDisplay;
      //     },
      //     set({ data, focusArea, input }: EditorResult<Data>, value: boolean) {
      //       const { index } = focusArea;
      //       const { id, title } = data.stepAry[index];
      //       if (value) {
      //         input.add(`show${id}`, `显示${title}`, {
      //           type: 'follow'
      //         });
      //         input.add(`hide${id}`, `隐藏${title}`, {
      //           type: 'follow'
      //         });
      //       } else {
      //         input.remove(`show${id}`);
      //         input.remove(`hide${id}`);
      //       }
      //       data.stepAry[index].useDynamicDisplay = value;
      //     }
      //   }
      // },
      {
        title: '删除',
        type: 'Button',
        value: {
          set({ data, focusArea, output, slots }: EditorResult<Data>) {
            if (data.stepAry.length === 1) return;
            const step = data.stepAry[focusArea.index];
            output.remove(step.id);
            slots.remove(step.id);

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
              slots.get(item.id).setTitle(`内容区【${idx + 1}】`)
              output.setTitle(
                item.id,
                idx === data.stepAry.length - 1 ? '提交' : `第${idx + 1}步 -> 下一步`
              );
            });
            updateStepOutput(data, slots)
          }
        }
      }
    ]
  }
};
