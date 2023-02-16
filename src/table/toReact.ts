import { TableProps } from 'antd';
import { getObjectStr, getPropsFromObject, getClsStyle } from '../utils/toReact';
import { SizeTypeEnum } from './components/Paginator/constants';
import { InputIds, SlotIds } from './constants';
import { ContentTypeEnum, Data, FilterTypeEnum, IColumn, RowSelectionPostionEnum, RowSelectionTypeEnum, TableLayoutEnum, WidthTypeEnum } from './types';

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
  data.columns.map(item => {
    if (!item.dataIndex) item.dataIndex = item.title;
  });

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
        form: 'antd',
        coms: ['Table', 'Empty', 'Pagination', 'Button', 'Tooltip', 'Dropdown', 'Menu', 'Checkbox']
      },
      {
        form: '@ant-design/icons',
        coms: ['SettingOutlined']
      },
      {
        form: 'antd/dist/antd.css',
        coms: []
      }
    ],
    jsx: str,
    style: '',
    js: ''
  }
}

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
       * 获取批量操作区域codeStr
       * @returns codeStr
       */
      const getBatchBtnsStr = () => {
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

        if (useTopRowSelection) {
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
        }
        return ``;
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
                <div>${getBatchBtnsStr()}</div>
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
  const str = `<div
                ${getPropsFromObject(headerProps)}
                >
                ${tableTitleStr}
                ${getActionStr()}
              </div>`

  return str;
}

/**
 * 获取表格体codeStr
 * @param param0 RuntimeParams
 * @returns tableBodyStr
 */
function getTableBodyStr({ data, slots }: { data: Data, slots: any }) {
  const tableStyle = {
    width: data.tableLayout === TableLayoutEnum.FixedWidth ? getUseWidth(data) : '100%'
  }
  const tableScroll = {
    x: '100%',
    y: data.scroll.y ? data.scroll.y : void 0
  }
  const tableLayout = (data.tableLayout === TableLayoutEnum.FixedWidth
    ? TableLayoutEnum.Fixed
    : data.tableLayout) || TableLayoutEnum.Fixed;
  const rowSelection = '...ToDo...';

  const defaultDataSource = data.columns.map(item => ({ [item.title]: '-' + item.title + '-' }));

  /**
   * 获取表格列codeStr
   * @param cItem 列数据
   * @returns 列数据jsx字符串
   */
  const getColumnStr = (cItem: IColumn) => {
    const cellStyle = {
      color: cItem.contentColor
    }
    const headerCellStyle = {
      color: cItem.titleColor,
      backgroundColor: cItem.titleBgColor
    }
    const titleRenderStr = cItem.title;
    const columnProps: IColumn = {
      dataIndex: cItem.dataIndex,
      ellipsis: false,
      width: cItem.width === WidthTypeEnum.Auto ? void 0 : cItem.width,
      title: titleRenderStr,
      filterMultiple: cItem.filter?.filterType !== FilterTypeEnum.Single,
      render: () => {
        const { slotId, contentType } = cItem;
        switch (contentType) {
          case ContentTypeEnum.Text:
            return `(text, record, index) => {
                      return ${cItem.dataIndex || cItem.title ? 'text' : ''};
                    }`;
          case ContentTypeEnum.SlotItem:
            if (!slotId || !slots[slotId]?.render) {
              return 'null';
            }
            const slotStr = slots[slotId]?.render({})?.trim() || '<></>';
            return `(text, record, index) => {
                      return ${slotStr};
                    }`;
          default:
            return `(text, record, index) => {
                      return ${cItem.dataIndex || cItem.title ? 'text' : ''};
                    }`;
        }
      },
      showSorterTooltip: false,
      sortOrder: data?.sortParams?.id === cItem.dataIndex ? data?.sortParams?.order : void 0,
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
    return `<Table.Column
              ${getPropsFromObject(columnProps)}
            />`;
  };
  if (data.columns.length) {
    const { size, bordered, useRowSelection, showHeader } = data;
    const tableProps: TableProps<any> = {
      style: tableStyle,
      dataSource: defaultDataSource,
      size,
      bordered,
      pagination: false,
      // rowSelection:useRowSelection?rowSelection:void 0,
      showHeader,
      scroll: tableScroll,
      tableLayout
    };
    const str = `<Table
                  ${getPropsFromObject(tableProps)}
                  >
                  ${data.columns.map(getColumnStr).join('\n')}
                  </Table>`
    return str;
  }

  const emptyStyle = {
    border: '1px dashed rgb(176, 176, 176)',
    margin: 0
  };
  const emptyProps = {
    description: "请添加列",
    style: emptyStyle
  };
  return `<Empty 
            ${getPropsFromObject(emptyProps)}
          />`;
}

/**
 * 获取表格底部codeStr
 * @param param0 RuntimeParams
 * @returns tableFooterStr
 */
function getTableFooterStr({ data, slots }) {
  const {
    total,
    text,
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
    useBottomRowSelection,
    paginationConfig
  } = data;

  /**
   * 获取分页组件codeStr
   */
  const getPaginatorStr = () => {
    if (!data.usePagination) return ``;

    const paginationProps = {
      total: total,
      showTotal: () => {
        return `(total: number, range: number[]) => {
                  return \`共 \${total} 条结果\`;
                }`
      },
      current,
      pageSize: pageSize || defaultPageSize || 1,
      size: size === SizeTypeEnum.Simple ? SizeTypeEnum.Default : size,
      simple: size === SizeTypeEnum.Simple,
      showQuickJumper,
      showSizeChanger,
      pageSizeOptions,
      hideOnSinglePage: showSizeChanger ? false : hideOnSinglePage,
      // onChange:onChange,
      disabled
    }
    const paginationStyle = {
      display: 'flex',
      justifyContent: align,
    };
    const paginationContainerStyle = {
      display: 'flex',
      width: useBottomRowSelection ? void 0 : '100%',
      justifyContent: paginationConfig.align || 'space-between',
      flexShrink: 0
    };
    return `
    <div
      style={${getObjectStr(paginationContainerStyle)}}
    >
      <div
        style={${getObjectStr(paginationStyle)}}
      >
        <Pagination
          ${getPropsFromObject(paginationProps)}
        />
      </div>
    </div>`
  };

  const footerContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: (useBottomRowSelection || data.usePagination) ? '16px' : void 0
  };
  return `<div
            style={${getObjectStr(footerContainerStyle)}}
          >
            ${data.useBottomRowSelection ? '批量按钮' : ''}
            ${getPaginatorStr()}
          </div>`

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