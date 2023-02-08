import React from 'react';
import { typeCheck } from '../utils';
import { SizeTypeEnum } from './components/Paginator/constants';
import { ContentTypeEnum, Data, FilterTypeEnum, IColumn, RowSelectionPostionEnum, RowSelectionTypeEnum, TableLayoutEnum, WidthTypeEnum } from './types';

export default function ({ data, slots }: RuntimeParams<Data>) {
  const tableHeaderStr = getTableHeaderStr({ data, slots });
  const tableBodyStr = getTableBodyStr({ data, slots });
  const tableFooterStr = getTableFooterStr({ data, slots });

  const tableCls = {
  };

  const str = `<div style={${getObjectStr(tableCls)}}>
                ${tableHeaderStr}
                ${tableBodyStr}
                ${tableFooterStr}
              </div>`

  return {
    imports: [
      {
        form: 'antd',
        coms: ['Table', 'Empty', 'Pagination']
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

function getTableHeaderStr({ data, slots }: { data: Data, slots: any }) {
  const { useHeaderTitleSlot, useHeaderOperationSlot, useColumnSetting } = data;
  // 顶部显示批量操作按钮
  const useTopRowSelection =
    data.useRowSelection &&
    data.selectionType !== RowSelectionTypeEnum.Radio &&
    (data.rowSelectionPostion || []).includes(RowSelectionPostionEnum.TOP);

  const style = {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: useTopRowSelection ? 'column' : void 0,
    marginBottom: (useTopRowSelection ||
      useHeaderTitleSlot ||
      useHeaderOperationSlot ||
      useColumnSetting) ? '16px' : void 0,
  }
  const str = `<div
                style = {${getObjectStr(style)}}
                >
                
              </div>`

  return str;
}

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

    return `<Table.Column
              key = "${cItem.dataIndex || cItem.title}"
              ellipsis = {false}
              width = "${cItem.width === WidthTypeEnum.Auto ? '' : cItem.width}"
              title = "${titleRenderStr}"
              filterMultiple = {${cItem.filter?.filterType !== FilterTypeEnum.Single}}
              render = {() => <></>}
              showSorterTooltip = {false}
              ${data?.sortParams?.id === cItem.dataIndex ? `sortOrder = ${data?.sortParams?.order}` : ""}
              onCell = {() => {
                return {
                  style: ${getObjectStr(cellStyle)}
                };
              }}
              onHeaderCell = {(): any => {
                return {
                  style: ${getObjectStr(headerCellStyle)}
              };
                  }}
            />`;
  };
  if (data.columns.length) {
    const str = `<Table
                  style={
                    ${getObjectStr(tableStyle)}
                  }
                  dataSource={[]}
                  size="${data.size as any}"
                  bordered={${data.bordered}}
                  pagination={false}
                  ${data.useRowSelection ? rowSelection : ''}
                  showHeader={${data.showHeader}}
                  scroll={${getObjectStr(tableScroll)}}
                  tableLayout="${tableLayout}"
                  >
                  ${data.columns.map(getColumnStr).join('\n')}
                  </Table>`
    return str;
  }
  const emptyStyle = {
    border: '1px dashed rgb(176, 176, 176)',
    margin: 0
  }
  return `<Empty description="请添加列或连接数据源" style={${getObjectStr(emptyStyle)}} />`;
}

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

    const paginationCfg = {
      total: total,
      showTotal: (total: number, range: number[]) => {
        return `total ${total} items`;
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
          ${getObjectDistrbuteStr(paginationCfg)}
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

function getObjectStr(obj) {
  return JSON.stringify(obj)
}

function getValueStr(val) {
  if (typeCheck(val, 'STRING')) {
    return `"${val}"`;
  }
  if (typeCheck(val, ['OBJECT']))
    return `{${getObjectStr(val)}}`;
  return `{${val}}`;
}

function getObjectDistrbuteStr(obj) {
  const strArr = Object.entries(obj).map(([key, value]) => {
    if (value == null) return '';
    return key + ' = ' + getValueStr(value);
  })
  return strArr.join('\n')
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