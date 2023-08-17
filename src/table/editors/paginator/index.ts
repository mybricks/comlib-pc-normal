import {
  AlignTypeEnum,
  SizeTypeEnum,
  OutputIds,
  // InputIds,
  // Schemas,
  templateRender
  // WidthTypeEnum
} from '../../components/Paginator/constants';
import { Data, RowSelectionPostionEnum, RowSelectionTypeEnum } from '../../types';
import { setDataSchema } from '../../schema';

export default {
  '[data-table-pagination]': {
    title: '分页',
    items: ({ }: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '常规';
      cate1.items = [
        {
          title: '位置',
          type: 'Select',
          ifVisible({ data }: EditorResult<Data>) {
            const useBottomRowSelection =
              data.useRowSelection &&
              data.selectionType !== RowSelectionTypeEnum.Radio &&
              (data.rowSelectionPostion || []).includes(RowSelectionPostionEnum.BOTTOM);
            return !useBottomRowSelection;
          },
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
              return data.paginationConfig.align;
            },
            set({ data }: EditorResult<Data>, value: AlignTypeEnum) {
              data.paginationConfig.align = value;
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
              return data.paginationConfig.size;
            },
            set({ data }: EditorResult<Data>, value: SizeTypeEnum) {
              data.paginationConfig.size = value;
            }
          }
        },
        {
          title: '默认每页显示条数',
          type: 'inputNumber',
          options: [{ min: 1, max: 1000, width: 100 }],
          ifVisible({ data }: EditorResult<Data>) {
            return !data.domainModel?.entity;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return [data.paginationConfig.defaultPageSize];
            },
            set({ data }: EditorResult<Data>, value: number[]) {
              data.paginationConfig.defaultPageSize = value[0];
              data.paginationConfig.currentPage = {
                ...data.paginationConfig.currentPage,
                pageSize: value[0]
              };
            }
          }
        },
        {
          title: '事件',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.domainModel?.entity;
          },
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
          title: '前端分页',
          type: 'Switch',
          description: '开启后，会自动根据当前页码/条目数分页展示',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.domainModel?.entity;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.paginationConfig.useFrontPage;
            },
            set({ data, ...res }: EditorResult<Data>, value: boolean) {
              data.paginationConfig.useFrontPage = value;
              setDataSchema({ data, ...res });
            }
          }
        },
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
          ifVisible({ data }: EditorResult<Data>) {
            return data.paginationConfig.size !== SizeTypeEnum.Simple;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.paginationConfig.text;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.paginationConfig.text = value;
            }
          }
        },
        {
          title: '跳页功能',
          type: 'Switch',
          description: '打开该功能后，支持直接输入页码跳转(当页数为1时，不显示跳页操作)',
          ifVisible({ data }: EditorResult<Data>) {
            return data.paginationConfig.size !== SizeTypeEnum.Simple;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.paginationConfig.showQuickJumper;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.paginationConfig.showQuickJumper = value;
            }
          }
        },
        {
          title: '条数选择功能',
          type: 'Switch',
          description: '打开该功能后，不再支持页数为1时隐藏功能',
          ifVisible({ data }: EditorResult<Data>) {
            return !data.domainModel?.entity && data.paginationConfig.size !== SizeTypeEnum.Simple;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.paginationConfig.showSizeChanger;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.paginationConfig.showSizeChanger = value;
            }
          }
        },
        {
          title: '条数配置',
          type: 'List',
          description: '配置条数切换器可选的条目数，仅识别正整数',
          ifVisible({ data }: EditorResult<Data>) {
            return (
              data.paginationConfig.showSizeChanger &&
              data.paginationConfig.size !== SizeTypeEnum.Simple
            );
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.paginationConfig.pageSizeOptions;
            },
            set({ data }: EditorResult<Data>, value: string[]) {
              let numReg: RegExp = /^[1-9]\d*$/;
              data.paginationConfig.pageSizeOptions = value.filter((val) => numReg.test(val.trim()));
            }
          }
        },
        {
          title: '页数为1时隐藏分页器',
          type: 'Switch',
          ifVisible({ data }: EditorResult<Data>) {
            return (
              !data.paginationConfig.showSizeChanger ||
              data.paginationConfig.size === SizeTypeEnum.Simple
            );
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.paginationConfig.hideOnSinglePage;
            },
            set({ data }: EditorResult<Data>, value: boolean) {
              data.paginationConfig.hideOnSinglePage = value;
            }
          }
        }
        // {
        //   title: '动态启用/禁用',
        //   type: 'Switch',
        //   description: '是否支持通过输入项动态启用或禁用分页器',
        //   value: {
        //     get({ data }: EditorResult<Data>) {
        //       return data.paginationConfig.isDynamic;
        //     },
        //     set({ data, input }: EditorResult<Data>, value: boolean) {
        //       data.paginationConfig.isDynamic = value;
        //       const event1 = input.get(InputIds.SetDisable);
        //       const event2 = input.get(InputIds.SetDisable);
        //       if (value) {
        //         !event1 && input.add(InputIds.SetDisable, '禁用', Schemas.Any);
        //         !event2 && input.add(InputIds.SetEnable, '启用', Schemas.Any);
        //       } else {
        //         event1 && input.remove(InputIds.SetDisable);
        //         event2 && input.remove(InputIds.SetEnable);
        //       }
        //     }
        //   }
        // }
      ];
      return {
        title: '分页器'
      };
    },
    style: [
      {
        title: '页码',
        ifVisible({ data }: EditorResult<Data>) {
          return data.paginationConfig.size !== SizeTypeEnum.Simple;
        },
        options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
        target: `.ant-pagination-item`
      },
      {
        title: '页码字体',
        ifVisible({ data }: EditorResult<Data>) {
          return data.paginationConfig.size !== SizeTypeEnum.Simple;
        },
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        initValue: {
          color: '#000000'
        },
        target: `.ant-pagination-item a`
      },
      {
        title: '页码Hover',
        ifVisible({ data }: EditorResult<Data>) {
          return data.paginationConfig.size !== SizeTypeEnum.Simple;
        },
        options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
        target: `.ant-pagination-item:hover`,
        domTarget: '.ant-pagination-item'
      },
      {
        title: '页码Hover字体',
        ifVisible({ data }: EditorResult<Data>) {
          return data.paginationConfig.size !== SizeTypeEnum.Simple;
        },
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        initValue: {
          color: '#000000'
        },
        target: `.ant-pagination-item:hover a`,
        domTarget: '.ant-pagination-item'
      },
      {
        title: '页码激活态',
        ifVisible({ data }: EditorResult<Data>) {
          return data.paginationConfig.size !== SizeTypeEnum.Simple;
        },
        options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
        target: `.ant-pagination-item-active`
      },
      {
        title: '页码激活态字体',
        ifVisible({ data }: EditorResult<Data>) {
          return data.paginationConfig.size !== SizeTypeEnum.Simple;
        },
        options: [{ type: 'font', config: { disableTextAlign: true } }],
        initValue: {
          color: '#000000'
        },
        target: `.ant-pagination-item-active a`
      }
    ]
  }
};
