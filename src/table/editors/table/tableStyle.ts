import { unitConversion } from '../../../utils';
import { InputIds } from '../../constants';
import { Schemas } from '../../schema';
import { Data } from '../../types';

const tableStyleEditor = {
  title: '表格样式',
  items: [
    {
      title: '布局风格',
      type: 'Select',
      options: [
        { value: 'default', label: '默认' },
        { value: 'middle', label: '适中布局' },
        { value: 'small', label: '紧凑布局' }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.size;
        },
        set(
          { data }: EditorResult<Data>,
          value: 'default' | 'middle' | 'small'
        ) {
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
      title: '显示加载动画',
      type: 'Switch',
      description: '是否在数据加载的过程中展示loading动画',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useLoading;
        },
        set({ data, input }: EditorResult<Data>, value: boolean) {
          if (value) {
            input.add(InputIds.END_LOADING, '结束加载', Schemas.Void);
          } else {
            input.remove(InputIds.END_LOADING);
          }
          data.useLoading = value;
        }
      }
    },
    {
      title: '加载自定义文案',
      type: 'Text',
      description: '显示在loading图标下的文案',
      ifVisible({ data }) {
        return data.useLoading;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.loadingTip;
        },
        set({ data }: EditorResult<Data>, value: string) {
          data.loadingTip = value;
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
    }
    // {
    //   title: '样式',
    //   type: 'Style',
    //   options: ['BGCOLOR'],
    //   value: {
    //     get({ data }) {
    //       return data.bgColor;
    //     },
    //     set({ data }, value: Record<string, string>) {
    //       data.bgColor = value;
    //     }
    //   }
    // }
  ]
};

export default tableStyleEditor;
