import React from 'react';
import moment from 'moment';
import { Table, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import get from 'lodash/get';
import { CompareFn } from 'antd/es/table/interface';
import {
  AlignEnum,
  Data,
  FilterTypeEnum,
  IColumn,
  SorterTypeEnum,
  WidthTypeEnum
} from '../../types';
import css from './style.less';

const { Column, ColumnGroup } = Table;

interface Props {
  env: Env;
  data: Data;
  slots: any;
  filterMap: any;
  renderCell: any;
}
export default ({ env, data, slots, filterMap, renderCell }: Props) => {
  const renderTtl = (cItem: IColumn) => {
    const title = cItem.title;
    const tip = cItem.tip;
    return cItem.hasTip ? (
      <div>
        <span style={{ marginRight: '6px' }}>{title}</span>
        <Tooltip placement="topLeft" title={tip} overlayClassName={css.ellipsisTooltip}>
          <InfoCircleOutlined />
        </Tooltip>
      </div>
    ) : (
      title
    );
  };
  // 获取列数据
  const getColumns = (): IColumn[] => {
    let res = [...(data.columns || [])].map((item) => ({
      ...item,
      dataIndex: env.edit ? item.key : item.dataIndex
    }));
    return res;
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
          align={cItem.align || AlignEnum.Left}
          onHeaderCell={(): any => {
            return {
              'data-table-th-idx': cItem.key
            };
          }}
        >
          <>{children.map((item) => renderColumn(item))}</>
        </ColumnGroup>
      );
    }
    let sorter: boolean | CompareFn<any> | undefined;

    if (cItem.sorter?.enable) {
      switch (cItem.sorter.type) {
        case SorterTypeEnum.Length:
          sorter = (a, b) => {
            const aVal = get(a, cItem.dataIndex);
            const bVal = get(b, cItem.dataIndex);
            if (!aVal || !bVal) {
              return 0;
            }
            return aVal.length - bVal.length;
          };
          break;
        case SorterTypeEnum.Size:
          sorter = (a, b) => {
            const aVal = get(a, cItem.dataIndex);
            const bVal = get(b, cItem.dataIndex);
            if (!aVal || !bVal) {
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

    const onFilter =
      cItem.filter?.type !== FilterTypeEnum.Request
        ? (value, record) => {
            return get(record, cItem.dataIndex) == value;
          }
        : null;
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
            columnItem: cItem,
            value: cItem.dataIndex ? text : '',
            record,
            index,
            slots,
            data
          });
        }}
        showSorterTooltip={false}
        sortOrder={data?.sortParams?.id === `${cItem.dataIndex}` ? data?.sortParams?.order : null}
        sorter={sorter}
        filters={filterMap[`${cItem.dataIndex}`]?.map((item) => ({
          text: item.text,
          value: item.value
        }))}
        filteredValue={data?.filterParams?.[`${cItem.dataIndex}`] || null}
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
