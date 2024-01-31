import {
  AlignTypeEnum,
  SizeTypeEnum,
  OutputIds,
  InputIds,
  Schemas,
  templateRender
  // WidthTypeEnum
} from '../../components/Paginator/constants';
import { Data, RowSelectionPostionEnum, RowSelectionTypeEnum } from '../../types';
import { setDataSchema } from '../../schema';

const catelogEditors = (catelog, editors) => {
  return editors.map((item) => ({
    catelog,
    ...item
  }));
};

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
            locale: true,
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
              data.paginationConfig.pageSizeOptions = value.filter((val) =>
                numReg.test(val.trim())
              );
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
        },
        {
          title: '动态启用/禁用',
          type: 'Switch',
          description: '是否支持通过输入项动态启用或禁用分页器',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.paginationConfig.isDynamic;
            },
            set({ data, input, output }: EditorResult<Data>, value: boolean) {
              data.paginationConfig.isDynamic = value;
              const event1 = input.get(InputIds.SetDisable);
              const event2 = input.get(InputIds.SetDisable);
              if (value) {
                !event1 && input.add(InputIds.SetDisable, '禁用分页器', Schemas.Any);
                !event1 && output.add(OutputIds.SetDisable, '禁用分页器后', Schemas.Any);
                !event1 && input.get(InputIds.SetDisable).setRels([OutputIds.SetDisable]);
                !event2 && input.add(InputIds.SetEnable, '启用分页器', Schemas.Any);
                !event2 && output.add(OutputIds.SetEnable, '启用分页器后', Schemas.Any);
                !event2 && input.get(InputIds.SetEnable).setRels([OutputIds.SetEnable]);
              } else {
                event1 && input.remove(InputIds.SetDisable);
                event1 && output.remove(OutputIds.SetDisable);
                event2 && input.remove(InputIds.SetEnable);
                event2 && output.remove(OutputIds.SetEnable);
              }
            }
          }
        }
      ];
      return {
        title: '分页器'
      };
    },
    style: [
      {
        items: [
          ...catelogEditors('默认', [
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
                return data.paginationConfig.size === SizeTypeEnum.Simple;
              },
              options: [{ type: 'font', config: { disableTextAlign: true } }],
              target: `.ant-pagination-simple .ant-pagination-simple-pager`
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
              target: `.ant-pagination-item:not(.ant-pagination-item-active) a`
            },
            {
              title: '翻页按钮',
              options: [
                'font',
                'border',
                { type: 'background', config: { disableTextAlign: true } }
              ],
              target: `.ant-pagination li:not(.ant-pagination-disabled) button`
            },
            {
              title: '前置文案字体',
              ifVisible({ data }: EditorResult<Data>) {
                return data.paginationConfig.size !== SizeTypeEnum.Simple;
              },
              options: [{ type: 'font', config: { disableTextAlign: true } }],
              target: `.ant-pagination-total-text`
            },
            {
              title: '条数选择',
              ifVisible({ data }: EditorResult<Data>) {
                return (
                  data.paginationConfig.showSizeChanger &&
                  data.paginationConfig.size !== SizeTypeEnum.Simple
                );
              },
              options: [
                { type: 'font', config: { disableTextAlign: true } },
                'border',
                { type: 'background', config: { disableBackgroundImage: true } }
              ],
              target: `.ant-select-selector`
            },
            {
              title: '条数选择标签',
              ifVisible({ data }: EditorResult<Data>) {
                return (
                  data.paginationConfig.showSizeChanger &&
                  data.paginationConfig.size !== SizeTypeEnum.Simple
                );
              },
              options: [
                { type: 'font', config: { disableTextAlign: true } },
                { type: 'background', config: { disableBackgroundImage: true } }
              ],
              global: true,
              target({ id }: EditorResult<Data>) {
                return `.{id} .ant-select-item:not(.ant-select-item-option-selected)`;
              }
            },
            {
              title: '跳转字体',
              ifVisible({ data }: EditorResult<Data>) {
                return (
                  data.paginationConfig.showQuickJumper &&
                  data.paginationConfig.size !== SizeTypeEnum.Simple
                );
              },
              options: [{ type: 'font', config: { disableTextAlign: true } }],
              target: `.ant-pagination-options-quick-jumper`
            },
            {
              title: '跳转输入框',
              ifVisible({ data }: EditorResult<Data>) {
                return (
                  data.paginationConfig.showQuickJumper &&
                  data.paginationConfig.size !== SizeTypeEnum.Simple
                );
              },
              options: [
                { type: 'font', config: { disableTextAlign: true } },
                'border',
                { type: 'background', config: { disableBackgroundImage: true } }
              ],
              target: `.ant-pagination-options-quick-jumper input`
            },
            {
              title: '跳转输入框',
              ifVisible({ data }: EditorResult<Data>) {
                return data.paginationConfig.size === SizeTypeEnum.Simple;
              },
              options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
              target: `.ant-pagination-simple .ant-pagination-simple-pager input`,
            }
          ]),
          ...catelogEditors('Hover', [
            {
              title: '页码',
              ifVisible({ data }: EditorResult<Data>) {
                return data.paginationConfig.size !== SizeTypeEnum.Simple;
              },
              options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
              target: `.ant-pagination-item:hover`,
              domTarget: '.ant-pagination-item'
            },
            {
              title: '页码字体',
              ifVisible({ data }: EditorResult<Data>) {
                return data.paginationConfig.size === SizeTypeEnum.Simple;
              },
              options: [{ type: 'font', config: { disableTextAlign: true } }],
              target: `.ant-pagination-simple .ant-pagination-simple-pager:hover`,
              domTarget: `.ant-pagination-simple .ant-pagination-simple-pager`
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
              target: `.ant-pagination-item:hover a`,
              domTarget: '.ant-pagination-item'
            },
            {
              title: '翻页按钮',
              options: [
                'font',
                'border',
                { type: 'background', config: { disableTextAlign: true } }
              ],
              target: `.ant-pagination li:not(.ant-pagination-disabled):hover button`,
              domTarget: '.ant-pagination li:not(.ant-pagination-disabled) button'
            },
            {
              title: '条数选择',
              ifVisible({ data }: EditorResult<Data>) {
                return (
                  data.paginationConfig.showSizeChanger &&
                  data.paginationConfig.size !== SizeTypeEnum.Simple
                );
              },
              options: [
                { type: 'font', config: { disableTextAlign: true } },
                'border',
                { type: 'background', config: { disableBackgroundImage: true } }
              ],
              target: `.ant-select-selector:hover`,
              domTarget: `.ant-select-selector`
            },
            {
              title: '条数选择标签',
              ifVisible({ data }: EditorResult<Data>) {
                return (
                  data.paginationConfig.showSizeChanger &&
                  data.paginationConfig.size !== SizeTypeEnum.Simple
                );
              },
              options: [
                { type: 'font', config: { disableTextAlign: true } },
                { type: 'background', config: { disableBackgroundImage: true } }
              ],
              global: true,
              target({ id }: EditorResult<Data>) {
                return `.{id} .ant-select-item:hover:not(.ant-select-item-option-selected)`;
              }
            },
            {
              title: '跳转输入框',
              ifVisible({ data }: EditorResult<Data>) {
                return data.paginationConfig.size === SizeTypeEnum.Simple;
              },
              options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
              target: `.ant-pagination-simple .ant-pagination-simple-pager input:hover`,
              domTarget: `.ant-pagination-simple .ant-pagination-simple-pager input`
            }
          ]),
          ...catelogEditors('激活', [
            {
              title: '页码',
              ifVisible({ data }: EditorResult<Data>) {
                return data.paginationConfig.size !== SizeTypeEnum.Simple;
              },
              options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
              target: `.ant-pagination-item.ant-pagination-item-active`
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
              target: `.ant-pagination-item.ant-pagination-item-active a`
            },
            {
              title: '条数选择',
              ifVisible({ data }: EditorResult<Data>) {
                return (
                  data.paginationConfig.showSizeChanger &&
                  data.paginationConfig.size !== SizeTypeEnum.Simple
                );
              },
              options: [
                { type: 'font', config: { disableTextAlign: true } },
                'border',
                { type: 'background', config: { disableBackgroundImage: true } },
                'BoxShadow'
              ],
              target: `.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector`
            },
            {
              title: '标签展开-条数选择',
              ifVisible({ data }: EditorResult<Data>) {
                return (
                  data.paginationConfig.showSizeChanger &&
                  data.paginationConfig.size !== SizeTypeEnum.Simple
                );
              },
              options: [
                { type: 'font', config: { disableTextAlign: true } },
              ],
              target: `.ant-select-single.ant-select-open .ant-select-selection-item`
            },
            {
              title: '条数选择标签',
              ifVisible({ data }: EditorResult<Data>) {
                return (
                  data.paginationConfig.showSizeChanger &&
                  data.paginationConfig.size !== SizeTypeEnum.Simple
                );
              },
              options: [
                { type: 'font', config: { disableTextAlign: true } },
                { type: 'background', config: { disableBackgroundImage: true } }
              ],
              global: true,
              target({ id }: EditorResult<Data>) {
                return `.{id} .ant-select-item-option-selected`;
              }
            },
            {
              title: '跳转输入框',
              ifVisible({ data }: EditorResult<Data>) {
                return data.paginationConfig.size !== SizeTypeEnum.Simple;
              },
              options: [
                { type: 'font', config: { disableTextAlign: true } },
                'border',
                { type: 'background', config: { disableBackgroundImage: true } },
                'BoxShadow',
              ],
              target: `.ant-pagination-options-quick-jumper input:focus`
            }
          ]),
          ...catelogEditors('禁用', [
            {
              title: '整体',
              ifVisible({ data }: EditorResult<Data>) {
                return data.paginationConfig.size !== SizeTypeEnum.Simple;
              },
              options: [{ type: 'background', config: { disableBackgroundImage: true } }],
              target: '.paginationDisable'
            },
            {
              title: '页码',
              ifVisible({ data }: EditorResult<Data>) {
                return data.paginationConfig.size !== SizeTypeEnum.Simple;
              },
              options: ['border', { type: 'background', config: { disableBackgroundImage: true } }],
              target: `.ant-pagination.ant-pagination-disabled .ant-pagination-item`
            },
            {
              title: '页码字体',
              ifVisible({ data }: EditorResult<Data>) {
                return data.paginationConfig.size === SizeTypeEnum.Simple;
              },
              options: [{ type: 'font', config: { disableTextAlign: true } }],
              target: `.ant-pagination.ant-pagination-disabled .ant-pagination-simple-pager`,
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
              target: `.ant-pagination.ant-pagination-disabled .ant-pagination-item a`
            },
            {
              title: '翻页按钮',
              options: [
                'font',
                'border',
                { type: 'background', config: { disableTextAlign: true } }
              ],
              target: `.ant-pagination-disabled > .ant-pagination-item-link`
            },
            {
              title: '前置文案字体',
              ifVisible({ data }: EditorResult<Data>) {
                return data.paginationConfig.size !== SizeTypeEnum.Simple;
              },
              options: [{ type: 'font', config: { disableTextAlign: true } }],
              target: `.ant-pagination-disabled .ant-pagination-total-text`
            },
            {
              title: '条数选择',
              ifVisible({ data }: EditorResult<Data>) {
                return (
                  data.paginationConfig.showSizeChanger &&
                  data.paginationConfig.size !== SizeTypeEnum.Simple
                );
              },
              options: [
                { type: 'font', config: { disableTextAlign: true } },
                'border',
                { type: 'background', config: { disableBackgroundImage: true } }
              ],
              target: `.ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector`
            },
            {
              title: '跳转字体',
              ifVisible({ data }: EditorResult<Data>) {
                return (
                  data.paginationConfig.showQuickJumper &&
                  data.paginationConfig.size !== SizeTypeEnum.Simple
                );
              },
              options: [{ type: 'font', config: { disableTextAlign: true } }],
              target: `.ant-pagination-disabled .ant-pagination-options-quick-jumper`
            },
            {
              title: '跳转输入框',
              ifVisible({ data }: EditorResult<Data>) {
                return (
                  data.paginationConfig.showQuickJumper &&
                  data.paginationConfig.size !== SizeTypeEnum.Simple
                );
              },
              options: [
                { type: 'font', config: { disableTextAlign: true } },
                'border',
                { type: 'background', config: { disableBackgroundImage: true } }
              ],
              target: `.ant-pagination-options-quick-jumper input[disabled]`
            },
            {
              title: '跳转输入框',
              ifVisible({ data }: EditorResult<Data>) {
                return (
                  data.paginationConfig.size === SizeTypeEnum.Simple
                );
              },
              options: [
                { type: 'font', config: { disableTextAlign: true } },
                'border',
                { type: 'background', config: { disableBackgroundImage: true } }
              ],
              target: `.ant-pagination-simple .ant-pagination-simple-pager input[disabled]`
            },
          ])
        ]
      }
    ]
  }
};
