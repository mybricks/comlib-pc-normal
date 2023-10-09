import { Data } from '../../types';

export default {
  title: '行合并操作',
  items: [
    {
      title: '开启行合并设置',
      type: 'switch',
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          return !!data.enbaleRowMerge;
        },
        set({ data, focusArea, output, input, ...res }: EditorResult<Data>, value) {
          data.enbaleRowMerge = value;
        }
      }
    },
    {
      title: '指定合并行所依赖的字段',
      description: '当指定的字段值相同时，则合并对应的行',
      type: 'text',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        return !!data.enbaleRowMerge;
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          return data?.rowMergeConfig?.mergeByField || '';
        },
        set({ data, focusArea, output, input, ...res }: EditorResult<Data>, value: string) {
          data.rowMergeConfig = {
            mergeByField: value,
            excludeFields: data?.rowMergeConfig?.excludeFields || []
          };
        }
      }
    },
    {
      title: '不能被合并的字段',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        return !!data.enbaleRowMerge;
      },
      type: 'array',
      options: {
        // onAdd: () => {
        //   const value = uuid('_', 2);
        //   const defaultOption = {
        //     label: `选项${value}`,
        //     value: `选项${value}`,
        //   };
        //   return defaultOption;
        getTitle: (item) => {
          return item.field;
        },
        items: [
          {
            title: '字段',
            type: 'text',
            value: 'field'
          }
        ]
      },
      value: {
        get({ data, focusArea }: EditorResult<Data>) {
          return data.rowMergeConfig?.excludeFields?.map((item) => ({
            field: item
          }));
        },
        set({ data, focusArea, output, input, ...res }: EditorResult<Data>, value) {
          const vals = value.map((item) => item.field);
          data.rowMergeConfig = {
            mergeByField: data.rowMergeConfig?.mergeByField || '',
            excludeFields: vals
          };
        }
      }
    }
  ]
};
