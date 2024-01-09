import { defineDataSet } from 'ai-dataset';
import { SizeEnum, TableLayoutEnum } from './types';

export default defineDataSet((utils) => {
  const result = {};

  result['显示列头'] = [
    {
      Q: `显示列头（显示列标题行）`,
      A: {
        data: {
          showHeader: true
        }
      }
    }
  ];

  const tableLayoutOptions = [
    { label: '固定列宽(不自动适配)', value: TableLayoutEnum.FixedWidth },
    { label: '按比例分配多余宽度', value: TableLayoutEnum.Fixed },
    { label: '按比例适配（无横向滚动条）', value: TableLayoutEnum.Auto }
  ];
  result['列宽分配'] = tableLayoutOptions.map((item) => ({
    Q: `列宽分配：${item.label}`,
    A: {
      data: {
        tableLayout: item.value
      }
    }
  }));

  result['列'] = [
    {
      Q: `添加两列，分别是姓名和性别，其中，性别要适应剩余宽度`,
      A: {
        data: {
          columns: [
            {
              title: '姓名',
              dataIndex: 'name',
              isAutoWidth: false,
              width: 140
            },
            {
              title: '性别',
              dataIndex: 'sex',
              isAutoWidth: true
            }
          ]
        }
      }
    },
    {
      Q: `添加一列，列名为A，字段为a，展示类型为普通文字，需要进行空值处理，列数据类型为字符串，开启内容省略展示（内容超出宽度后文本自动省略、不换行、以省略号结尾），自适应剩余宽度，将该列左固定，提示文案设置为abc`,
      A: {
        data: {
          columns: [
            {
              title: 'A',
              dataIndex: 'a',
              contentType: 'text',
              formatData: {
                formatterName: 'KEYMAP'
              },
              dataSchema: {
                type: 'string'
              },
              ellipsis: true,
              width: 'auto',
              fixed: 'left',
              hasTip: true,
              tip: 'abc'
            }
          ]
        }
      }
    },
    {
      Q: `添加一列，列名为B，字段为v，展示类型为普通文字，将日期格式化为时间戳，列数据类型为数字，开启内容省略展示（内容超出宽度后文本自动省略、不换行、以省略号结尾），宽度设置为200px`,
      A: {
        data: {
          columns: [
            {
              title: 'B',
              dataIndex: 'v',
              contentType: 'text',
              formatData: {
                formatterName: 'TIMETEMPLATE',
                values: {
                  TIMETEMPLATE: 'YYYY-MM-DD HH:mm:ss'
                }
              },
              dataSchema: {
                type: 'number'
              },
              ellipsis: true,
              width: '200'
            }
          ]
        }
      }
    },
    {
      Q: `添加一列用于展示总金额，将该列右固定，并按照数字大小排序`,
      A: {
        data: {
          columns: [
            {
              title: '总金额',
              dataIndex: 'totalAmount',
              contentType: 'text',
              formatData: {
                formatterName: 'EXPRESSION',
                values: {
                  TIMETEMPLATE: '￥{value}'
                }
              },
              dataSchema: {
                type: 'number'
              },
              fixed: 'right',
              sorter: {
                enable: true,
                type: 'size'
              }
            }
          ]
        }
      }
    }
  ];

  result['分页模式'] = [
    {
      Q: `打开分页`,
      A: {
        data: {
          usePagination: true
        }
      }
    }
  ];

  const rowKey = utils.string.alpha(5);
  result['行标识字段'] = [
    {
      Q: `将行标识字段设置为${rowKey}`,
      A: {
        data: {
          rowKey: rowKey
        }
      }
    }
  ];

  result['动态设置loading'] = [
    {
      Q: `动态设置loading`,
      A: {
        data: {
          useLoading: true
        }
      }
    }
  ];

  result['自定义loading文案'] = [
    {
      Q: `将loading文案设置为abc`,
      A: {
        data: {
          useLoading: true,
          loadingTip: 'abc'
        }
      }
    }
  ];

  result['自定义空白状态'] = [
    {
      Q: `自定义空白状态`,
      A: {
        data: {
          isEmpty: true
        }
      }
    }
  ];

  result['图片地址'] = [
    {
      Q: `将图片地址设置为http://www.baidu.com`,
      A: {
        data: {
          isEmpty: true,
          image: 'http://www.baidu.com'
        }
      }
    }
  ];

  result['空状态文案'] = [
    {
      Q: `将空状态文案设置为abc`,
      A: {
        data: {
          isEmpty: true,
          description: 'abc'
        }
      }
    }
  ];

  result['标题区插槽'] = [
    {
      Q: `自定义标题区`,
      A: {
        data: {
          useHeaderTitleSlot: true
        }
      }
    }
  ];

  result['操作区插槽'] = [
    {
      Q: `自定义操作区`,
      A: {
        data: {
          useHeaderOperationSlot: true
        }
      }
    }
  ];

  result['列设置按钮'] = [
    {
      Q: `显示列设置按钮，用于调整展示列`,
      A: {
        data: {
          useColumnSetting: true
        }
      }
    }
  ];

  result['表格行展开'] = [
    {
      Q: `开启表格行展开功能`,
      A: {
        data: {
          useExpand: true
        }
      }
    }
  ];

  result['默认展开'] = [
    {
      Q: `默认展开每一行数据`,
      A: {
        data: {
          useExpand: true,
          defaultExpandAllRows: true
        }
      }
    }
  ];

  result['展开字段'] = [
    {
      Q: `将abc设置为展开字段`,
      A: {
        data: {
          useExpand: true,
          expandDataIndex: 'abc'
        }
      }
    }
  ];

  result['数据类型'] = [
    {
      Q: `将展开字段的数据类型设置为字符串`,
      A: {
        data: {
          useExpand: true,
          expandDataSchema: { type: 'string' }
        }
      }
    }
  ];

  result['数据类型'] = [
    {
      Q: `将展开字段的数据类型设置为字符串`,
      A: {
        data: {
          useExpand: true,
          expandDataSchema: { type: 'string' }
        }
      }
    }
  ];

  result['选中行高亮'] = [
    {
      Q: `开启选中行高亮`,
      A: {
        data: {
          enableRowFocus: true
        }
      }
    }
  ];

  result['高亮颜色'] = [
    {
      Q: `将选中行的高亮颜色设置为蓝色`,
      A: {
        data: {
          enableRowFocus: true,
          focusRowStyle: {
            background: '#0000FF'
          }
        }
      }
    }
  ];

  result['开启行合并设置'] = [
    {
      Q: `开启行合并功能`,
      A: {
        data: {
          enbaleRowMerge: true
        }
      }
    }
  ];

  result['指定合并行所依赖的字段'] = [
    {
      Q: `将合并行所依赖的字段设置为abc`,
      A: {
        data: {
          enbaleRowMerge: true,
          rowMergeConfig: {
            mergeByField: 'abc'
          }
        }
      }
    }
  ];

  result['不能被合并的字段'] = [
    {
      Q: `将不能被合并的字段设置为a和b`,
      A: {
        data: {
          enbaleRowMerge: true,
          rowMergeConfig: {
            excludeFields: ['a', 'b']
          }
        }
      }
    }
  ];

  result['表格数据懒加载'] = [
    {
      Q: `开启表格数据懒加载（初始只加载部分数据，滚动条接近底部时再多加载一部分数据，直到全部数据加载完（表格需要有滚动条才能生效））`,
      A: {
        data: {
          lazyLoad: true
        }
      }
    }
  ];

  result['自动滚动到首行'] = [
    {
      Q: `开启自动滚动到首行（当分页、排序、筛选变化后是否滚动到表格顶部）`,
      A: {
        data: {
          scroll: {
            scrollToFirstRowOnChange: true
          }
        }
      }
    }
  ];

  result['总结栏'] = [
    {
      Q: `开启总结栏（开启后，支持设置总结栏, 双击表格最后一行进行配置）`,
      A: {
        data: {
          useSummaryColumn: true
        }
      }
    }
  ];

  result['动态设置显示列'] = [
    {
      Q: `开启动态设置显示列（开启后，支持通过逻辑连线 传入显示列对应字段列表）`,
      A: {
        data: {
          useSummaryColumn: true
        }
      }
    }
  ];

  result['动态设置表头'] = [
    {
      Q: `开启动态设置表头（开启后, 支持通过逻辑连线, 动态设置表格标题、字段和宽度）`,
      A: {
        data: {
          useDynamicTitle: true
        }
      }
    }
  ];

  result['动态修改列属性'] = [
    {
      Q: `开启动态修改列属性（开启后, 支持通过逻辑连线, 动态修改已有列的显隐、标题、字段和宽度）`,
      A: {
        data: {
          enableDynamicChangeCols: true
        }
      }
    }
  ];

  result['勾选'] = [
    {
      Q: `开启勾选功能`,
      A: {
        data: {
          useRowSelection: true
        }
      }
    }
  ];

  result['勾选类型'] = [
    {
      Q: `将勾选类型设置为单选`,
      A: {
        data: {
          useRowSelection: true,
          selectionType: 'radio'
        }
      }
    },
    {
      Q: `将勾选类型设置为批量选择`,
      A: {
        data: {
          useRowSelection: true,
          selectionType: 'checkbox'
        }
      }
    }
  ];

  result['勾选限制'] = [
    {
      Q: `设置最多勾选5条`,
      A: {
        data: {
          useRowSelection: true,
          selectionType: 'checkbox',
          rowSelectionLimit: 5
        }
      }
    }
  ];

  result['行点击触发勾选'] = [
    {
      Q: `行点击触发勾选`,
      A: {
        data: {
          useRowSelection: true,
          enableRowClickSelection: true
        }
      }
    }
  ];

  result['顶部勾选操作区显示'] = [
    {
      Q: `显示顶部勾选操作区`,
      A: {
        data: {
          useRowSelection: true,
          rowSelectionPostion: ['top']
        }
      }
    }
  ];

  result['底部勾选操作区显示'] = [
    {
      Q: `显示底部勾选操作区`,
      A: {
        data: {
          useRowSelection: true,
          rowSelectionPostion: ['bottom']
        }
      }
    }
  ];

  result['合并勾选栏'] = [
    {
      Q: `合并勾选栏（合并后,勾选会输出合并前的多项数据）`,
      A: {
        data: {
          useRowSelection: true,
          enbaleRowMerge: true,
          mergeCheckboxColumn: true
        }
      }
    }
  ];

  result['禁止勾选'] = [
    {
      Q: `禁止a>1的行被勾选`,
      A: {
        data: {
          useRowSelection: true,
          isDisabledScript: '{a} > 1'
        }
      }
    }
  ];

  result['动态设置勾选项'] = [
    {
      Q: `动态设置勾选项`,
      A: {
        data: {
          useRowSelection: true,
          useSetSelectedRowKeys: true
        }
      }
    }
  ];

  const sizeOptions = [
    { value: SizeEnum.Default, label: '默认' },
    { value: SizeEnum.Middle, label: '适中布局' },
    { value: SizeEnum.Small, label: '紧凑布局' }
  ];
  result['布局风格'] = sizeOptions.map((item) => ({
    Q: `将布局风格设置为${item.label}`,
    A: {
      data: {
        size: item.value
      }
    }
  }));

  result['显示边框'] = [
    {
      Q: `显示边框`,
      A: {
        data: {
          bordered: true
        }
      }
    }
  ];

  result['固定表头'] = [
    {
      Q: `固定表头`,
      A: {
        data: {
          fixedHeader: true
        },
        style: {
          height: 'auto'
        }
      }
    }
  ];

  result['可滚动最大高度'] = [
    {
      Q: `将可滚动最大高度设置为50`,
      A: {
        data: {
          fixedHeader: true,
          scroll: {
            y: '50px'
          }
        },
        style: {
          height: 'auto'
        }
      }
    }
  ];

  result['固定高度'] = [
    {
      Q: `将固定高度设置为70`,
      A: {
        data: {
          fixedHeader: true,
          fixedHeight: '70px'
        },
        style: {
          height: 'auto'
        }
      }
    }
  ];

  result['开启斑马纹'] = [
    {
      Q: `开启斑马纹（配置表格的单双行为不同样式）`,
      A: {
        data: {
          enableStripe: true
        }
      }
    }
  ];

  result['单元格选中状态'] = [
    {
      Q: `开启单元格选中状态`,
      A: {
        data: {
          enableCellFocus: true
        }
      }
    }
  ];

  result['单元格选中状态'] = [
    {
      Q: `开启单元格选中状态`,
      A: {
        data: {
          enableCellFocus: true
        }
      }
    }
  ];

  result['单元格选中状态'] = [
    {
      Q: `开启单元格选中状态`,
      A: {
        data: {
          enableCellFocus: true
        }
      }
    }
  ];

  return result;
});
