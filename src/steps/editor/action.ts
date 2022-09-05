import { Data } from '../constants';
export default {
  '[data-item-type="stepActions"]': {
    title: '操作项',
    items: [
      {
        title: '显示副按钮',
        type: 'Switch',
        value: {
          set({ data }: EditorResult<Data>, value: boolean) {
            data.toolbar.showSecondBtn = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.showSecondBtn;
          }
        }
      },
      {
        title: '显示重置按钮',
        type: 'Switch',
        value: {
          set({ data }: EditorResult<Data>, value: boolean) {
            data.toolbar.reset = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.reset;
          }
        }
      },
      {
        title: '按钮组对齐',
        type: 'Select',
        options: [
          { label: '左对齐', value: 'flex-start' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'flex-end' }
        ],
        value: {
          set({ data }: EditorResult<Data>, value: string) {
            data.toolbar.actionAlign = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.actionAlign;
          }
        }
      }
    ]
  },
  '[data-item-type="next"]': {
    title: '主按钮',
    items: [
      {
        title: '文案',
        type: 'Text',
        value: {
          set({ data }: EditorResult<Data>, value: string) {
            if (!value) return;
            data.toolbar.primaryBtnText = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.primaryBtnText;
          }
        }
      },
      // {
      //   title: '是否显示加载',
      //   type: 'Switch',
      //   ifVisible({ data }: EditorResult<Data>) {
      //     return (
      //       typeof data.toolbar.showActions === undefined ||
      //       data.toolbar.showActions
      //     );
      //   },
      //   value: {
      //     get({ data }: EditorResult<Data>) {
      //       return data.useSubmitBtnLoading;
      //     },
      //     set({ data }: EditorResult<Data>, value: boolean) {
      //       data.useSubmitBtnLoading = value;
      //     }
      //   }
      // },
      {
        title: '事件',
        items: [
          {
            title: '点击',
            type: '_Event',
            options: ({ data }) => {
              const id = data.stepAry[data.current]?.id;
              return {
                outputId: `${id}`,
                slotId: `${id}`
              };
            }
          }
        ]
      }
    ]
  },
  '[data-item-type="pre"]': {
    title: '副按钮',
    items: [
      {
        title: '文案',
        type: 'Text',
        value: {
          set({ data }: EditorResult<Data>, value: string) {
            if (!value) return;
            data.toolbar.secondBtnText = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.secondBtnText;
          }
        }
      }
    ]
  },
  '[data-item-type="resetBtn"]': {
    title: '重置按钮',
    items: [
      {
        title: '文案',
        type: 'Text',
        value: {
          set({ data }: EditorResult<Data>, value: string) {
            if (!value) return;
            data.toolbar.resetText = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.resetText;
          }
        }
      }
    ]
  },
  '[data-item-type="submit"]': {
    title: '提交按钮',
    items: [
      {
        title: '文案',
        type: 'Text',
        value: {
          set({ data }: EditorResult<Data>, value: string) {
            if (!value) return;
            data.toolbar.submitText = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.toolbar.submitText;
          }
        }
      },
      {
        title: '事件',
        items: [
          {
            title: '点击',
            type: '_Event',
            options: () => {
              return {
                outputId: 'submit'
              };
            }
          }
        ]
      }
    ]
  }
};
