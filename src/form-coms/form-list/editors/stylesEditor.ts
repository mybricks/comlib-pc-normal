import { ButtonType } from "antd/lib/button";
import { SizeOptions, SizeEnum } from "../../types";
import { Action, Data, LocationEnum, IconSrcType } from "../types";

export const StylesEditor = [
  {
    title: '尺寸',
    type: 'Select',
    options: SizeOptions,
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const comId = focusArea.dataset['formActionsItem'];
        const btn = data.actions.items.find(item => item.key === comId);

        if (!btn) return;
        return btn.size || SizeEnum.Middle;
      },
      set({ data, focusArea }: EditorResult<Data>, value: SizeEnum) {
        if (!focusArea) return;
        const comId = focusArea.dataset['formActionsItem'];
        const btn = data.actions.items.find(item => item.key === comId);

        if (!btn) return;

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
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const comId = focusArea.dataset['formActionsItem'];
        const btn = data.actions.items.find(item => item.key === comId);

        if (!btn) return;
        return btn?.type || 'default'
      },
      set({ data, focusArea }: EditorResult<Data>, value: ButtonType) {
        if (!focusArea) return;
        const comId = focusArea.dataset['formActionsItem'];
        const btn = data.actions.items.find(item => item.key === comId);

        if (!btn) return;
        btn.type = value;
        data.actions = { ...data.actions };
      }
    }
  },
  {
    title: '危险按钮',
    type: 'Switch',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const comId = focusArea.dataset['formActionsItem'];
        const btn = data.actions.items.find(item => item.key === comId);

        if (!btn) return;
        return btn?.danger
      },
      set({ data, focusArea }: EditorResult<Data>, value: boolean) {
        if (!focusArea) return;
        const comId = focusArea.dataset['formActionsItem'];
        const btn = data.actions.items.find(item => item.key === comId);

        if (!btn) return;
        btn.danger = value;
        data.actions = { ...data.actions };
      }
    }
  },
  {
    title: '图标来源',
    type: 'Radio',
    options: [
      { label: '无', value: false },
      { label: '内置图标库', value: 'inner' },
      { label: '自定义上传', value: 'custom' }
    ],
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const comId = focusArea.dataset['formActionsItem'];
        const btn = data.actions.items.find(item => item.key === comId);

        if (!btn) return;
        return btn.iconConfig?.src || false;
      },
      set({ data, focusArea }: EditorResult<Data>, value: IconSrcType) {
        if (!focusArea) return;
        const comId = focusArea.dataset['formActionsItem'];
        const btn = data.actions.items.find(item => item.key === comId);

        if (!btn) return;
        btn.iconConfig.src = value;
      }
    }
  },
  {
    title: '图标库',
    type: 'Icon',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const comId = focusArea.dataset['formActionsItem'];
      const btn = data.actions.items.find(item => item.key === comId);

      if (!btn) return;
      return btn.iconConfig?.src === 'inner';
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const comId = focusArea.dataset['formActionsItem'];
        const btn = data.actions.items.find(item => item.key === comId);

        if (!btn) return;
        return btn.iconConfig?.innerIcon || 'EditOutlined';
      },
      set({ data, focusArea }: EditorResult<Data>, value: string) {
        if (!focusArea) return;
        const comId = focusArea.dataset['formActionsItem'];
        const btn = data.actions.items.find(item => item.key === comId);

        if (!btn) return;
        btn.iconConfig.innerIcon = value;
      }
    }
  },
  {
    title: '上传',
    type: 'ImageSelector',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const comId = focusArea.dataset['formActionsItem'];
      const btn = data.actions.items.find(item => item.key === comId);

      if (!btn) return;
      return btn.iconConfig?.src === 'custom';
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const comId = focusArea.dataset['formActionsItem'];
        const btn = data.actions.items.find(item => item.key === comId);

        if (!btn) return;
        return btn.iconConfig?.customIcon;
      },
      set({ data, focusArea }: EditorResult<Data>, value: string) {
        if (!focusArea) return;
        const comId = focusArea.dataset['formActionsItem'];
        const btn = data.actions.items.find(item => item.key === comId);

        if (!btn) return;
        btn.iconConfig.customIcon = value;
      }
    }
  },
  {
    title: '间距',
    type: 'Inputnumber',
    options: [{ min: 0, max: 1000, width: 200 }],
    description: '图标与文字间的距离',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const comId = focusArea.dataset['formActionsItem'];
      const btn = data.actions.items.find(item => item.key === comId);

      if (!btn) return;

      return !!btn.iconConfig?.src;
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const comId = focusArea.dataset['formActionsItem'];
        const btn = data.actions.items.find(item => item.key === comId);

        if (!btn) return;
        return [btn.iconConfig?.gutter || 8];
      },
      set({ data, focusArea }: EditorResult<Data>, value: number[]) {
        if (!focusArea) return;
        const comId = focusArea.dataset['formActionsItem'];
        const btn = data.actions.items.find(item => item.key === comId);

        if (!btn) return;
        btn.iconConfig.gutter = value[0];
      }
    }
  },
  {
    title: '位置',
    type: 'Radio',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const comId = focusArea.dataset['formActionsItem'];
      const btn = data.actions.items.find(item => item.key === comId);

      if (!btn) return;

      return !!btn.iconConfig?.src;
    },
    options: [
      { label: '位于文字前', value: LocationEnum.FRONT },
      { label: '位于文字后', value: LocationEnum.BACK }
    ],
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const comId = focusArea.dataset['formActionsItem'];
        const btn = data.actions.items.find(item => item.key === comId);

        if (!btn) return;

        return btn.iconConfig?.location || LocationEnum.FRONT;
      },
      set({ data, focusArea }: EditorResult<Data>, value: LocationEnum) {
        if (!focusArea) return;
        const comId = focusArea.dataset['formActionsItem'];
        const btn = data.actions.items.find(item => item.key === comId);

        if (!btn) return;
        btn.iconConfig.location = value;
      }
    }
  },
]
