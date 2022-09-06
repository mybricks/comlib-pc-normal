import {
  Data,
  AlignTypeEnum,
  SizeTypeEnum,
  OutputIds,
  InputIds,
  Schemas,
  templateRender
} from './constants';

export default {
  ':root': ({}: EditorResult<Data>, cate1, cate2) => {
    cate1.title = '常规';
    cate1.items = [
      {
        title: '位置',
        type: 'Select',
        options: [
          {
            label: '居左',
            value: AlignTypeEnum.FlexStart
          },
          {
            label: '居中',
            value: AlignTypeEnum.Center
          },
          {
            label: '居右',
            value: AlignTypeEnum.FlexEnd
          }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.align;
          },
          set({ data }: EditorResult<Data>, value: AlignTypeEnum) {
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
            value: SizeTypeEnum.Default
          },
          {
            label: '小',
            value: SizeTypeEnum.Small
          },
          {
            label: '简单模式',
            value: SizeTypeEnum.Simple
          }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.size;
          },
          set({ data }: EditorResult<Data>, value: SizeTypeEnum) {
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
            data.currentPage = {
              ...data.currentPage,
              pageSize: value[0]
            };
          }
        }
      },
      {
        title: '事件',
        items: [
          {
            title: '点击分页',
            type: '_Event',
            options: () => {
              return {
                outputId: OutputIds.PageChange
              };
            }
          }
        ]
      }
    ];

    cate2.title = '高级';
    cate2.items = [
      {
        title: '前置说明文字',
        type: 'EXPRESSION',
        description: '格式：{start}当前页起始条目，{end}当前页结束条目，{total}总条目数',
        options: {
          autoSize: true,
          placeholder: '例：共 {total} 条结果',
          suggestions: [
            {
              label: 'total',
              insertText: 'total',
              detail: `总条目数`
            },
            {
              label: 'start',
              insertText: 'start',
              detail: `当前页起始条目`
            },
            {
              label: 'end',
              insertText: 'end',
              detail: `当前页结束条目`
            }
          ],
          runCode: (script) => {
            return {
              success: templateRender(script, { total: 20, start: 1, end: 10 })
            };
          }
        },
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
        description: '打开该功能后，不再支持页数为1时隐藏功能',
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
        description: '配置条数切换器可选的条目数，仅识别正整数',
        ifVisible({ data }: EditorResult<Data>) {
          return data.showSizeChanger;
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return data.pageSizeOptions;
          },
          set({ data }: EditorResult<Data>, value: string[]) {
            let numReg: RegExp = /^[1-9]\d*$/;
            data.pageSizeOptions = value.filter((val) => numReg.test(val.trim()));
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
            const event1 = input.get(InputIds.SetDisable);
            const event2 = input.get(InputIds.SetDisable);
            if (value) {
              !event1 && input.add(InputIds.SetDisable, '禁用', Schemas.Any);
              !event2 && input.add(InputIds.SetEnable, '启用', Schemas.Any);
            } else {
              event1 && input.remove(InputIds.SetDisable);
              event2 && input.remove(InputIds.SetEnable);
            }
          }
        }
      }
    ];
    return {
      title: '分页器'
    };
  }
};
