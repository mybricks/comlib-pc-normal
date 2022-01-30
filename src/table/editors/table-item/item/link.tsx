import { Data } from '../../../types';

// linkConfig初始化配置
const defaultLinkConfig = {
  type: 'rowKey',
  rowKey: 'link',
  routeType: 'openTab'
};
// 点击事件scheam
const defaultScheam = {
  type: 'any'
};

// 获取列项属性
const getColumnsItem = (data: Data, focusArea: any) => {
  const index = +focusArea.dataset.tableThIdx;
  return data.columns[index];
};
// 设置列项linkConfig
const setLinkConfig = (
  data: Data,
  focusArea: any,
  value: any,
  propName: string
) => {
  const item = getColumnsItem(data, focusArea);
  if (!item.linkConfig) {
    item.linkConfig = { ...defaultLinkConfig };
  }
  item.linkConfig[propName] = value;
};
// 获取列项linkConfig
const getLinkConfig = (data: Data, focusArea: any, propName: string) => {
  const item = getColumnsItem(data, focusArea);
  if (!item.linkConfig) {
    item.linkConfig = { ...defaultLinkConfig };
  }
  return propName ? item.linkConfig[propName] : item.linkConfig;
};
// 设置链接事件
export const setLinkColAction = ({ data, focusArea, output }) => {
  const {
    key: colKey,
    title,
    linkConfig,
    contentType
  } = getColumnsItem(data, focusArea);
  const { type } = linkConfig || {};
  const key = `${colKey}-link-click`;
  if (contentType === 'link' && type === 'click') {
    output.setTitle(key, `点击${title}项`);
  }
};

const LinkItemEditor = {
  title: '链接列设置',
  ifVisible({ data, focusArea }: EditorResult<Data>) {
    if (!focusArea) return;
    const item = data.columns[focusArea.dataset.tableThIdx];
    return item.contentType === 'link';
  },
  items: [
    {
      title: '链接地址来源',
      type: 'select',
      options: [
        {
          label: '表格字段',
          value: 'rowKey'
        },
        {
          label: '自定义地址',
          value: 'href'
        },
        ,
        {
          label: '自定义点击',
          value: 'click'
        }
      ],
      value: {
        get: ({ data, focusArea }: EditorResult<Data>) => {
          return getLinkConfig(data, focusArea, 'type');
        },
        set({ data, focusArea, output }: EditorResult<Data>, value) {
          const { key: colKey, title } = getColumnsItem(data, focusArea);
          const key = `${colKey}-link-click`;
          if (value === 'click') {
            if (!output.get(key)) {
              output.add(key, `点击${title}项`, defaultScheam);
            }
            output.setTitle(key, `点击${title}项`);
          }
          if (
            getLinkConfig(data, focusArea, 'type') === 'click' &&
            value !== 'click'
          ) {
            output.remove(key);
          }
          setLinkConfig(data, focusArea, value, 'type');
        }
      }
    },
    {
      title: '自定义点击',
      type: '_Event',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        const item = getLinkConfig(data, focusArea, 'type');
        return ['click'].includes(item);
      },
      options: ({ data, focusArea }: EditorResult<Data>) => {
        const { key: colKey, title } = getColumnsItem(data, focusArea);
        const key = `${colKey}-link-click`;
        return {
          outputId: key
        };
      }
    },
    {
      title: '表格字段',
      type: 'text',
      options: {
        placeholder: '例：id'
      },
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        const item = getLinkConfig(data, focusArea, 'type');
        return ['rowKey'].includes(item);
      },
      value: {
        get: ({ data, focusArea }: EditorResult<Data>) => {
          return getLinkConfig(data, focusArea, 'rowKey');
        },
        set({ data, focusArea }: EditorResult<Data>, value) {
          setLinkConfig(data, focusArea, value, 'rowKey');
        }
      }
    },
    {
      title: '自定义地址',
      type: 'textarea',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        const item = getLinkConfig(data, focusArea, 'type');
        return ['href'].includes(item);
      },
      value: {
        get: ({ data, focusArea }: EditorResult<Data>) => {
          return getLinkConfig(data, focusArea, 'href');
        },
        set({ data, focusArea }: EditorResult<Data>, value) {
          setLinkConfig(data, focusArea, value, 'href');
        }
      }
    },
    {
      title: '跳转类型',
      type: 'select',
      options: [
        {
          label: '路由跳转',
          value: 'push'
        },
        {
          label: '重定向',
          value: 'redirect'
        },
        {
          label: '新标签页',
          value: 'openTab'
        },
        {
          label: '新窗口',
          value: 'openWindow'
        }
      ],
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        const item = getLinkConfig(data, focusArea, 'type');
        return ['rowKey', 'href'].includes(item);
      },
      value: {
        get: ({ data, focusArea }: EditorResult<Data>) => {
          return getLinkConfig(data, focusArea, 'routeType');
        },
        set({ data, focusArea }: EditorResult<Data>, value) {
          setLinkConfig(data, focusArea, value, 'routeType');
        }
      }
    },
    {
      title: '点击事件',
      type: '_Event',
      ifVisible({ data, focusArea }: EditorResult<Data>) {
        const item = getLinkConfig(data, focusArea, 'type');
        return ['click'].includes(item);
      },
      options: ({ data, focusArea }: EditorResult<Data>) => {
        const { key: colKey } = getColumnsItem(data, focusArea);
        const key = `${colKey}-link-click`;
        return {
          outputId: key
        };
      }
    }
  ]
};

export default LinkItemEditor;
