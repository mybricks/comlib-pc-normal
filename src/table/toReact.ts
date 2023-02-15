import { TableProps } from 'antd';
import { getObjectStr, getObjectDistrbuteStr } from '../utils/toReact';
import { SizeTypeEnum } from './components/Paginator/constants';
import { ContentTypeEnum, Data, FilterTypeEnum, IColumn, RowSelectionPostionEnum, RowSelectionTypeEnum, TableLayoutEnum, WidthTypeEnum } from './types';

export default function ({ data, slots }: RuntimeParams<Data>) {

  /**数据预处理 */
  data.columns.map(item => {
    if (!item.dataIndex) item.dataIndex = item.title;
  });

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

/**
 * 获取表格头codeStr
 * @param param0 RuntimeParams
 * @returns tableHeaderStr
 */
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
  const headerCfg = {
    style
  };
  const str = `<div
                ${getObjectDistrbuteStr(headerCfg)}
                >
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
    const columnCfg: IColumn = {
      dataIndex: cItem.dataIndex,
      ellipsis: false,
      width: cItem.width === WidthTypeEnum.Auto ? void 0 : cItem.width,
      title: titleRenderStr,
      filterMultiple: cItem.filter?.filterType !== FilterTypeEnum.Single,
      render: () => {
        return `(text, record, index) => {
                  return ${cItem.dataIndex || cItem.title ? 'text' : ''};
                }`;
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
              ${getObjectDistrbuteStr(columnCfg)}
            />`;
  };
  if (data.columns.length) {
    const { size, bordered, useRowSelection, showHeader } = data;
    const tableCfg: TableProps<any> = {
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
                  ${getObjectDistrbuteStr(tableCfg)}
                  >
                  ${data.columns.map(getColumnStr).join('\n')}
                  </Table>`
    return str;
  }

  const emptyStyle = {
    border: '1px dashed rgb(176, 176, 176)',
    margin: 0
  };
  const emptyCfg = {
    description: "请添加列或连接数据源",
    style: emptyStyle
  };
  return `<Empty 
            ${getObjectDistrbuteStr(emptyCfg)}
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

    const paginationCfg = {
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