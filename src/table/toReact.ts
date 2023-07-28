import { TableColumnProps, TableProps, TooltipProps } from 'antd';
import { CompareFn, TableRowSelection } from 'antd/es/table/interface';
import { getObjectStr, getPropsFromObject, getClsStyle } from '../utils/toReact';
import { SizeTypeEnum } from './components/Paginator/constants';
import { InputIds, SlotIds } from './constants';
import { AlignEnum, ContentTypeEnum, Data, FilterTypeEnum, IColumn, RowSelectionPostionEnum, RowSelectionTypeEnum, SorterTypeEnum, TableLayoutEnum, WidthTypeEnum } from './types';
import { formatColumnItemDataIndex } from './utils';

const cssVariables = {
  '@blue': '#0075ff',
  '@fontColor': '#8c8c8c',
  '@fontColor2': '#434343',
  '@bgColor': '#f5f7f9',
  '@fontSize': '14px',
  '@fontSize2': '18px'
};

export default function ({ data, slots }: RuntimeParams<Data>) {
  /**数据预处理 */
  let useMoment = false;
  data.columns.map(item => {
    if (!item.dataIndex) item.dataIndex = item.title;
    if (item.sorter?.enable && item.sorter?.type === SorterTypeEnum.Date) {
      useMoment = true;
    }
  });
  const defaultDeps = useMoment ? [{
    from: 'moment',
    default: 'moment'
  }] : [];


  const tableHeaderStr = getTableHeaderStr({ data, slots });
  const tableBodyStr = getTableBodyStr({ data, slots });
  const tableFooterStr = getTableFooterStr({ data, slots });

  const tableStyle = {
    style: {}
  };

  const str = `<div ${getPropsFromObject(tableStyle)}>
                ${tableHeaderStr}
                ${tableBodyStr}
                ${tableFooterStr}
              </div>`

  return {
    imports: [
      {
        from: 'antd',
        coms: ['Table', 'Pagination', 'Button', 'Tooltip', 'Dropdown', 'Menu', 'Checkbox']
      },
      {
        from: '@ant-design/icons',
        coms: ['SettingOutlined', 'InfoCircleOutlined']
      },
      {
        from: 'antd/dist/antd.css',
        coms: []
      },
      ...defaultDeps
    ],
    jsx: str,
    style: '',
    js: ''
  }
}

/**
 * 获取批量操作区域codeStr
 * @returns codeStr
 */
const getBatchBtnsStr = ({ data, slots }: { data: Data, slots: any }) => {
  const { useRowSelection, selectionType } = data;
  if (!useRowSelection || selectionType === RowSelectionTypeEnum.Radio) {
    return ``;
  }

  const isEmpty = slots[SlotIds.ROW_SELECTION_OPERATION]?.size === 0;

  // 样式相关
  const allCls = {
    blue: {
      color: cssVariables['@blue']
    },
    width100: {
      width: '100%'
    },
    flex: {
      display: 'flex',
    },
    selectedWrap: {
      display: 'flex',
    },
    selectedInfo: {
      display: 'flex',
      alignItems: 'center',
      fontSize: cssVariables['@fontSize'],
      color: cssVariables['@fontColor'],
      background: cssVariables['@bgColor'],
      padding: '6px 12px',
      borderRadius: '4px',
      marginLeft: '8px',
      whiteSpace: 'nowrap'
    },
    emptyWrap: {
      minWidth: '100px'
    }
  };
  const css = {
    blue: 'blue',
    width100: 'width100',
    flex: 'flex',
    selectedWrap: 'selectedWrap',
    selectedInfo: 'selectedInfo',
    emptyWrap: 'emptyWrap'
  };

  return `<div ${getPropsFromObject({
    style: {
      ...getClsStyle(allCls, [
        css.width100
      ])
    }
  })}>
              <div ${getPropsFromObject({
    style: {
      ...getClsStyle(allCls, [
        css.flex
      ])
    }
  })}>
                <div ${getPropsFromObject({
    style: {
      ...getClsStyle(allCls, [
        css.selectedWrap
      ])
    }
  })}>
                  <div ${getPropsFromObject({
    style: {
      ...getClsStyle(allCls, [
        isEmpty && css.emptyWrap
      ])
    }
  })}>
                    ${slots[SlotIds.ROW_SELECTION_OPERATION].render({})}
                  </div>
                  <div ${getPropsFromObject({
    style: {
      ...getClsStyle(allCls, [
        css.selectedInfo
      ])
    }
  })}>
                    已选中
                    <span ${getPropsFromObject({
    style: {
      marginLeft: 2
    }
  })}>0</span>
                    <span
                    ${getPropsFromObject({
    style: {
      ...getClsStyle(allCls, [
        css.blue
      ]),
      marginLeft: 2,
      marginRight: data.rowSelectionLimit ? 0 : 2
    }
  })}
                    >
                    </span>
                    项
                  </div>
                </div>
              </div>
            </div>`
};

