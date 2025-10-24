import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { Row, Table, Tooltip } from 'antd';
import { FilterFilled, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import get from 'lodash/get';
import { CompareFn } from 'antd/es/table/interface';
import { runJs } from '../../../../package/com-utils';
import {
  AlignEnum,
  Data,
  FilterIconEnum,
  FilterTypeEnum,
  IColumn,
  SorterTypeEnum,
  WidthTypeEnum
} from '../../types';
import css from './style.less';
import { OutputIds } from '../../constants';
import FilterIconRender from './filter-icon-render';
import { dragable } from '../../../utils/dom';
import Resizable from '../../../components/Resizable';
import { findColumnItemByKey } from '../../utils';

const { Column, ColumnGroup } = Table;

const getCurCol = (data, cItem) => {
  let col = {};
  for (let c of data.columns) {
    if (c.key === cItem.key) {
      col = c;
      break;
    } else if (c.children) {
      for (let cc of c.children) {
        if (cc.key === cItem.key) {
          col = cc;
          break;
        }
      }
    }
  }
  return col;
};

const checkIsDragging = (data) => {
  for (let c of data.columns) {
    if (c?.isDragging) {
      return true;
    } else if (c.children) {
      for (let cc of c.children) {
        if (cc?.isDragging) {
          return true;
        }
      }
    }
  }
  return false;
};

interface Props {
  env: Env;
  data: Data;
  outputs: any;
  dataSource: any;
  filterMap: any;
  renderCell: any;
  focusRowIndex: number | null;
  focusCellinfo: any;
  setFocusCellinfo: any;
  filterIconDefault?: FilterIconEnum;
  /** 是否有连接器 */
  hasConnector: boolean;
}

export default ({
  env,
  data,
  dataSource,
  outputs,
  filterMap,
  renderCell,
  focusRowIndex,
  setFocusCellinfo,
  focusCellinfo,
  filterIconDefault,
  hasConnector
}: Props) => {
  const isDragging = env.runtime ? false : checkIsDragging(data);

  const renderTtl = (cItem: IColumn) => {
    const title = env.i18n(cItem.title);
    const tip = env.i18n(cItem.tip);
    const content = cItem.hasTip ? (
      <div style={{position: 'relative'}}>
        <span style={{ marginRight: '6px' }}>{title}</span>
        <Tooltip
          placement="right"
          title={tip}
          overlayClassName={css.ellipsisTooltip}
          getPopupContainer={(node) => node.parentElement!}
          // getPopupContainer={() => env?.canvasElement || document.body}
        >
          <InfoCircleOutlined />
        </Tooltip>
      </div>
    ) : (
      <>{title}</>
    );

    const wrappedContent = (
      <>
        {
          <div
            style={{
              opacity: isDragging ? 0 : 1
            }}
          >
            {content}
          </div>
        }
        {isDragging && (
          <div
            className={cItem.isDragging ? css.draggingTipW : `${css.draggingTipW} ${css.dashed}`}
          >
            {cItem.width}
          </div>
        )}
      </>
    );

    return env.edit && !cItem.sorter?.enable && !cItem.filter?.enable ? (
      <Resizable
        axis="x"
        className={`${css.resizer}`}
        key={cItem.key}
        onResizeStart={() => {
          let col = getCurCol(data, cItem);
          if (col.isDragging) return;
          col.isDragging = true;
          data.columns = [...data.columns];
        }}
        onResizeStop={() => {
          let col = getCurCol(data, cItem);
          if (!col.isDragging) return;
          col.isDragging = false;
          data.columns = [...data.columns];
        }}
        onResize={({ width }) => {
          let col = getCurCol(data, cItem);
          col.width = Number(width);
          data.columns = [...data.columns];
        }}
      >
        {wrappedContent}
      </Resizable>
    ) : (
      content
    );
  };

  const getColumns = () => {
    return [...(data.columns || [])].map((item) => ({
      ...item,
      // 编辑状态并且没有连接器
      dataIndex: (env.edit && !hasConnector) ? item?.key : item?.dataIndex
    }));
  };

  const renderColumn = ({ children, ...cItem }: IColumn) => {
    if (cItem.visible === false) {
      return null;
    }
    if (children && cItem.contentType === 'group') {
      return (
        <ColumnGroup
          key={`group_${cItem.dataIndex}`}
          title={renderTtl(cItem)}
          align={cItem.align}
          onHeaderCell={(): any => {
            return {
              'data-table-th-idx': cItem.key,
              style: cItem.headStyle
                ? {
                  ...cItem.headStyle
                }
                : {
                  color: cItem.titleColor,
                  backgroundColor: cItem.titleBgColor
                }
            };
          }}
        >
          <>{children.map((item) => renderColumn(item))}</>
        </ColumnGroup>
      );
    }
    let sorter: boolean | CompareFn<any> | undefined;

    if (cItem.sorter?.enable) {
      if (data.lazyLoad) sorter = true;
      else {
        switch (cItem.sorter.type) {
          case SorterTypeEnum.Length:
            sorter = (a, b) => {
              const aVal = get(a, cItem.dataIndex);
              const bVal = get(b, cItem.dataIndex);
              if (typeof aVal !== 'string' || typeof bVal !== 'string') {
                return 0;
              }
              return aVal.length - bVal.length;
            };
            break;
          case SorterTypeEnum.Size:
            sorter = (a, b) => {
              const aVal = get(a, cItem.dataIndex);
              const bVal = get(b, cItem.dataIndex);
              if (typeof aVal !== 'number' || typeof bVal !== 'number') {
                return 0;
              }
              return aVal - bVal;
            };
            break;
          case SorterTypeEnum.Date:
            sorter = (a, b) => {
              const aVal = get(a, cItem.dataIndex);
              const bVal = get(b, cItem.dataIndex);
              if (!aVal || !bVal) {
                return 0;
              }
              return moment(aVal).valueOf() - moment(bVal).valueOf();
            };
            break;
          default:
            sorter = true;
            break;
        }
      }
    }

    const onFilter =
      cItem.filter?.type !== FilterTypeEnum.Request
        ? (value, record) => {
          return get(record, cItem.dataIndex) == value;
        }
        : null;

    const filterVisibleProps = cItem.filter?.hideFilterDropdown
      ? {
        filterDropdownVisible: false
      }
      : {};

    const getCellConfig = (dataSource, currentField, rowIndex) => {
      const { mergeByField, excludeFields } = data.rowMergeConfig || {};
      if (
        !data.enbaleRowMerge ||
        !mergeByField ||
        excludeFields?.includes(Array.isArray(currentField) ? currentField.join('.') : currentField) ||
        !dataSource ||
        dataSource.length <= 1 ||
        typeof dataSource[rowIndex]?.[mergeByField] === 'undefined'
      )
        return { rowSpan: 1 };
      const fieldValues = dataSource.map((item) => item[mergeByField]);

      // 如果跟上一行数据一样，则直接合并
      if (rowIndex !== 0 && fieldValues[rowIndex] === fieldValues[rowIndex - 1]) {
        return { rowSpan: 0 };
      }

      // 计算连续相同的值的个数
      const calcEqualCount = (list, index) => {
        if (index === list.length - 1) {
          return 1;
        }
        if (index >= list.length) {
          return 0;
        }
        if (list[index] === list[index + 1]) {
          return 1 + calcEqualCount(list, index + 1);
        }
        return 1;
      };

      let count = calcEqualCount(fieldValues, rowIndex);
      return {
        rowSpan: count
      };
    };

    const onCell = (record, rowIndex) => {
      const { focusRecord = {}, dataIndex = null } = focusCellinfo || {};
      const rowKey = data.rowKey || '_uuid';
      const isFocus = dataIndex === cItem.dataIndex && focusRecord?.[rowKey] === record?.[rowKey];
      let res = {
        style: data.enableRowFocus && focusRowIndex === rowIndex ? data.focusRowStyle : {},
        'data-table-column-id': cItem.key,
        ...getCellConfig(dataSource, cItem.dataIndex, rowIndex),
        'data-focus-cell': data.enableCellFocus && isFocus ? true : undefined,
        onClick: data.enableCellClick || data.enableCellFocus
          ? () => {
            setFocusCellinfo(
              isFocus ? null : { focusRecord: record, dataIndex: cItem.dataIndex }
            );
            if (data.enableCellClick) {
              outputs[OutputIds.CELL_CLICK]({
                record,
                index: rowIndex,
                dataIndex: cItem.dataIndex,
                isFocus: !isFocus
              });
            }
          }
          : null
      };
      if (env.runtime && cItem.enableOnCell && cItem.onCellScript) {
        res = {
          ...res,
          ...runJs(cItem.onCellScript, [record[cItem.dataIndex], record, cItem.dataIndex, rowIndex], env)
        }
      }
      return res;
    };

    const filters = filterMap[`${cItem.dataIndex}`]?.map((item) => ({
      text: item.text,
      value: item.value
    }));
    return (
      <Column
        {...(cItem as any)}
        ellipsis={false}
        width={cItem.width === WidthTypeEnum.Auto ? undefined : cItem.width}
        title={renderTtl(cItem)}
        key={cItem.dataIndex}
        filterMultiple={cItem.filter?.filterType !== FilterTypeEnum.Single}
        render={(text, record, index) => {
          return renderCell({
            colKey: cItem.key,
            value: cItem.dataIndex ? text : '',
            record,
            index,
            data
          });
        }}
        onFilterDropdownVisibleChange={(visible) => {
          if (!visible || typeof outputs[OutputIds.FILTER_CLICK] !== 'function') return;
          outputs[OutputIds.FILTER_CLICK]({ dataIndex: cItem.dataIndex, dataSource, item: cItem });
        }}
        {...filterVisibleProps}
        showSorterTooltip={false}
        sortOrder={data?.sortParams?.id === `${cItem.dataIndex}` ? data?.sortParams?.order : null}
        sorter={sorter}
        filters={filters}
        filteredValue={data?.filterParams?.[`${cItem.dataIndex}`] || null}
        onFilter={onFilter}
        onCell={onCell}
        onHeaderCell={(): any => {
          return {
            'data-table-th-idx': cItem.key,
            className:
              sorter && cItem?.sorterAlign && `ant-table-column-sorter-${cItem?.sorterAlign}`
          };
        }}
        filterIcon={(filtered) => (
          <FilterIconRender
            inherit={cItem.filter?.filterIconInherit}
            defaultType={filterIconDefault}
            type={cItem.filter?.filterIcon}
            filtered={filtered}
          />
        )}
      />
    );
  };

  return getColumns().map((item) => !!item ? renderColumn(item) : null);
};
