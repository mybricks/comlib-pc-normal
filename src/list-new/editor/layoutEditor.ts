import {
  Data
} from '../constants';

export const LayoutEditor = [
  {
    title: '布局',
    items: [
      {
        title: '换行',
        type: 'switch',
        description: '默认自动换行，开启后不换行, 接着可配置是否需要横向滚动',
        value: {
          get({ data }: EditorResult<Data>){
            return data.isAuto;
          },
          set({ data }: EditorResult<Data>, val: boolean){
            data.isAuto = val;
          }
        }
      },
      {
        title: '横向滚动',
        type: 'switch',
        description: '开启后传递的内容超过页面宽度后, 可选择是否需要横向滚动, 开启后横向滚动, 否则隐藏内容',
        ifVisible({ data }: EditorResult<Data>) {
          return !data.isAuto;
        },
        value:{
          get({ data }: EditorResult<Data>){
            return data.isScroll || false;
          },
          set({ data }: EditorResult<Data>, val: boolean){
            data.isScroll = val;
          }
        }
      },
      {
        title: '列数自定义',
        type: 'switch',
        description: '开启后传递的内容超过页面宽度后, 可选择是否需要横向滚动, 开启后横向滚动, 否则隐藏内容',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.isAuto;
        },
        value:{
          get({ data }: EditorResult<Data>){
            return data.isCustom || false;
          },
          set({ data }: EditorResult<Data>, val: boolean){
            data.isCustom = val;
          }
        }
      },
      {
        title: '列数',
        type: 'InputNumber',
        ifVisible({ data }: EditorResult<Data>) {
            return !!data.isAuto && !!data.isCustom;
          },
        options: [{ min: 1, max: 1000, width: 100 }],
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.grid.column];
          },
          set({ data }: EditorResult<Data>, val) {
            data.grid.column = val[0];
          }
        }
      },
      {
        title: '可拖拽排序',
        type: 'switch',
        ifVisible({ data }: EditorResult<Data>) {
          const canSort = !!(data.isAuto && data.isCustom && data.grid.column === 1)
          if(!canSort){
            data.canSort = canSort
          }
          return canSort;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return !!data.canSort;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.canSort = val
          }
        }
      },
      {
        title: '间隔',
        type: 'InputNumber',
        options: [
          { min: 0, max: 1000, width: 100, title: '左右' },
          { min: 0, max: 1000, width: 100, title: '上下' }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            if (Array.isArray(data.grid.gutter)) {
              return data.grid.gutter;
            }
            return [data.grid.gutter, 16];
          },
          set({ data }: EditorResult<Data>, val) {
            if (!data.grid) {
              data.grid = {};
            }
            data.grid = {
              ...data.grid,
              gutter: val
            };
          }
        }
      },
    ]
  }
];
