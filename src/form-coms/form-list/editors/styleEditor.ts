import { ButtonType } from "antd/lib/button";
import { Action, Data, SizeEnum } from "../types";

export const StyleEditor = (btn: Action) => {
  return [
    {
      title: '尺寸',
      type: 'Select',
      options: [
        { value: SizeEnum.Large, label: '大' },
        { value: SizeEnum.Middle, label: '中等' },
        { value: SizeEnum.Small, label: '小' },
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return btn.size || SizeEnum.Middle;
        },
        set({ data }: EditorResult<Data>, value: SizeEnum) {
          btn.size = value;
          data.actions = { ...data.actions };
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
        get({ data }: EditorResult<Data>) {
          return btn?.type || 'default'
        },
        set({ data }: EditorResult<Data>, value: ButtonType) {
          btn.type = value;
          data.actions = { ...data.actions };
        }
      }
    },
    {
      title: '危险按钮',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return btn?.danger
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          btn.danger = value;
          data.actions = { ...data.actions };
        }
      }
    },
  ]
};