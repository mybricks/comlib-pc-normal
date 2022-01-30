import { Data } from '../runtime';
import { addCancelOutput, addResetOutput } from './index';

const formActions = {
  '[data-item-type=formActions]': {
    title: '操作项',
    items: [
      {
        title: '副按钮',
        type: 'Switch',
        value: {
          set({ data, output }: EditorResult<Data>, value: boolean) {
            data.showSecondBtn = value;
            if (value) {
              addCancelOutput(output);
            } else {
              output.remove('cancel');
            }
          },
          get({ data }: EditorResult<Data>) {
            return data.showSecondBtn;
          },
        },
      },
      {
        title: '重置按钮',
        type: 'Switch',
        value: {
          set({ data, output }: EditorResult<Data>, value: boolean) {
            data.resetBtn.isVisible = value;
            if (value) {
              addResetOutput(output);
            } else {
              output.remove('reset');
            }
          },
          get({ data }: EditorResult<Data>) {
            return data.resetBtn.isVisible;
          },
        },
      },
      {
        title: '对齐方式',
        type: 'Select',
        options: [
          { label: '左对齐', value: 'start' },
          { label: '右对齐', value: 'end' },
        ],
        value: {
          set({ data }: EditorResult<Data>, value: string) {
            data.actionAlign = value;
          },
          get({ data }: EditorResult<Data>) {
            return data.actionAlign;
          },
        },
      },
      {
        title: '预留标题宽度',
        type: 'Switch',
        description: '开启后会预留出表单项标题宽度，使整体布局保持对齐',
        ifVisible({ data }: EditorResult<Data>) {
          return data.layout === 'horizontal'
        },
        value: {
          set({ data }: EditorResult<Data>, value: boolean) {
            if (typeof data.actionsConfig === 'undefined') { // 兼容代码
              data.actionsConfig = { useLabelWidth: value, span: void 0 }
            } else {
              data.actionsConfig.useLabelWidth = value
            }
          },
          get({ data }: EditorResult<Data>) {
            return data.actionsConfig?.useLabelWidth || true
          },
        },
      },
      {
        title: '宽度',
        type: 'Slider',
        description: '24 栅格，0 则为内容自适应',
        options: {
          max: 24,
          min: 0,
          steps: 1,
          formatter: '/24'
        },
        ifVisible({ data }: EditorResult<Data>) {
          return data.layout !== 'vertical'
        },
        value: {
          set({ data }: EditorResult<Data>, value: number) {
            if (typeof data.actionsConfig === 'undefined') { // 兼容代码
              data.actionsConfig = { span: value, useLabelWidth: true }
            } else {
              data.actionsConfig.span = value ? value : void 0
            }
            
          },
          get({ data }: EditorResult<Data>) {
            const defaultValue = data.layout === 'inline' ? 0 : 24

            return data.actionsConfig?.span || defaultValue
          }
        }
      },
      // {
      //   title: '是否跟随表单项',
      //   type: 'Switch',
      //   ifVisible({data}: EditorResult<Data>) {
      //     return data.columnCount > 1
      //   },
      //   value: {
      //     set({data}: EditorResult<Data>, value: boolean) {
      //       data.isFollow = value
      //     },
      //     get({data}: EditorResult<Data>) {
      //       return data.isFollow
      //     },
      //   },
      // },
      // {
      //   title: '操作项位置',
      //   type: 'Select',
      //   options: [
      //     {label: '默认', value: 'default'},
      //     {label: '固定右下方', value: 'right-bottom'},
      //   ],
      //   ifVisible({data}: EditorResult<Data>) {
      //     return data.isFollow && data.columnCount > 1
      //   },
      //   value: {
      //     set({data}: EditorResult<Data>, value: ActionPositionType) {
      //       data.actionPosition = value
      //     },
      //     get({data}: EditorResult<Data>) {
      //       return data.actionPosition
      //     },
      //   },
      // },
    ],
  },
};

const submitBtn = {
  '[data-item-type=submitBtn]': {
    title: '主按钮',
    items: [
      {
        title: '文案',
        type: 'Text',
        value: {
          set({ data, focusArea, output }: EditorResult<Data>, value: string) {
            if (!value) return;

            data.primaryBtnText = value;
            output.setTitle('submit', value);
          },
          get({ data }: EditorResult<Data>) {
            return data.primaryBtnText;
          },
        },
      },
      {
        title: '加载动画',
        description: '开启后提交展示加载动画，动画需手动连线关闭',
        type: 'Switch',
        ifVisible({ data }: EditorResult<Data>) {
          return typeof data.showActions === 'undefined' || data.showActions;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.useSubmitBtnLoading;
          },
          set({ data, output }: EditorResult<Data>, value: boolean) {
            data.useSubmitBtnLoading = value;
          },
        },
      },
      // {
      //   title: '权限Key',
      //   description: '唯一标识的权限key',
      //   type: 'Text',
      //   value: {
      //     get({ data }) {
      //       return data.permissionPriKey
      //     },
      //     set({ data }, value: string) {
      //       data.permissionPriKey = value
      //     }
      //   }
      // },
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
          },
        ],
      },
    ],
  },
};

const secondBtn = {
  '[data-item-type=secondBtn]': {
    title: '副按钮',
    items: [
      {
        title: '显示',
        type: 'Switch',
        value: {
          set({ data, output }: EditorResult<Data>, value: boolean) {
            data.showSecondBtn = value;
            if (value) {
              addCancelOutput(output);
            } else {
              output.remove('cancel');
            }
          },
          get({ data }: EditorResult<Data>) {
            return data.showSecondBtn;
          },
        },
      },
      {
        title: '文案',
        type: 'Text',
        value: {
          set({ data, output }: EditorResult<Data>, value: string) {
            data.secondBtnText = value;
            output.setTitle('cancel', value);
          },
          get({ data }: EditorResult<Data>) {
            return data.secondBtnText;
          },
        },
      },
      {
        title: '权限控制',
        description: '唯一标识的权限key',
        type: 'Text',
        value: {
          get({ data }) {
            return data.permissionSecKey
          },
          set({ data }, value: string) {
            data.permissionSecKey = value
          }
        }
      },
      {
        title: '事件',
        items: [
          {
            title: '点击',
            type: '_Event',
            ifVisible({ data }) {
              return data.showSecondBtn;
            },
            options: () => {
              return {
                outputId: 'cancel'
              };
            }
          },
        ],
      },
    ],
  },
};

const resetBtn = {
  '[data-item-type=resetBtn]': {
    title: '重置按钮',
    items: [
      {
        title: '显示',
        type: 'Switch',
        value: {
          set({ data, output }: EditorResult<Data>, value: boolean) {
            data.resetBtn.isVisible = value;
            if (value) {
              addResetOutput(output);
            } else {
              output.remove('reset');
            }
          },
          get({ data }: EditorResult<Data>) {
            return data.resetBtn.isVisible;
          },
        },
      },
      {
        title: '文案',
        type: 'Text',
        value: {
          set({ data, output }: EditorResult<Data>, value: string) {
            data.resetBtn.text = value;
            output.setTitle('reset', value);
          },
          get({ data }: EditorResult<Data>) {
            return data.resetBtn.text;
          },
        },
      },
      {
        title: '权限控制',
        description: '唯一标识的权限key',
        type: 'Text',
        value: {
          get({ data }) {
            return data.permissionResetKey
          },
          set({ data }, value: string) {
            data.permissionResetKey = value
          }
        }
      },
    ],
  },
};

export default {
  ...formActions,
  ...submitBtn,
  ...secondBtn,
  ...resetBtn,
};
