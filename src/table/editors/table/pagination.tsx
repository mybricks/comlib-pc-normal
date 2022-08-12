import { InputIds, OutputIds } from '../../constants';
import { setDataSchema, setPaginationSchema } from '../../schema';
import { Data } from '../../types';

const paginationEditor = {
  title: '分页',
  ifVisible({ data }: EditorResult<Data>) {
    return data.isActive;
  },
  items: [
    {
      title: '使用分页',
      type: 'Switch',
      description:
        '是否使用分页，可采用分页的形式分隔长列表，每次只加载一页数据，与每页显示条数配合使用',
      ifVisible({ data }) {
        return data.isActive;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.hasPagination;
        },
        set({ data, input, output }: EditorResult<Data>, value: boolean) {
          data.hasPagination = value;
          setDataSchema({ data, input, output });

          if (value) {
            const schema = {
              title: '分页参数',
              type: 'object',
              properties: {
                [data.pageNumber || 'current']: {
                  title: '当前页',
                  type: 'number'
                },
                [data.pageSize || 'pageSize']: {
                  title: '每页条数',
                  type: 'number'
                }
              }
            };
            input.add(InputIds.PAGINATION, '表格分页', schema);
            output.add('pagination', '完成', schema);
            input.get(InputIds.PAGINATION).setRels(['pagination']);
          } else {
            input.remove(InputIds.PAGINATION);
            output.remove('pagination');
          }
        }
      }
    },
    {
      title: '刷新自动回到第1页',
      type: 'Switch',
      ifVisible({ data }: EditorResult<Data>) {
        return data.isActive && data.hasPagination;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.jumpToFirstPageWhenRefresh;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.jumpToFirstPageWhenRefresh = value;
        }
      }
    },
    {
      title: '每页显示条数',
      type: 'Slider',
      options: [
        {
          min: 1,
          max: 1000,
          step: 10,
          formatter: ''
        }
      ],
      ifVisible({ data }: EditorResult<Data>) {
        return data.isActive && data.hasPagination;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.pagination.pageSize;
        },
        set({ data }: EditorResult<Data>, value: number) {
          data.pagination.pageSize = value;
        }
      }
    },
    {
      title: '显示总数',
      type: 'Switch',
      ifVisible({ data }: EditorResult<Data>) {
        return data.isActive && data.hasPagination;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.showPaginationTotal;
        },
        set({ data }: EditorResult<Data>, value: boolean) {
          data.showPaginationTotal = value;
        }
      }
    },
    {
      title: '显示页码切换器',
      type: 'Switch',
      ifVisible({ data }: EditorResult<Data>) {
        return data.isActive && data.hasPagination;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.pagination.showSizeChanger;
        },
        set({ data }, value: boolean) {
          data.pagination.showSizeChanger = value;
        }
      }
    },
    {
      title: '点击分页',
      type: '_Event',
      ifVisible({ data }: EditorResult<Data>) {
        return data.hasPagination;
      },
      options: () => {
        return {
          outputId: OutputIds.ClickPagination
        };
      }
    }
  ]
};

export default paginationEditor;
