import { unitConversion } from '../../../utils';
import { Data, SizeEnum } from '../../types';

export const DEFAULT_COLOR = {
  TitleColor: '#1f1f1f',
  TitleBgColor: '#f5f7f9',
  ContentColor: '#434343'
};

const tableStyleEditor = {
  title: '表格样式',
  items: [
    {
      title: '布局风格',
      type: 'Select',
      options: [
        { value: SizeEnum.Default, label: '默认' },
        { value: SizeEnum.Middle, label: '适中布局' },
        { value: SizeEnum.Small, label: '紧凑布局' }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.size;
        },
        set({ data }: EditorResult<Data>, value: SizeEnum) {
          data.size = value;
        }
      }
    },
    {
      title: '显示边框',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.bordered;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.bordered = value;
        }
      }
    },
    {
      title: '固定表头',
      type: 'Switch',
      description: '设置表头固定，只滚动数据行。必须同时设置【每一列的宽度】',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.fixedHeader;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.fixedHeader = value;
        }
      }
    },
    {
      title: '设置固定表头可滚动高度',
      type: 'Text',
      ifVisible({ data }: EditorResult<Data>) {
        return data.fixedHeader;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.scroll.y;
        },
        set({ data }: EditorResult<Data>, value) {
          data.scroll.y = unitConversion(value);
        }
      }
    },
    {
      title: '表头背景色',
      type: 'ColorPicker',
      value: {
        get({ data }: EditorResult<Data>) {
          return data?.tableColor?.titleBgColor || DEFAULT_COLOR.TitleBgColor;
        },
        set({ data }: EditorResult<Data>, value: string) {
          if (!data.tableColor) {
            data.tableColor = {} as any;
          }
          data.columns = data.columns.map((item) => {
            item.titleBgColor = value;
            return item;
          });
          data.tableColor.titleBgColor = value;
        }
      }
    },
    {
      title: '表头字体颜色',
      type: 'ColorPicker',
      value: {
        get({ data }: EditorResult<Data>) {
          return data?.tableColor?.titleColor || DEFAULT_COLOR.TitleColor;
        },
        set({ data }: EditorResult<Data>, value: string) {
          if (!data.tableColor) {
            data.tableColor = {} as any;
          }
          data.columns = data.columns.map((item) => {
            item.titleColor = value;
            return item;
          });
          data.tableColor.titleColor = value;
        }
      }
    },
    {
      title: '内容字体颜色',
      type: 'ColorPicker',
      value: {
        get({ data }: EditorResult<Data>) {
          return data?.tableColor?.contentColor || DEFAULT_COLOR.ContentColor;
        },
        set({ data }: EditorResult<Data>, value: string) {
          if (!data.tableColor) {
            data.tableColor = {} as any;
          }
          data.columns = data.columns.map((item) => {
            item.contentColor = value;
            return item;
          });
          data.tableColor.contentColor = value;
        }
      }
    }
  ]
};

export default tableStyleEditor;
