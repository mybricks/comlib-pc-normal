import { Data, LocationEnum } from '../../types';
import { getBtnItemInfo } from '../../utils';

const IconEditor = [
  {
    title: '图标',
    type: 'Switch',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        return item.useIcon;
      },
      set({ data, focusArea }: EditorResult<Data>, value: boolean) {
        if (!focusArea) return;
        const { item } = getBtnItemInfo(data, focusArea);
        if (!value) {
          item.showText = true;
        }
        if (value) {
          item.iconLocation = item.iconLocation || LocationEnum.FRONT;
          item.icon = item.icon || 'HomeOutlined';
          item.iconDistance = item.iconDistance || 8;
        }
        item.useIcon = value;
      }
    }
  },
  {
    title: '图标配置',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const { item } = getBtnItemInfo(data, focusArea);
      return !!item.useIcon;
    },
    items: [
      {
        title: '自定义',
        type: 'switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            return item.isCustom || false;
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            item.isCustom = value;
          }
        }
      },
      { 
        title: '图标库',
        type: 'Icon',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const { item } = getBtnItemInfo(data, focusArea);
          return !item.isCustom;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            return item.icon;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            item.icon = value;
          }
        }
      },
      {
        title: '上传',
        type: 'ImageSelector',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const { item } = getBtnItemInfo(data, focusArea);
          return !!item.isCustom;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            return item.src;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            item.src = value;
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
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            const { item } = getBtnItemInfo(data, focusArea);
            return item.contentSize || [14, 14];
          },
          set({ data, focusArea }: EditorResult<Data>, value: [number, number]) {
            const { item } = getBtnItemInfo(data, focusArea);
            item.contentSize = value;
          }
        }
      },
      {
        title: '显示文字',
        type: 'Switch',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const { item } = getBtnItemInfo(data, focusArea);
          return !!item.icon;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            return item.showText;
          },
          set({ data, focusArea }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            item.showText = value;
          }
        }
      },
      {
        title: '图标位置',
        type: 'Select',
        options: [
          { label: '位于文字前', value: LocationEnum.FRONT },
          { label: '位于文字后', value: LocationEnum.BACK }
        ],
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const { item } = getBtnItemInfo(data, focusArea);
          return !!item.showText;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            return item.iconLocation || LocationEnum.FRONT;
          },
          set({ data, focusArea }: EditorResult<Data>, value: LocationEnum) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            item.iconLocation = value;
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
          const { item } = getBtnItemInfo(data, focusArea);
          return !!item.showText;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            return [item.iconDistance];
          },
          set({ data, focusArea }: EditorResult<Data>, value: number[]) {
            if (!focusArea) return;
            const { item } = getBtnItemInfo(data, focusArea);
            item.iconDistance = value[0];
          }
        }
      }
    ]
  }
];

export default IconEditor;
