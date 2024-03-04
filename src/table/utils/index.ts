import { setPath } from '../../utils/path';
import { uuid } from '../../utils';
import { ContentTypeEnum, Data, IColumn, SorterTypeEnum } from '../types';
import { InputIds } from '../constants';
import { Entity } from '../../domain-form/type';
import { getFilterSelector } from '../../utils/cssSelector';

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
  const title = data ? `列${data?.columns?.length + 1}` : '新增'
  const obj: IColumn = {
    title,
    dataIndex: title,
    width: 140,
    key: uuid(),
    contentType: ContentTypeEnum.Text,
    visible: true,
    filter: {
      filterIconInherit: true
    },
    sorter: {
      enable: false,
      type: SorterTypeEnum.Size
    }
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
export const formatDataSource = (dataSource, rowKey) => {
  return dataSource.map(({ children, ...rest }) => {
    if (children && children.length) {
      return {
        [rowKey]: uuid(),
        children: formatDataSource(children, rowKey),
        ...rest
      };
    } else {
      return {
        [rowKey]: uuid(),
        ...rest
      };
    }
  });
};
// 编辑态默认值
export const getDefaultDataSource = (columns: IColumn[], rowKey, env) => {
  if (env.runtime) return [];
  const mockData = {
    [rowKey]: 'xxx'
  };
  const setDefaultDataSource = (columns) => {
    if (Array.isArray(columns)) {
      columns.forEach((item) => {
        let defaultValue: any = `${env.i18n(item.title)}1`;
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

const convertEntityField2SchemaType = (field, paredEntityIds: string[] = []) => {
  switch (field.bizType) {
    case 'string':
    case 'enum':
      return { type: 'string' };
    case 'number':
    case 'datetime':
      return { type: 'number' };
    case 'relation':
      return {
        type: 'object',
        properties:
          field?.mapping?.entity?.fieldAry.reduce((res, item) => {
            if (!paredEntityIds.includes(field.relationEntityId)) {
              paredEntityIds.push(field.relationEntityId);
            }
            res[item.name] = convertEntityField2SchemaType(item);
            return res;
          }, {}) || {}
      };
    case 'mapping':
      return {
        type: 'array',
        items: {
          properties:
            field?.mapping?.entity?.fieldAry.reduce((res, item) => {
              if (!item.relationEntityId || !paredEntityIds.includes(field.relationEntityId)) {
                res[item.name] = convertEntityField2SchemaType(item);
              }
              if (!paredEntityIds.includes(field.relationEntityId)) {
                paredEntityIds.push(field.relationEntityId);
              }
              return res;
            }, {}) || {},
          type: 'object'
        }
      };
    default:
      return { type: 'string' };
  }
};

const convertEntity2Schema = (entity: Entity) => {
  const publicFields = (entity?.fieldAry || []).filter((item) => !item.isPrivate);
  const parsedEntityIds = [entity.id];
  return {
    items: {
      type: 'object',
      properties: publicFields.reduce((res, item) => {
        res[item.name] = convertEntityField2SchemaType(item, parsedEntityIds);
        return res;
      }, {})
    },
    type: 'array'
  };
};

// 获取列schema - 给编辑器使用
export const getColumnsSchema = (data: Data) => {
  let schema =
    (data?.domainModel?.entity
      ? convertEntity2Schema(data?.domainModel?.entity)
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
  let titleDataIndex: string | string[] = (item.title || '')
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


export const createStyleForTableContent = () => [
  {
    title: '表头',
    catelog: '默认',
    options: ['font', 'border', 'padding', { type: 'background', config: { disableBackgroundImage: true } }],
    ifVisible({ data }: EditorResult<Data>) {
      return !!data.columns.length;
    },
    target: ({ id }) => `table thead tr th${getFilterSelector(id)}`
  },
  {
    title: '表格内容',
    catelog: '默认',
    ifVisible({ data }: EditorResult<Data>) {
      return !!data.columns.length;
    },
    options: ['font', 'border', 'padding', { type: 'background', config: { disableBackgroundImage: true } }],
    target: ({ id }) => `table tbody tr td${getFilterSelector(id)}`
  },
  {
    title: '表格',
    catelog: '默认',
    ifVisible({ data }: EditorResult<Data>) {
      return !!data.columns.length;
    },
    options: ['border', { type: 'background', config: { disableBackgroundImage: true } }, 'opacity'],
    target: ({ id }) => `table`
  },
  {
    title: '表格行',
    catelog: '默认',
    ifVisible({ data }: EditorResult<Data>) {
      return !!data.columns.length;
    },
    options: ['border', { type: 'background', config: { disableBackgroundImage: true } }, 'opacity'],
    target: ({ id }) => `table tr`
  },
  {
    title: '行Hover',
    catelog: 'Hover',
    ifVisible({ data }: EditorResult<Data>) {
      return !!data.columns.length;
    },
    options: ['font', 'border', { type: 'background', config: { disableBackgroundImage: true } }],
    target: ({ id }) => `table tbody>tr:hover>td${getFilterSelector(id)}`
  },
  {
    title: '选中单元格',
    catelog: '选中',
    ifVisible({ data }: EditorResult<Data>) {
      return data.enableCellFocus;
    },
    options: ['font', 'border', { type: 'background', config: { disableBackgroundImage: true } }],
    target: ({ id }) => {
      return `table tbody tr td[data-focus-cell]${getFilterSelector(id)}`
    }
  },
]

export const createStyleForColumnContent = ({ target, ...others }: StyleModeType<Data>) => ({
  title: '内容',
  options: ['font', 'border', { type: 'background', config: { disableBackgroundImage: true } }],
  ifVisible({ data }: EditorResult<Data>) {
    return !!data.columns.length;
  },
  target,
  ...(others || {})
});