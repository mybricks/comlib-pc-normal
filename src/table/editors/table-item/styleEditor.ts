import { setCol } from '../../schema';
import { DefaultHeadStyle, DefaultContentStyle } from '../../../table/constants';
import {
  AlignEnum,
  ContentTypeEnum,
  Data,
  FixedEnum,
  TableLayoutEnum,
  WidthTypeEnum
} from '../../types';
import { getColumnItem } from '../../utils';

export const DefaultColor = {
  TitleColor: '#1f1f1f',
  TitleBgColor: '#f5f7f9',
  ContentColor: '#434343'
};

const StyleEditor = [
  {
    title: '内容省略展示',
    type: 'Switch',
    description: '内容超出宽度后文本是否自动省略、不换行、以省略号结尾',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      return getColumnItem(data, focusArea).contentType === ContentTypeEnum.Text;
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return item.ellipsis;
      },
      set({ data, focusArea }: EditorResult<Data>, value: boolean) {
        if (!focusArea) return;
        setCol({ data, focusArea }, 'ellipsis', value);
      }
    }
  },
  {
    title: '适应剩余宽度',
    type: 'Switch',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const item = getColumnItem(data, focusArea);
      return item.contentType !== ContentTypeEnum.Group;
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        const item = getColumnItem(data, focusArea);
        return item.width === WidthTypeEnum.Auto;
      },
      set({ data, focusArea }: EditorResult<Data>, value: boolean) {
        if (value) {
          setCol({ data, focusArea }, 'width', WidthTypeEnum.Auto);
        } else {
          setCol({ data, focusArea }, 'width', 140);
        }
      }
    }
  },
  {
    title: '宽度(px)',
    type: 'Text',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const item = getColumnItem(data, focusArea);
      return item.contentType !== ContentTypeEnum.Group && item.width !== WidthTypeEnum.Auto;
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        const item = getColumnItem(data, focusArea);
        return item.width;
      },
      set({ data, focusArea }: EditorResult<Data>, value: string) {
        setCol({ data, focusArea }, 'width', +(value || 140));
      }
    }
  },
  // {
  //   title: '对齐方式',
  //   type: 'Select',
  //   options: [
  //     { label: '左对齐', value: AlignEnum.Left },
  //     { label: '居中对齐', value: AlignEnum.Center },
  //     { label: '右对齐', value: AlignEnum.Right }
  //   ],
  //   value: {
  //     get({ data, focusArea }: EditorResult<Data>) {
  //       if (!focusArea) return;
  //       const item = getColumnItem(data, focusArea);
  //       return item.align || AlignEnum.Left;
  //     },
  //     set({ data, focusArea }: EditorResult<Data>, value: AlignEnum) {
  //       if (!focusArea) return;
  //       setCol({ data, focusArea }, 'align', value);
  //     }
  //   }
  // },
  {
    title: '固定列',
    type: 'Select',
    description: '对于列数很多的数据，可以固定前后的列，横向滚动查看其它数据',
    options: [
      { value: FixedEnum.Default, label: '默认' },
      { value: FixedEnum.Left, label: '左固定' },
      { value: FixedEnum.Right, label: '右固定' }
    ],
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const item = getColumnItem(data, focusArea);
      return (
        item.contentType !== ContentTypeEnum.Group && data.tableLayout !== TableLayoutEnum.Auto
      );
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        return item.fixed || FixedEnum.Default;
      },
      set({ data, focusArea }, value: FixedEnum) {
        if (!focusArea) return;
        setCol({ data, focusArea }, 'fixed', value);
      }
    }
  },
  // {
  //   title: '表头背景色',
  //   type: 'ColorPicker',
  //   ifVisible({ focusArea }: EditorResult<Data>) {
  //     if (!focusArea) return;
  //     return true;
  //   },
  //   value: {
  //     get({ data, focusArea }: EditorResult<Data>) {
  //       const item = getColumnItem(data, focusArea);
  //       return item.titleBgColor || DefaultColor.TitleBgColor;
  //     },
  //     set({ data, focusArea }: EditorResult<Data>, value: string) {
  //       setCol({ data, focusArea }, 'titleBgColor', value);
  //     }
  //   }
  // },
  // {
  //   title: '表头样式',
  //   type: 'Style',
  //   ifVisible({ focusArea }: EditorResult<Data>) {
  //     if (!focusArea) return;
  //     return true;
  //   },
  //   options: {
  //     plugins: ['bgColor', 'Font'],
  //     fontProps: {
  //       fontFamily: false,
  //       lineHeight: false
  //     }
  //   },
  //   value: {
  //     get({ data, focusArea }: EditorResult<Data>) {
  //       const item = getColumnItem(data, focusArea);
  //       return item.headStyle || { ...DefaultHeadStyle };
  //     },
  //     set({ data, focusArea }: EditorResult<Data>, value) {
  //       delete value.lineHeight;
  //       delete value.display;
  //       delete value.letterSpacing;
  //       setCol({ data, focusArea }, 'headStyle', { ...value });
  //     }
  //   }
  // },
  // {
  //   title: '内容样式',
  //   type: 'Style',
  //   ifVisible({ focusArea }: EditorResult<Data>) {
  //     if (!focusArea) return;
  //     return true;
  //   },
  //   options: {
  //     plugins: ['bgColor', 'Font'],
  //     fontProps: {
  //       fontFamily: false,
  //       lineHeight: false
  //     }
  //   },
  //   value: {
  //     get({ data, focusArea }: EditorResult<Data>) {
  //       const item = getColumnItem(data, focusArea);
  //       return item.contentStyle || { ...DefaultContentStyle };
  //     },
  //     set({ data, focusArea }: EditorResult<Data>, value) {
  //       delete value.lineHeight;
  //       delete value.display;
  //       delete value.letterSpacing;
  //       setCol({ data, focusArea }, 'contentStyle', { ...value });
  //     }
  //   }
  // }
];

export default StyleEditor;
