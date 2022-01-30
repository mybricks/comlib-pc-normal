import { OutputIds } from '../../constants';
import { setPaginationSchema } from '../../schema';
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
        set({ data }: EditorResult<Data>, value: boolean) {
          data.hasPagination = value;
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
      title: '页码字段',
      type: 'text',
      description: '后台提供的服务接口所需的分页传参字段',
      ifVisible({ data }: EditorResult<Data>) {
        return data.isActive && data.hasPagination;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.pageNumber || 'current';
        },
        set({ data, output }: EditorResult<Data>, value: string) {
          if (value.length) {
            data.pageNumber = value;
            setPaginationSchema({ data, output });
          }
        }
      }
    },
    {
      title: '每页条数字段',
      type: 'text',
      description:
        '后台提供的服务接口所需的字段往往千变万化，表格内置了分页传参的字段，根据接口定义需要的字段',
      ifVisible({ data }: EditorResult<Data>) {
        return data.isActive && data.hasPagination;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.pageSize || 'pageSize';
        },
        set({ data, output }: EditorResult<Data>, value: string) {
          if (value.length) {
            data.pageSize = value;
            setPaginationSchema({ data, output });
          }
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
