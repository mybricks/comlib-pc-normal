import { setPath } from '../../utils/path';
import { uuid } from '../../utils';
import { ContentTypeEnum, Data, IColumn } from '../types';
import { InputIds, DefaultRowKey } from '../constants';

const findColumnItemByKey = (columns: IColumn[], key: string) => {
  let res;
  if (Array.isArray(columns)) {
    columns.forEach((column, index) => {
      if (res) {
        return;
      }
      if (column.key === key) {
        res = {
          column,
          index,
          parent: columns
        };
        return;
      }
      if (column.children) {
        res = findColumnItemByKey(column.children, key);
      }
    });
  }
  return res;
};
export const getColumnItem = (data: Data, focusArea, datasetKey = 'tableThIdx'): IColumn => {
  const key = focusArea.dataset[datasetKey];
  return findColumnItemByKey(data.columns, key)?.column || {};
};
export const getColumnItemInfo = (
  data: Data,
  focusArea,
  datasetKey = 'tableThIdx'
): { column: IColumn; index: number; parent: IColumn[] } => {
  const key = focusArea.dataset[datasetKey];
  const res = findColumnItemByKey(data.columns, key);
  return res || { column: {}, parent: [], index: -1 };
};

export const getNewColumn = (data?: Data) => {
  const obj: IColumn = {
    title: data ? `列${data?.columns?.length + 1}` : '新增',
    dataIndex: '',
    // dataIndex: `${uuid()}`,
    width: 140,
    key: uuid(),
    contentType: ContentTypeEnum.Text,
    visible: true
  };
  return obj;
};

// 设置列，并格式化
export const setColumns = ({ data, slot }: { data: Data; slot: any }, newColumns: any[]) => {
  data.columns.forEach((column) => {
    // 判断是否删除
    if (!newColumns?.find?.((temp) => temp.key === column.key)) {
      if (column.slotId && slot.get(column.slotId)) {
        slot.remove(column.slotId);
      }
    }
  });
  data.columns = [
    ...newColumns?.map((item) => {
      let dataIndex =
        typeof item.dataIndex === 'string' ? item.dataIndex.trim().split('.') : item.dataIndex;
      if (Array.isArray(dataIndex) && dataIndex.length === 1) {
        dataIndex = dataIndex[0];
      }
      return {
        title: item.title,
        key: uuid(),
        width: 140,
        visible: true,
        contentType: ContentTypeEnum.Text,
        ...item,
        dataIndex
      };
    })
  ];
};

// 格式化表格数据
export const formatDataSource = (dataSource) => {
  return dataSource.map(({ children, ...rest }) => {
    if (children && children.length) {
      return {
        [DefaultRowKey]: uuid(),
        children: formatDataSource(children),
        ...rest
      };
    } else {
      return {
        [DefaultRowKey]: uuid(),
        ...rest
      };
    }
  });
};
// 编辑态默认值
export const getDefaultDataSource = (columns: IColumn[]) => {
  const mockData = {
    [DefaultRowKey]: uuid()
  };
  const setDefaultDataSource = (columns) => {
    if (Array.isArray(columns)) {
      columns.forEach((item) => {
        let defaultValue: any = `${item.title}1`;
        if (item.contentType === 'group') {
          setDefaultDataSource(item.children);
          return;
        }
        if (Array.isArray(item.dataIndex)) {
          setPath(mockData, item.key, defaultValue, false);
          setPath(mockData, item.dataIndex.join('.'), defaultValue, false);
        } else {
          mockData[item.key] = defaultValue;
          mockData[item.dataIndex] = defaultValue;
        }
      });
    }
  };
  setDefaultDataSource(columns);
  return [mockData];
};

const convertEntity2Schema = (entity) => {
  const publicFields = (entity?.fieldAry || []).filter((item) => !item.isPrivate && !item.isPrimaryKey);
  return {
    items: {
      type: 'object',
      properties: publicFields.reduce((res, item) => {
        res[item.name] = {
          type: item?.bizType
        }
        return res
      }, {}),
    },
    type: 'array'
  }
}

// 获取列schema - 给编辑器使用
export const getColumnsSchema = (data: Data) => {
  let schema = (data?.domainData?.entity
    ? convertEntity2Schema(data?.domainData?.entity)
    : data[`input${InputIds.SET_DATA_SOURCE}Schema`]) || {};

  let columnsSchema = {};
  if (schema.type === 'array') {
    columnsSchema = schema;
  } else if (schema.type === 'object') {
    const { properties = {} } = data[`input${InputIds.SET_DATA_SOURCE}Schema`] || {};
    const dataSourceKey = Object.keys(properties).find((key) => properties[key].type === 'array');
    if (dataSourceKey) {
      columnsSchema = properties[dataSourceKey].items;
    }
  }
  return columnsSchema;
};

/**
 * 格式化列实际的 DataIndex 字段
 * 仅支持 中文/英文字母/数字/./_
 */
export function formatColumnItemDataIndex(item: IColumn) {
  if (item.dataIndex) {
    return item.dataIndex;
  }
  let titleDataIndex: string | string[] = item.title
    .split('')
    .filter((val) => /[\u4e00-\u9fa5A-Za-z0-9\._]/.test(val))
    .join('')
    .split('.');
  if (titleDataIndex.length <= 1) {
    titleDataIndex = titleDataIndex[0];
  }
  return titleDataIndex;
}
// 获取列实际的 DataIndex 字段
export function getColumnItemDataIndex(item: IColumn) {
  const colDataIndex = formatColumnItemDataIndex(item);
  const idx = Array.isArray(colDataIndex) ? colDataIndex.join('.') : colDataIndex;
  return idx;
}
