import { Data, LocationEnum } from './constants';

const IconEditor = [
  {
    title: '图标',
    type: 'Switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return data.useIcon;
      },
      set({ data }: EditorResult<Data>, value: boolean) {
        if (!value) {
          data.showText = true;
        }
        if (value) {
          data.iconLocation = data.iconLocation || LocationEnum.FRONT;
          data.icon = data.icon || 'HomeOutlined';
          data.iconDistance = data.iconDistance || 8;
        }
        data.useIcon = value;
      }
    }
  },
  {
    title: '图标配置',
    ifVisible({ data }: EditorResult<Data>) {
      return !!data.useIcon;
    },
    items: [
      {
        title: '自定义',
        type: 'switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isCustom;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.isCustom = value;
          }
        }
      },
      { 
        title: '图标库',
        type: 'Icon',
        ifVisible({ data }: EditorResult<Data>) {
          return !data.isCustom;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.icon;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.icon = value;
          }
        }
      },
      {
        title: '上传',
        type: 'ImageSelector',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.isCustom;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.src;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.src = value;
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
          get({ data }: EditorResult<Data>) {
            return data.contentSize || [14, 14];
          },
          set({ data }: EditorResult<Data>, value: [number, number]) {
            data.contentSize = value;
          }
        }
      },
      {
        title: '显示文字',
        type: 'Switch',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.icon;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.showText;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.showText = value;
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
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.showText;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.iconLocation || LocationEnum.FRONT;
          },
          set({ data }: EditorResult<Data>, value: LocationEnum) {
            data.iconLocation = value;
          }
        }
      },
      {
        title: '间距',
        type: 'Inputnumber',
        options: [{ min: 0, max: 1000, width: 200 }],
        description: '图标与文字间的距离',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.showText;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.iconDistance];
          },
          set({ data }: EditorResult<Data>, value: number[]) {
            data.iconDistance = value[0];
          }
        }
      }
    ]
  }
];

export default IconEditor;
