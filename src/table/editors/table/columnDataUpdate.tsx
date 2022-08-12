import { InputIds } from '../../constants';
import { getActionSchema } from '../../schema';
import { Data } from '../../types';

// 初始化配置
const defaultConfig = {
  use: false
};

// 设置配置
const setConfig = (data: Data, value: any, propName: string) => {
  if (!data.columnDataUpdateConfig) {
    data.columnDataUpdateConfig = { ...defaultConfig };
  }
  data.columnDataUpdateConfig[propName] = value;
};
// 获取配置
const getConfig = (data: Data, propName: string) => {
  if (!data.columnDataUpdateConfig) {
    data.columnDataUpdateConfig = { ...defaultConfig };
  }
  return propName
    ? data.columnDataUpdateConfig[propName]
    : data.columnDataUpdateConfig;
};
// 增加事件
const setActions = ({ data, input }) => {
  const use = getConfig(data, 'use');
  if (use) {
    input.add(InputIds.UPDATE_COLUMN_DATA, '更新行数据', getActionSchema(data));
  } else {
    input.remove(InputIds.UPDATE_COLUMN_DATA);
  }
};

const columnDataUpdateEditor = [
  {
    title: '行数据更新',
    type: 'switch',
    value: {
      get({ data }: EditorResult<Data>) {
        return getConfig(data, 'use');
      },
      set({ data, input }: EditorResult<Data>, value: boolean) {
        setConfig(data, value, 'use');
        setActions({ data, input });
      }
    }
  },
  {
    title: '行数据更新配置',
    ifVisible({ data }: EditorResult<Data>) {
      return getConfig(data, 'use');
    },
    items: [
      {
        title: '行唯一标识',
        type: 'text',
        options: {
          placeholder: '例：id'
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return getConfig(data, 'rowKey');
          },
          set({ data }: EditorResult<Data>, value: boolean) {
            setConfig(data, value, 'rowKey');
          }
        }
      }
    ]
  }
];

export { columnDataUpdateEditor };
