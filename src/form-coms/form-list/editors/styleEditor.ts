import { ButtonType } from "antd/lib/button";
import { Data, SizeEnum } from "../types";

export const StyleEditor = [
  {
    title: '尺寸',
    type: 'Select',
    options: [
      { value: SizeEnum.Large, label: '大' },
      { value: SizeEnum.Middle, label: '中等' },
      { value: SizeEnum.Small, label: '小' },
    ],
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const comId = focusArea.dataset.formActionsItem as string;
        return data.actions.items.find(item => item.key === comId)?.size || SizeEnum.Middle;
      },
      set({ data, focusArea }: EditorResult<Data>, value: SizeEnum) {
        if (!focusArea) return;
        const comId = focusArea.dataset['formActionsItem'];
        const item = data.actions.items.find(item => item.key === comId);
        if (item) {
          item.size = value;
          data.actions = { ...data.actions };
        }
      }
    },
  },
  {
    title: '风格',
    type: 'Select',
    options: [
      { value: 'primary', label: '主按钮' },
      { value: 'default', label: '次按钮' },
      { value: 'dashed', label: '虚线按钮' },
      { value: 'link', label: '链接按钮' },
      { value: 'text', label: '文字按钮' }
    ],
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        const comId = focusArea.dataset.formActionsItem as string

        return data.actions.items.find(item => item.key === comId)?.type || 'default'
      },
      set({ data, focusArea }: EditorResult<Data>, value: ButtonType) {
        const comId = focusArea.dataset['formActionsItem']
        const item = data.actions.items.find(item => item.key === comId)

        if (item) {
          item.type = value;
          data.actions = { ...data.actions };
        }
      }
    }
  },
  {
    title: '危险按钮',
    type: 'Switch',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        const comId = focusArea.dataset.formActionsItem as string

        return data.actions.items.find(item => item.key === comId)?.danger
      },
      set({ data, focusArea }: EditorResult<Data>, value: boolean) {
        const comId = focusArea.dataset['formActionsItem']
        const item = data.actions.items.find(item => item.key === comId)

        if (item) {
          item.danger = value;
          data.actions = { ...data.actions };
        }
      }
    }
  },
];