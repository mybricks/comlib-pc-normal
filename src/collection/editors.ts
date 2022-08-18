import { Data, ResolveType} from './types';

export default {
  ':root': [
    {
      title: '处理类型',
      type: 'select',
      options: [
        {
          label: '拍平',
          value: ResolveType.FLAT
        },
        {
          label: '排序',
          value: ResolveType.SORT
        },
        {
          label: '去重',
          value: ResolveType.UNIQUE
        }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.resolveType;
        },
        set({ data }: EditorResult<Data>, val: string) {
          data.resolveType = val;
        }
      }
    },
    {
      title: '排序字段',
      type: 'text',
      ifVisible({ data }: EditorResult<Data>) {
        return data.resolveType === ResolveType.SORT;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.sort.sortKey;
        },
        set({ data }: EditorResult<Data>, val: string) {
          data.sort.sortKey = val;
        }
      }
    },
    {
      title: '排序类型',
      type: 'select',
      options: [
        { label: '升序', value: 'up' },
        { label: '降序', value: 'down' }
      ],
      ifVisible({ data }: EditorResult<Data>) {
        return data.resolveType === ResolveType.SORT;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.sort.type;
        },
        set({ data }: EditorResult<Data>, val: string) {
          data.sort.type = val
        }
      }
    },
    {
      title: '拍平层级',
      type: 'inputNumber',
      options: [{ min: 0, max: 10, width: 200 }],
      ifVisible({ data }: EditorResult<Data>) {
        return data.resolveType === ResolveType.FLAT;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.flat.level;
        },
        set({ data }: EditorResult<Data>, val: number) {
          data.flat.level = val;
        }
      }
    }
  ]
};
