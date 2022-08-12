import React from 'react';
import moment from 'moment';
import { Tooltip, Table } from 'antd';
import get from 'lodash/get';
import { InfoCircleOutlined } from '@ant-design/icons';
import { CompareFn } from 'antd/es/table/interface';
import { IColumn } from '../../types';
import { uuid } from '../../../utils';
import css from './style.less';

const { Column, ColumnGroup } = Table;

export default ({ env, data, slots, outputs, dynamicColumn, tableContent, renderCell }) => {
  const renderTtl = (cItem: IColumn) => {
    const title = env.i18n(cItem.title);
    const tip = env.i18n(cItem.tip);
    return cItem.hasTip ? (
      <div>
        <span style={{ marginRight: '6px' }}>{title}</span>
        <Tooltip placement='topLeft' title={tip} overlayClassName={css.ellipsisTooltip}>
          <InfoCircleOutlined />
        </Tooltip>
      </div>
    ) : (
      title
    );
  };
  // 获取列数据
  const getColumns = () => {
    let res = [...(data.columns || [])];
    // 合并额外列数据
    if (data.extraColumns && Array.isArray(data.extraColumns)) {
      const uid = uuid();
      const defaultColItem = {
        title: '新增',
        dataIndex: `${uid}`,
        ellipsis: true,
        width: 140,
        key: uid,
        uuid: uid,
        contentType: 'text',
        visible: true
      };
      data.extraColumns.forEach((colItem) => {
        if (!colItem) {
          return;
        }
        let { index, ...item } = colItem;
        if (!index || index === -1) {
          index = res.length;
        } else {
          index = index - 1;
        }
        res.splice(index, 0, {
          ...defaultColItem,
          ...item
        });
      });
    }

    // 设置动态显示列逻辑
    if (dynamicColumn && dynamicColumn.length) {
      res = res
        .map((colItem) => {
          const showItem = dynamicColumn.find((item) => colItem.dataIndex === item.dataIndex);
          if (showItem) {
            return {
              ...colItem,
              title: showItem.title || colItem.title
            };
          }
          return null;
        })
        .filter((item) => !!item);
    }
    return res;
  };

  const renderColumn = ({ children, ...cItem }: IColumn) => {
    if (cItem.visible === false) {
      return null;
    }
    if (children && cItem.contentType === 'group') {
      return (
        <ColumnGroup
          title={renderTtl(cItem)}
          width={cItem.width}
          align={cItem.align || 'left'}
          onHeaderCell={(): any => {
            return {
              'data-table-th-idx': cItem.key
            };
          }}
        >
          {children.map(renderColumn)}
        </ColumnGroup>
      );
    }
    let sorter: boolean | CompareFn<any> | undefined;
    let ellipsis;

    if (cItem.ellipsis && ['text', 'color', 'link', 'date'].includes(cItem.contentType)) {
      ellipsis = true;
    } else {
      ellipsis = false;
    }

    if (cItem.sorter?.enable) {
      switch (cItem.sorter.type) {
        case 'length':
          sorter = (a, b) => {
            const aVal = get(a, cItem.dataIndex);
            const bVal = get(b, cItem.dataIndex);
            if (!aVal || !bVal) {
              return 0;
            }
            return aVal.length - bVal.length;
          };
          break;
        case 'size':
          sorter = (a, b) => {
            const aVal = get(a, cItem.dataIndex);
            const bVal = get(b, cItem.dataIndex);
            if (!aVal || !bVal) {
              return 0;
            }
            return aVal - bVal;
          };
          break;
        case 'date':
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
    if (cItem.filter?.enable && cItem.filter?.filterSource !== 'remote') {
      tableContent.filterMap[`${cItem.dataIndex}`] = cItem.filter.options;
    }

    const onFilter =
      cItem.filter?.type !== 'request'
        ? (value, record) => {
            return get(record, cItem.dataIndex) == value;
          }
        : null;
    return (
      <Column
        {...(cItem as any)}
        className={`${css.columnMinWidth} ${cItem.className}`}
        title={renderTtl(cItem)}
        ellipsis={ellipsis}
        key={cItem.dataIndex}
        filterMultiple={cItem.filter?.filterType !== 'single'}
        render={
          cItem.render
            ? cItem.render
            : (text, record, index) => {
                return renderCell(
                  cItem,
                  // dataIndex为空时text=record，会导致错误
                  // 当dataIndex为空时，value设置为''
                  cItem.dataIndex ? text : '',
                  record,
                  index,
                  cItem.key,
                  // data.draggable ? colIndex - 1 : colIndex,
                  slots,
                  outputs,
                  data
                );
              }
        }
        showSorterTooltip={false}
        sorter={sorter}
        filters={tableContent.filterMap[`${cItem.dataIndex}`]?.map((item) => ({
          text: env.i18n(item.text),
          value: item.value
        }))}
        onFilter={onFilter}
        onHeaderCell={(): any => {
          return {
            'data-table-th-idx': cItem.key
          };
        }}
      />
    );
  };

  return getColumns().map((item) => renderColumn(item));
};