/**
 * 获取表格头codeStr
 * @param param0 RuntimeParams
 * @returns tableHeaderStr
 */
function getTableHeaderStr({ data, slots }: { data: Data, slots: any }) {
  const { useHeaderTitleSlot, useHeaderOperationSlot, useColumnSetting, useRowSelection, selectionType, rowSelectionPostion } = data;

  // 顶部显示批量操作按钮
  const useTopRowSelection =
    useRowSelection &&
    selectionType !== RowSelectionTypeEnum.Radio &&
    (rowSelectionPostion || []).includes(RowSelectionPostionEnum.TOP);

  // 样式相关
  const allCls = {
    headerContainer: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    marginBottom: {
      marginBottom: '16px'
    },
    flex: {
      display: 'flex'
    },
    flexRowReverse: {
      flexDirection: 'row-reverse'
    },
    flexDirectionColumn: {
      flexDirection: 'column'
    },
    width100: {
      width: '100%'
    },
    actionBtnsWrap: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    emptyWrap: {
      minWidth: '100px'
    }
  };
  const css = {
    headerContainer: 'headerContainer',
    flexDirectionColumn: 'flexDirectionColumn',
    marginBottom: 'marginBottom',
    actionBtnsWrap: 'actionBtnsWrap',
    width100: 'width100',
    flex: 'flex',
    flexRowReverse: 'flexRowReverse',
  };

  const headerProps = {
    style: {
      ...getClsStyle(allCls, [
        css.headerContainer,
        useTopRowSelection && css.flexDirectionColumn,
        (useTopRowSelection
          || useHeaderTitleSlot
          || useHeaderOperationSlot
          || useColumnSetting)
        && css.marginBottom
      ])
    }
  };

  const tableTitleStr =
    (useHeaderTitleSlot && slots[SlotIds.HEADER_TITLE])
      ? slots[SlotIds.HEADER_TITLE].render()?.trim()
      : '';
  const getActionStr = () => {
    if (useTopRowSelection || useHeaderOperationSlot || useColumnSetting) {
      const actionWrapProps = {
        style: {
          ...getClsStyle(allCls, [
            css.actionBtnsWrap,
            css.width100
          ])
        }
      };
      const rightActionWrapProps = {
        style: {
          ...getClsStyle(allCls, [
            css.width100,
            css.flex,
            css.flexRowReverse
          ])
        }
      };

      /**
       * 获取右上角操作区域codeStr
       * @returns codeStr
       */
      const getTableBtnsStr = () => {
        if ((useHeaderOperationSlot && slots[SlotIds.HEADER_OPERATION])) {
          const isEmpty = slots[SlotIds.HEADER_OPERATION].size === 0;
          const cfg = {
            style: {
              minWidth: isEmpty ? '100px' : void 0
            }
          };
          return `<div ${getPropsFromObject(cfg)}>
                    ${slots[SlotIds.HEADER_OPERATION].render({})}
                  </div>`;
        }
        return '';
      };
      /**
       * 获取筛选操作区codeStr
       * @returns codeStr
       */
      const getTableFilterStr = () => {
        if (!useColumnSetting) {
          return '';
        }
        const genElements = (values) => {
          if (!values) {
            return null;
          }
          return values.map((ele) => {
            ele.defaultChecked = true;
            return addEle(ele.key, ele.title, ele.defaultChecked, ele.fun, ele.checkFun);
          });
        };

        const addEle = (key: any, val: any, defaultChecked: any, fun: any, checkFun: any) => {
          const checkboxProps = {
            defaultChecked: true,
            // onChange: fun,
            // checked: checkFun
          };
          return `<Menu.Item>
                    <Checkbox ${getPropsFromObject(checkboxProps)}>
                      ${val}
                    </Checkbox>
                  </Menu.Item>`;
        };

        const menu = () => {
          const checkboxAllProps = {
            defaultChecked: true,
            indeterminate: false,
            // onChange: func,
            // checked: checkAll,
          };
          return `<Menu>
                    <Menu.Item>
                      <Checkbox
                        ${getPropsFromObject(checkboxAllProps)}
                      >
                        列展示
                      </Checkbox>
                    </Menu.Item>
                    <Menu.Divider />
                    ${genElements(data.columns).join('\n')}
                  </Menu>`;
        };
        const dropDownProps = {
          overlay: menu,
          placement: "bottomRight",
          arrow: true,
          // onVisibleChange: handleVisibleChange,
          // visible: visibleChange.visible,
          trigger: ['click']
        };
        return `<div style={{ paddingLeft: '12px' }}>
                  <Tooltip title="列设置">
                    <Dropdown
                      ${getPropsFromObject(dropDownProps)}
                    >
                      <Button icon={<SettingOutlined />}></Button>
                    </Dropdown>
                  </Tooltip>
                </div>`
      };

      return `<div ${getPropsFromObject(actionWrapProps)}>
                {/* 顶部操作按钮 */}
                <div>${useTopRowSelection && getBatchBtnsStr({ data, slots })}</div>
                <div ${getPropsFromObject(rightActionWrapProps)}>
                  {/* 工作区tools */}
                  <div>
                    ${getTableFilterStr()}
                  </div>
                  {/* 操作按钮 */}
                  ${getTableBtnsStr()}
                </div>
              </div>`
    }
    return '';
  };
  const actionStr = getActionStr();
  const str = (tableTitleStr || actionStr) ? `<div
                ${getPropsFromObject(headerProps)}
                >
                ${tableTitleStr}
                ${actionStr}
              </div>`: '';

  return str;
}

