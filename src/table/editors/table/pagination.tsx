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
            input.add(InputIds.PAGINATION, '获取分页数据', { type: 'any' });
            output.add(OutputIds.PAGINATION, '输出分页数据', schema);
            input.get(InputIds.PAGINATION).setRels([OutputIds.PAGINATION]);

            input.add(InputIds.SET_PAGINATION, '设置分页数据', schema);
            output.add(OutputIds.SET_PAGINATION, '设置完成', { type: 'any' });
            input.get(InputIds.SET_PAGINATION).setRels([OutputIds.SET_PAGINATION]);
          } else {
            input.remove(InputIds.PAGINATION);
            output.remove(OutputIds.PAGINATION);
            input.remove(InputIds.SET_PAGINATION);
            output.remove(OutputIds.SET_PAGINATION);
          }
        }
      }
    },
    // {
    //   title: '刷新自动回到第1页',
    //   type: 'Switch',
    //   ifVisible({ data }: EditorResult<Data>) {
    //     return data.isActive && data.hasPagination;
    //   },
    //   value: {
    //     get({ data }: EditorResult<Data>) {
    //       return data.jumpToFirstPageWhenRefresh;
    //     },
    //     set({ data }: EditorResult<Data>, value: boolean) {
    //       data.jumpToFirstPageWhenRefresh = value;
    //     }
    //   }
    // },
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
      title: '页码切换器配置',
      type: 'List',
      description: "配置条数切换器可选的条目数，仅识别正整数",
      ifVisible({ data }: EditorResult<Data>) {
        return data.pagination.options;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.pageSizeOptions;
        },
        set({ data }: EditorResult<Data>, value: string[]) {
          let numReg: RegExp = /^[1-9]\d*$/;
          data.pageSizeOptions = value.filter(val => numReg.test(val.trim()));
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
