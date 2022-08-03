import { Data, AlignType, SizeType } from './constants';

export default {
  ':root': ({ }: EditorResult<Data>, cate1, cate2) => {
    cate1.title = '常规';
    cate2.title = '高级';
    cate1.items = [
      {
        title: '位置',
        type: 'Select',
        options: [
          {
            label: '居左',
            value: 'flex-start',
          },
          {
            label: '居中',
            value: 'center',
          },
          {
            label: '居右',
            value: 'flex-end',
          },
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.align;
          },
          set({ data }: EditorResult<Data>, value: AlignType) {
            data.align = value;
          }
        }
      },
      {
        title: '尺寸',
        type: 'select',
        options: [
          {
            label: '正常',
            value: 'default'
          },
          {
            label: '小',
            value: 'small'
          },
          {
            label: '简单模式',
            value: 'simple'
          }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.size;
          },
          set({ data }: EditorResult<Data>, value: SizeType) {
            data.size = value;
          }
        }
      },
      {
        title: '默认每页显示条数',
        type: 'inputNumber',
        options: [{ min: 0, max: 1000, width: 100 }],
        value: {
          get({ data }: EditorResult<Data>) {
            return [data.defaultPageSize];
          },
          set({ data }: EditorResult<Data>, value: number[]) {
            data.defaultPageSize = value[0];
          }
        }
      },
      {
        title: "事件",
        items: [
          {
            title: '点击分页',
            type: '_Event',
            options: () => {
              return {
                outputId: 'pageChange'
              };
            }
          }
        ]
      }
    ];
    cate2.items = [
      {
        title: '前置说明文字',
        type: 'Text',
        description: "格式：{start}当前页起始条目，{end}当前页结束条目，{total}总条目数",
        value: {
          get({ data }: EditorResult<Data>) {
            return data.text;
          },
          set({ data }: EditorResult<Data>, value: string) {
            data.text = value;
          }
        }
      },
      {
        title: '跳转页面功能',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.showQuickJumper;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.showQuickJumper = value;
          }
        }
      },
      {
        title: '条数选择功能',
        type: 'Switch',
        description: "打开该功能后，不再支持页数为1时隐藏功能",
        value: {
          get({ data }: EditorResult<Data>) {
            return data.showSizeChanger;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.showSizeChanger = value;
          }
        }
      },
      {
        title: '条数配置',
        type: 'List',
        description: "配置条数切换器可选的条目数，仅识别正整数",
        ifVisible({ data }: EditorResult<Data>) {
          return data.showSizeChanger;
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
        title: '页数为1时隐藏分页器',
        type: 'Switch',
        ifVisible({ data }: EditorResult<Data>) {
          return !data.showSizeChanger;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.hideOnSinglePage;
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            data.hideOnSinglePage = value;
          }
        }
      },
      {
        title: '动态启用/禁用',
        type: 'Switch',
        description: '是否支持通过输入项动态启用或禁用分页器',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.isDynamic;
          },
          set({ data, input }: EditorResult<Data>, value: boolean) {
            data.isDynamic = value;
            if (value) {
              input.add('disable', '禁用', { type: 'any' });
              input.add('enable', '启用', { type: 'any' });
            } else {
              input.remove('disable');
              input.remove('enable');
            }
          }
        }
      }
    ];
    return {
      title: 'Tabs'
    };
  }
};
