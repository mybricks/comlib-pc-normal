import { DefaultHeadStyle, DefaultContentStyle } from '../../../table/constants';
import { unitConversion } from '../../../utils';
import { isEqual } from 'lodash';
import { Data, SizeEnum } from '../../types';

export const DEFAULT_COLOR = {
  TitleColor: '#1f1f1f',
  TitleBgColor: '#f5f7f9',
  ContentColor: '#434343'
};

//hack方法，解决由styleditor的get方法会自动触发set的问题
let falg = false;
const styleTrigger = () => {
  falg = true;
  // styleEditor的set会自动触发get，在100ms内都为true，表示由get触发的，100ms后则不受影响
  setTimeout(() => {
    falg = false;
  }, 100);
};

const isTriggerByStyle = () => {
  return falg;
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
    // {
    //   title: '表头样式',
    //   type: 'ColorPicker',
    //   value: {
    //     get({ data }: EditorResult<Data>) {
    //       return data?.tableColor?.titleColor || DEFAULT_COLOR.TitleColor;
    //     },
    //     set({ data }: EditorResult<Data>, value: string) {
    //       if (!data.tableColor) {
    //         data.tableColor = {} as any;
    //       }
    //       data.columns = data.columns.map((item) => {
    //         item.titleColor = value;
    //         return item;
    //       });
    //       data.tableColor.titleColor = value;
    //     }
    //   }
    // },
    // {
    //   title: '内容样式',
    //   type: 'ColorPicker',
    //   value: {
    //     get({ data }: EditorResult<Data>) {
    //       return data?.tableColor?.contentColor || DEFAULT_COLOR.ContentColor;
    //     },
    //     set({ data }: EditorResult<Data>, value: string) {
    //       if (!data.tableColor) {
    //         data.tableColor = {} as any;
    //       }
    //       data.columns = data.columns.map((item) => {
    //         item.contentColor = value;
    //         return item;
    //       });
    //       data.tableColor.contentColor = value;
    //     }
    //   }
    // },
    {
      title: '表头样式',
      type: 'Style',
      options: {
        plugins: ['bgcolor', 'Font'],
        fontProps: {
          fontFamily: false,
          lineHeight: false
        }
      },
      value: {
        get({ data, id }: EditorResult<Data>) {
          styleTrigger();
          return data.headStyle || { ...DefaultHeadStyle };
        },
        set({ data, id }: EditorResult<Data>, value) {
          // 是否是由get触发的set
          if (isTriggerByStyle()) {
            return;
          }
          delete value.lineHeight;
          delete value.display;
          delete value.letterSpacing;
          data.columns = data.columns.map((item) => {
            item.headStyle = { ...value };
            return item;
          });
          data.headStyle = value;
        }
      }
    },
    {
      title: '内容样式',
      type: 'Style',
      options: {
        plugins: ['bgColor', 'Font'],
        fontProps: {
          fontFamily: false,
          lineHeight: false
        }
      },
      value: {
        get({ data, id }: EditorResult<Data>) {
          styleTrigger();
          return data.contentStyle || { ...DefaultContentStyle };
        },
        set({ data, id }: EditorResult<Data>, value) {
          if (isTriggerByStyle()) {
            return;
          }
          delete value.lineHeight;
          delete value.display;
          delete value.letterSpacing;
          data.columns = data.columns.map((item) => {
            item.contentStyle = { ...value };
            return item;
          });
          data.contentStyle = value;
        }
      }
    }
  ]
};

export default tableStyleEditor;
