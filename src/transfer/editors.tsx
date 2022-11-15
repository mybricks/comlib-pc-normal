import { Data } from './types';

export default {
  ':root'({ data }: EditorResult<Data>, ...cate) {
    cate[0].title = '配置';
    cate[0].items = [
      {
        title: '属性',
        items: [
          {
            title: '数据源标题',
            type: 'text',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.titles ? data.titles[0] : '源数据';
              },
              set({ data }: EditorResult<Data>, val: string) {
                if (!data.titles) {
                  data.titles = [];
                }
                data.titles[0] = val;
              }
            }
          },
          {
            title: '目标数据标题',
            type: 'text',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.titles ? data.titles[1] : '目标数据';
              },
              set({ data }: EditorResult<Data>, val: string) {
                if (!data.titles) {
                  data.titles = [];
                }
                data.titles[1] = val;
              }
            }
          },
          {
            title: '模式',
            type: 'select',
            options: {
              options: [
                {
                  label: '单向',
                  value: true
                },
                {
                  label: '双向',
                  value: false
                }
              ]
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return !!data.oneWay;
              },
              set({ data }: EditorResult<Data>, val: boolean) {
                data.oneWay = val;
              }
            }
          },
          {
            title: '显示描述',
            type: 'switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.showDesc;
              },
              set({ data }: EditorResult<Data>, val: boolean) {
                data.showDesc = val;
              }
            }
          },
          {
            title: '可搜索',
            type: 'switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return data.showSearch;
              },
              set({ data }: EditorResult<Data>, val: boolean) {
                data.showSearch = val;
              }
            }
          },
          {
            title: '分页',
            type: 'switch',
            value: {
              get({ data }: EditorResult<Data>) {
                return !!data.showPagination;
              },
              set({ data }: EditorResult<Data>, val: boolean) {
                data.showPagination = val;
                if (data.showPagination) {
                  data.pagination = {
                    pageSize: 10
                  };
                } else {
                  data.pagination = {};
                }
              }
            }
          },
          {
            title: '每页条数',
            type: 'inputNumber',
            options: [{ min: 1, max: 100, width: 120 }],
            ifVisible({ data }: EditorResult<Data>) {
              return !!data.showPagination;
            },
            value: {
              get({ data }: EditorResult<Data>) {
                return [data.pagination?.pageSize || 10];
              },
              set({ data }: EditorResult<Data>, val: number[]) {
                data.pagination.pageSize = val[0];
              }
            }
          }
        ]
      },
      {
        title: '事件',
        items: [
          {
            title: '目标数据改变',
            type: '_Event',
            options: ({}: EditorResult<Data>) => {
              return {
                outputId: 'onChange'
              };
            }
          }
        ]
      }
    ];
  }
};
