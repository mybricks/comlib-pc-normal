import { addBtn } from "./actionBtnEditor";
import { Data } from "./constants";

export const commonActionBtnsEditor = (data, output) => {
  return {
    title: '操作配置',
    ifVisible({ data }: EditorResult<Data>) {
      return data.useActions;
    },
    items: [
      {
        title: '操作列表',
        description: '选中拖拽各项左侧手柄，可改变按钮的相对位置',
        type: 'array',
        options: {
          addText: '添加按钮',
          deletable: false,
          editable: false,
          getTitle: (item) => {
            return item?.title;
          },
          onAdd: () => {
            return addBtn({ data, output });
          }
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.actionBtns || [];
          },
          set({ data }: EditorResult<Data>, val: any[]) {
            data.actionBtns = val;
          }
        }
      },
      {
        title: '省略展示',
        type: 'Switch',
        description: '省略样式在调试/预览/发布生效',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.ellipsisActionBtnsConfig.useEllipsis;
          },
          set({ data, }: EditorResult<Data>, value: boolean) {
            data.ellipsisActionBtnsConfig.useEllipsis = value;
          }
        }
      },
      {
        title: '省略显示样式',
        type: 'radio',
        options: [
          { label: '点击', value: 'click' },
          { label: '悬浮', value: 'hover' }
        ],
        ifVisible({ data, }: EditorResult<Data>) {
          return data.ellipsisActionBtnsConfig.useEllipsis;
        },
        value: {
          get({ data, }: EditorResult<Data>) {
            return data.ellipsisActionBtnsConfig.trigger?.[0] || 'hover';
          },
          set({ data, }: EditorResult<Data>, value: 'click' | 'hover') {
            data.ellipsisActionBtnsConfig.trigger = [value];
          }
        }
      },
      {
        title: '超过时省略',
        type: 'Inputnumber',
        ifVisible({ data, }: EditorResult<Data>) {
          return data.ellipsisActionBtnsConfig.useEllipsis;
        },
        options: [{ min: 0, width: '100%' }],
        value: {
          get({ data }: EditorResult<Data>) {
            return [
              data.ellipsisActionBtnsConfig?.maxToEllipsis
            ];
          },
          set({ data }: EditorResult<Data>, value: number[]) {
            data.ellipsisActionBtnsConfig.maxToEllipsis =
              value[0];
          }
        }
      }]
  }
};