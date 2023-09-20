import {
  Data,
  OutputIds,
  Schemas
} from '../constants';

export const LayoutEditor = [
  {
    title: '布局',
    items: [
      {
        title: '换行',
        type: 'switch',
        description: '默认自动换行，关闭后不换行, 接着可配置是否需要横向滚动',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isAuto;
          },
          set({ data, output }: EditorResult<Data>, val: boolean) {
            data.isAuto = val;
            const canSort = !!(data.isAuto && data.isCustom && data.grid.column === 1);
            if(!canSort){
              output.remove(OutputIds.SortComplete);
            }
          }
        }
      },
      {
        title: '方向',
        type: 'Radio',
        description: '默认纵向，一行一个元素；横向时，元素横向排列，自动换行',
        ifVisible({ data }: EditorResult<Data>) {
          return !data.isCustom && data.isAuto;
        },
        options: [
          { value: 'horizontal', label: '横向' },
          { value: 'vertical', label: '纵向' }
        ],
        value: {
          get({ data }) {
            return data.layout || 'vertical';
          },
          set({ data }, value: 'horizontal'|'vertical') {
            data.layout = value;
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
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isScroll || false;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.isScroll = val;
          }
        }
      },
      {
        title: '列数自定义',
        type: 'switch',
        description: '开启后，可自定义列数',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.isAuto;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isCustom || false;
          },
          set({ data, output }: EditorResult<Data>, val: boolean) {
            data.isCustom = val;
            const canSort = !!(data.isAuto && data.isCustom && data.grid.column === 1)
            if(!canSort){
              output.remove(OutputIds.SortComplete);
            }
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
          set({ data, output }: EditorResult<Data>, val) {
            data.grid.column = val[0];
            const canSort = !!(data.isAuto && data.isCustom && data.grid.column === 1)
            if(!canSort){
              output.remove(OutputIds.SortComplete);
            }
          }
        }
      },
      {
        title: '移动端列数',
        type: 'InputNumber',
        ifVisible({ data }: EditorResult<Data>) {
          return !!data.isAuto && !!data.isCustom;
        },
        options: [{ min: 1, max: 1000, width: 100 }],
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.grid.mobileColumn];
          },
          set({ data }: EditorResult<Data>, val) {
            data.grid.mobileColumn = val[0];
          }
        }
      },
      {
        title: '可拖拽排序',
        type: 'switch',
        ifVisible({ data }: EditorResult<Data>) {
          const canSort = !!(data.isAuto && data.isCustom && data.grid.column === 1)
          if (!canSort) {
            data.canSort = canSort
          }
          return canSort;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return !!data.canSort;
          },
          set({ data, output }: EditorResult<Data>, val: boolean) {
            data.canSort = val;
            if(val && data.canSort){
              output.add(OutputIds.SortComplete, '拖拽完成', Schemas.Array);
            }else{
              output.remove(OutputIds.SortComplete);
            }
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
