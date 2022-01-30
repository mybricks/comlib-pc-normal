import { InputIds } from '../../constants';
import { Schemas } from '../../schema';
import { Data } from '../../types';

const FilterEditor = {
  title: '筛选',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    const item = data.columns[focusArea.dataset.tableThIdx];
    return (
      item &&
      ['text', 'color', 'link', 'tag', 'badge'].includes(item.contentType)
    );
  },
  items: [
    {
      title: '使用筛选',
      type: 'Switch',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          return item.filter?.enable;
        },
        set({ data, focusArea }: EditorResult<Data>, value: boolean) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          if (item.filter) {
            item.filter.enable = value;
          } else {
            item.filter = {
              enable: value
            };
          }
        }
      }
    },
    {
      title: '筛选类型',
      type: 'Select',
      options: [
        { label: '多选', value: 'multi' },
        { label: '单选', value: 'single' }
      ],
      description: '筛选支持单选或多选',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = data.columns[focusArea.dataset.tableThIdx];
        return item && item.filter?.enable;
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          return (item && item.filter?.filterType) || 'multi';
        },
        set(
          { data, focusArea }: EditorResult<Data>,
          value: 'multi' | 'single'
        ) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          item.filter.filterType = value;
        }
      }
    },
    {
      title: '筛选项来源',
      type: 'Select',
      options: [
        { label: '本地定义', value: 'local' },
        { label: '接口获取', value: 'remote' }
      ],
      description: '定义筛选项数据的来源方式',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = data.columns[focusArea.dataset.tableThIdx];
        return item && item.filter?.enable;
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          return (item && item.filter?.filterSource) || 'local';
        },
        set(
          { data, focusArea, input }: EditorResult<Data>,
          value: 'local' | 'remote'
        ) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          item.filter.filterSource = value;
          if (value === 'remote') {
            input.add(InputIds.SET_FILTER_INPUT, '接收筛选项', Schemas.Object);
          }
        }
      }
    },
    {
      title: '自定义筛选项',
      type: 'Map',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = data.columns[focusArea.dataset.tableThIdx];
        return (
          item && item.filter?.enable && item.filter?.filterSource !== 'remote'
        );
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          let opts = {};
          if (item && item.filter?.options) {
            opts = item.filter?.options.reduce((pre, curr) => {
              return {
                ...pre,
                [curr.text]: curr.value
              };
            }, {});
          }
          return opts;
        },
        set({ data, focusArea }: EditorResult<Data>, value: any) {
          if (!focusArea) return;
          const options = Object.keys(value).map((k) => ({
            text: k,
            value: value[k]
          }));
          const item = data.columns[focusArea.dataset.tableThIdx];
          if (item.filter) {
            item.filter.options = options;
          } else {
            item.filter = {
              options: options
            };
          }
        }
      }
    },
    {
      title: '筛选方式',
      type: 'Select',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        const item = data.columns[focusArea.dataset.tableThIdx];
        return item && item.filter?.enable;
      },
      options: [
        { label: '本地筛选', value: 'local' },
        { label: '请求接口', value: 'request' }
      ],
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          return (item && item.filter?.type) || 'local';
        },
        set(
          { data, focusArea }: EditorResult<Data>,
          value: 'local' | 'request'
        ) {
          if (!focusArea) return;
          const item = data.columns[focusArea.dataset.tableThIdx];
          if (item.filter) {
            item.filter.type = value;
          }
        }
      }
    }
  ]
};

export default FilterEditor;