/**
 * 获取表格体codeStr
 * @param param0 RuntimeParams
 * @returns tableBodyStr
 */
function getTableBodyStr({ data, slots }: { data: Data, slots: any }) {
  const { tableLayout, loadingTip, columns, sortParams, filterParams } = data;


  const defaultDataSource = data.columns.map((item, inx) => {
    const dataIndex = item.dataIndex ?
      (
        Array.isArray(item.dataIndex) ?
          item.dataIndex.join('.')
          : item.dataIndex
      )
      : item.title;
    return { [dataIndex]: '-' + item.title + '-', 'key': dataIndex }
  });

  /**
   * 获取表格列codeStr
   * @param cItem 列数据
   * @returns 列数据jsx字符串
   */
  const getColumnStr = (cItem: IColumn) => {
    const { children, contentColor, dataIndex, titleColor, titleBgColor, title, tip, hasTip, contentType, width, align, filter, slotId, fixed } = cItem;
    const cellStyle = {
      color: contentColor
    };
    const headerCellStyle = {
      color: titleColor,
      backgroundColor: titleBgColor
    };

    // 表头标题
    const getTitleRenderStr = () => {
      if (hasTip) {
        const titleProps = {
          style: { marginRight: '6px' }
        };
        const tooltipProps: TooltipProps = {
          placement: 'topLeft',
          title: tip,
          // overlayClassName: css.ellipsisTooltip
        };
        return () => `<div>
                      <span ${getPropsFromObject(titleProps)}>${title}</span>
                      <Tooltip ${getPropsFromObject(tooltipProps)}>
                        <InfoCircleOutlined />
                      </Tooltip>
                    </div>`
      }
      return title;
    };

    // 分组列
    if (children && contentType === ContentTypeEnum.Group) {
      const columnGroupProps = {
        title: getTitleRenderStr(),
        align: align || AlignEnum.Left,
        onHeaderCell: () => {
          if (!titleBgColor && !titleColor) return '';
          return `(): any => {
                    return {
                      style: ${getObjectStr(headerCellStyle)}
                    };
                  }`
        }
      };
      return `<Table.ColumnGroup
                ${getPropsFromObject(columnGroupProps)}
              >
                <>${children.map((item) => getColumnStr(item)).join('\n')}</>
              </Table.ColumnGroup>`
    };

    // 排序
    let sorter: boolean | CompareFn<any> | undefined;
    if (cItem.sorter?.enable) {
      switch (cItem.sorter.type) {
        case SorterTypeEnum.Length:
          sorter = () => {
            return `(a, b) => {
                      const aVal = a['${cItem.dataIndex}'];
                      const bVal = b['${cItem.dataIndex}'];
                      if (typeof aVal !== 'string' || typeof bVal !== 'string') {
                        return 0;
                      }
                      return aVal.length - bVal.length;
                    }`
          };
          break;
        case SorterTypeEnum.Size:
          sorter = () => {
            return `(a, b) => {
                      const aVal = a['${cItem.dataIndex}'];
                      const bVal = b['${cItem.dataIndex}'];
                      if (typeof aVal !== 'number' || typeof bVal !== 'number') {
                        return 0;
                      }
                      return aVal - bVal;
                    }`
          };
          break;
        case SorterTypeEnum.Date:
          sorter = () => {
            return `(a, b) => {
                      const aVal = a['${cItem.dataIndex}'];
                      const bVal = b['${cItem.dataIndex}'];
                      if (!aVal || !bVal) {
                        return 0;
                      }
                      return moment(aVal).valueOf() - moment(bVal).valueOf();
                    }`
          }
          break;
        default:
          sorter = true;
          break;
      }
    }

    // 筛选
    let filterMap = {};
    const useFilter = cItem.filter?.enable && cItem.filter?.filterSource !== FilterTypeEnum.Request;
    columns.forEach((cItem) => {
      if (!cItem.dataIndex && cItem.title) {
        cItem.dataIndex = formatColumnItemDataIndex(cItem);
      }
      const dataIndex = Array.isArray(cItem.dataIndex)
        ? cItem.dataIndex.join('.')
        : cItem.dataIndex;
      if (useFilter) {
        filterMap[dataIndex] = cItem.filter?.options || [];
      }
    });
    const onFilter =
      useFilter
        ? () => {
          return `(value, record) => {
                    return record['${cItem.dataIndex}'] == value;
                  }`
        }
        : null;

    // 列Props对象
    const columnProps: IColumn = {
      dataIndex: dataIndex,
      fixed: fixed ? fixed : false,
      ellipsis: false,
      width: width === WidthTypeEnum.Auto ? void 0 : width,
      title: getTitleRenderStr(),
      filterMultiple: filter?.filterType !== FilterTypeEnum.Single,
      render: () => {
        switch (contentType) {
          case ContentTypeEnum.Text:
            return ``;
          case ContentTypeEnum.SlotItem:
            if (!slotId || !slots[slotId]?.render) {
              return '';
            }
            const slotStr = slots[slotId]?.render({})?.trim() || '<></>';
            return `(text, record, index) => {
                      return ${slotStr};
                    }`;
          default:
            return `(text, record, index) => {
                      return ${dataIndex || title ? 'text' : ''};
                    }`;
        }
      },
      showSorterTooltip: false,
      sortOrder: sortParams?.id === cItem.dataIndex ? sortParams?.order : void 0,
      sorter,
      filters: filterMap[`${cItem.dataIndex}`]?.map((item) => ({
        text: item.text,
        value: item.value
      })),
      filteredValue: filterParams?.[`${cItem.dataIndex}`] || null,
      onFilter: onFilter,
      onCell: () => {
        return `() => {
                  return {
                    style: ${getObjectStr(cellStyle)}
                  };
                }`
      },
      onHeaderCell: () => {
        return `(): any => {
                  return {
                    style: ${getObjectStr(headerCellStyle)}
                  };
                }`
      }
    };
    // 列默认props
    const defaultColumnProps: TableColumnProps<IColumn> = {
      fixed: false,
      ellipsis: false,
      filterMultiple: true,
      showSorterTooltip: true,
      onCell: () => {
        return `() => {
                  return {
                    style: {}
                  };
                }`;
      },
      onHeaderCell: () => {
        return `(): any => {
                  return {
                    style: {}
                  };
                }`
      }
    };

    return `<Table.Column
              ${getPropsFromObject(columnProps, defaultColumnProps)}
            />`;
  };

  const { size, bordered, useRowSelection, showHeader, selectionType, useExpand, scroll, fixedHeader } = data;
  const rowKey = data.rowKey?.trim() || 'key';
  // 勾选配置
  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys: [],
    preserveSelectedRowKeys: true,
    onChange: () => {
      return `(selectedRowKeys: any[], selectedRows: any[]) => {}`
    },
    type:
      selectionType === RowSelectionTypeEnum.Radio
        ? RowSelectionTypeEnum.Radio
        : RowSelectionTypeEnum.Checkbox,
    getCheckboxProps: () => {
      return `(record) => null as any`
    }
  };
  // 表格默认props
  const defaultTableProps: TableProps<any> = {
    loading: false,
    rowKey: 'key',
    size: 'default',
    bordered: false,
    showHeader: true,
  };
  // 表格props
  const tableProps: TableProps<any> = {
    style: {
      width: tableLayout === TableLayoutEnum.FixedWidth ? getUseWidth(data) : '100%'
    },
    dataSource: defaultDataSource,
    loading: loadingTip ? {
      tip: loadingTip,
      spinning: false
    } : false,
    rowKey,
    size,
    bordered,
    pagination: false,
    rowSelection: useRowSelection ? rowSelection : void 0,
    showHeader,
    scroll: {
      x: '100%',
      y: (scroll.y && fixedHeader) ? scroll.y : void 0
    },
    expandable:
      useExpand && slots[SlotIds.EXPAND_CONTENT]
        ? () => `{
            expandedRowRender: (record, index) => {
              return ${slots[SlotIds.EXPAND_CONTENT].render({})};
            }
          }`
        : void 0
    ,
    // onChange: onChange,
    // 列宽分配
    tableLayout: (tableLayout === TableLayoutEnum.FixedWidth
      ? TableLayoutEnum.Fixed
      : tableLayout)
  };

  return `<Table
          ${getPropsFromObject(tableProps, defaultTableProps)}
          >
          ${data.columns.map(getColumnStr).join('\n')}
          </Table>`
}

