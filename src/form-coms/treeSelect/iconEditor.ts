import { Data, IconType } from "./types";

export const IconEditor = (title) => [
  {
    title,
    type: 'Radio',
    options: [
      { label: '默认', value: false },
      { label: '内置图标库', value: 'inner' },
      { label: '自定义上传', value: 'custom' },
    ],
    value: {
      get({ data }: EditorResult<Data>) {
        return data.switcherIcon?.src;
      },
      set({ data }: EditorResult<Data>, value: any) {
        if (!data.switcherIcon) {
          data.switcherIcon = {
            src: false
          } as IconType;
        }
        data.switcherIcon.src = value;
      }
    }
  },
  {
    title: '图标库',
    type: 'Icon',
    ifVisible({ data }: EditorResult<Data>) {
      return data.switcherIcon?.src === 'inner';
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return data.switcherIcon.innerIcon;
      },
      set({ data }: EditorResult<Data>, value: string) {
        data.switcherIcon.innerIcon = value;
      }
    }
  },
  {
    title: '上传',
    type: 'ImageSelector',
    ifVisible({ data }: EditorResult<Data>) {
      return data.switcherIcon?.src === 'custom';
    },
    value: {
      get({ data }: EditorResult<Data>) {
        return data.switcherIcon.customIcon;
      },
      set({ data }: EditorResult<Data>, value: string) {
        data.switcherIcon.customIcon = value;
      }
    }
  },
]