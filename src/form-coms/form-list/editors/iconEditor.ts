import { Action, Data, IconSrcType, LocationEnum } from '../types';

export const IconEditor = (btn: Action) => {
  return [
    {
      title: '图标配置',
      items: [
        {
          title: '图标来源',
          type: 'Radio',
          options: [
            { label: '无', value: false },
            { label: '内置图标库', value: 'inner' },
            { label: '自定义上传', value: 'custom' }
          ],
          value: {
            get({ }: EditorResult<Data>) {
              return btn.iconConfig?.src || false;
            },
            set({ }: EditorResult<Data>, value: IconSrcType) {
              btn.iconConfig.src = value;
            }
          }
        },
        {
          title: '图标库',
          type: 'Icon',
          ifVisible({ }: EditorResult<Data>) {
            return btn.iconConfig?.src === 'inner';
          },
          value: {
            get({ }: EditorResult<Data>) {
              return btn.iconConfig?.innerIcon || 'EditOutlined';
            },
            set({ }: EditorResult<Data>, value: string) {
              btn.iconConfig.innerIcon = value;
            }
          }
        },
        {
          title: '上传',
          type: 'ImageSelector',
          ifVisible({ }: EditorResult<Data>) {
            return btn.iconConfig?.src === 'custom';
          },
          value: {
            get({ }: EditorResult<Data>) {
              return btn.iconConfig?.customIcon;
            },
            set({ }: EditorResult<Data>, value: string) {
              btn.iconConfig.customIcon = value;
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
          ifVisible({ }: EditorResult<Data>) {
            return !!btn.iconConfig?.src;
          },
          value: {
            get({ }: EditorResult<Data>) {
              return btn.iconConfig?.size || [14, 14];
            },
            set({ }: EditorResult<Data>, value: [number, number]) {
              btn.iconConfig.size = value;
            }
          }
        },
        {
          title: '间距',
          type: 'Inputnumber',
          options: [{ min: 0, max: 1000, width: 200 }],
          description: '图标与文字间的距离',
          ifVisible({ }: EditorResult<Data>) {
            return !!btn.iconConfig?.src;
          },
          value: {
            get({ }: EditorResult<Data>) {
              return [btn.iconConfig?.gutter || 8];
            },
            set({ }: EditorResult<Data>, value: number[]) {
              btn.iconConfig.gutter = value[0];
            }
          }
        },
        {
          title: '位置',
          type: 'Radio',
          ifVisible({ }: EditorResult<Data>) {
            return !!btn.iconConfig?.src;
          },
          options: [
            { label: '位于文字前', value: LocationEnum.FRONT },
            { label: '位于文字后', value: LocationEnum.BACK }
          ],
          value: {
            get({ }: EditorResult<Data>) {
              return btn.iconConfig?.location || LocationEnum.FRONT;
            },
            set({ }: EditorResult<Data>, value: LocationEnum) {
              btn.iconConfig.location = value;
            }
          }
        },
      ]
    },
  ]
};