/**
 * 获取表格底部codeStr
 * @param param0 RuntimeParams
 * @returns tableFooterStr
 */
function getTableFooterStr({ data, slots }) {
  const {
    usePagination,
    useRowSelection,
    selectionType,
    rowSelectionPostion,
    paginationConfig
  } = data;

  const useBottomRowSelection =
    useRowSelection &&
    selectionType !== RowSelectionTypeEnum.Radio &&
    (rowSelectionPostion || []).includes(RowSelectionPostionEnum.BOTTOM);

  // 样式文件相关
  const allCls = {
    footerContainer: {
      display: "flex",
      justifyContent: 'space-between',
      width: '100%',
    },
    pagination: {
      display: 'flex',
      flexShrink: 0
    },
    marginTop: {
      marginTop: '16px'
    }
  };
  const css = {
    footerContainer: 'footerContainer',
    pagination: 'pagination',
    marginTop: 'marginTop',
  };

  /**
   * 获取分页器codeStr
   */
  const getPaginatorStr = () => {
    const {
      text,
      total,
      current,
      disabled,
      pageSize,
      defaultPageSize,
      size,
      align,
      showQuickJumper,
      showSizeChanger,
      pageSizeOptions,
      hideOnSinglePage,
    } = data.paginationConfig;

    const paginationWrapProps = {
      style: {
        display: 'flex',
        justifyContent: align
      }
    };
    // 分页器默认props
    const defaultPaginationProps = {
      total: 0,
      size: 'default',
      simple: false,
      showQuickJumper: false,
      pageSizeOptions: ["10", "20", "50", "100"],
      hideOnSinglePage: false,
      disabled: false
    };
    // 分页器props
    const paginationProps = {
      total: total,
      showTotal: () => {
        return `(total: number, range: number[]) => {
                  const res =  '${text}'.replace(/\{([^\{\}]*?)\}/g, (match, key) => {
                    switch (key?.trim?.()) {
                      case 'total':
                        return total;
                      case 'start':
                        return range[0];
                      case 'end':
                        return range[1];
                      default:
                        return key;
                    }
                  })
                  return res;
                }`
      },
      current,
      pageSize: pageSize || defaultPageSize || 1,
      size: size === SizeTypeEnum.Small ? "small" : void 0,
      simple: size === SizeTypeEnum.Simple,
      showQuickJumper,
      showSizeChanger,
      pageSizeOptions,
      hideOnSinglePage: showSizeChanger ? false : hideOnSinglePage,
      // onChange:onChange,
      disabled
    };

    return `
      <div
        ${getPropsFromObject(paginationWrapProps)}
      >
        <Pagination
          ${getPropsFromObject(paginationProps, defaultPaginationProps)}
        />
      </div>`
  };

  const footerWrapProps = {
    style: {
      ...getClsStyle(allCls, [css.footerContainer, (useBottomRowSelection || usePagination) && css.marginTop])
    }
  };
  const paginationWrapProps = {
    style: {
      ...getClsStyle(allCls, [css.pagination]),
      width: useBottomRowSelection ? '' : '100%',
      justifyContent: paginationConfig.align
    }
  };

  return (useBottomRowSelection || usePagination) ? `<div
            ${getPropsFromObject(footerWrapProps)}
          >
            ${useBottomRowSelection ? getBatchBtnsStr({ data, slots }) : ''}
            ${usePagination ? `<div
                ${getPropsFromObject(paginationWrapProps)}
              >
                ${getPaginatorStr()}
              </div>`: ''}
          </div>`: '';
}

// 获取表格显示列宽度和
const getUseWidth = (data) => {
  let hasAuto, width;
  const getWidth = (list: IColumn[]) => {
    let count = 0;
    list.forEach((item) => {
      if (!item.visible || hasAuto) {
        return;
      }
      if (item.width === WidthTypeEnum.Auto && item.contentType !== ContentTypeEnum.Group) {
        hasAuto = true;
        return;
      }
      if (item.contentType === ContentTypeEnum.Group && item.children?.length) {
        count = count + getWidth(item.children);
      } else {
        count = count + (+(item.width || 0) || 0);
      }
    });
    return count;
  };
  width = getWidth(data.columns);
  // 当任意列为自适应时，宽度为100%
  return hasAuto ? '100%' : width;
};