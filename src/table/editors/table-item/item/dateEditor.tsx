import { Data } from '../../../types';
import { getColumnItem } from '../../../utils';

// dateConfig初始化配置
const defaultDateConfig = {
  formatter: 'Y-MM-DD'
};

// 设置列项dateConfig
const setDateConfig = (data: Data, focusArea: any, propName: string, value: any) => {
  if (!focusArea) return;
  const item = getColumnItem(data, focusArea);
  if (!item.dateConfig) {
    item.dateConfig = { ...defaultDateConfig };
  }
  item.dateConfig[propName] = value;
};
// 获取列项dateConfig
const getDateConfig = (data: Data, focusArea: any, propName: string) => {
  if (!focusArea) return;
  const item = getColumnItem(data, focusArea);
  if (!item.dateConfig) {
    item.dateConfig = { ...defaultDateConfig };
  }
  return propName ? item.dateConfig[propName] : item.dateConfig;
};

export default [
  {
    title: '日期格式化模板',
    type: 'Select',
    description: '设置的模板将对模板字符串中的每个字段进行处理',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const item = getColumnItem(data, focusArea);
      return item.contentType === 'date';
    },
    options: [
      { label: '年-月-日 时:分:秒', value: 'Y-MM-DD HH:mm:ss' },
      { label: '年-月-日 时:分', value: 'Y-MM-DD HH:mm' },
      { label: '年-月-日', value: 'Y-MM-DD' },
      { label: '年-月', value: 'Y-MM' },
      { label: '年', value: 'Y' },
      { label: '自定义', value: 'custom' }
    ],
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        return getDateConfig(data, focusArea, 'customFomatter')
          ? 'custom'
          : getDateConfig(data, focusArea, 'formatter') || 'Y-MM-DD';
      },
      set({ data, focusArea }, value: string) {
        if (!focusArea) return;
        const item = getColumnItem(data, focusArea);
        item.dateConfig = item.dateConfig || {};
        if (value === 'custom') {
          setDateConfig(data, focusArea, 'customFomatter', true);
          setDateConfig(data, focusArea, 'formatter', 'YYYY-MM-DD HH:mm:ss 星期dd');
        } else {
          setDateConfig(data, focusArea, 'customFomatter', false);
          setDateConfig(data, focusArea, 'formatter', value);
        }
      }
    }
  },
  {
    title: '自定义格式化模板',
    type: 'text',
    description:
      '日期格式化模板 YYYY:年份 MM:月份 DD:日 dd:星期 HH:24小时制 hh:12小时制 mm:分 ss:秒',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const item = getColumnItem(data, focusArea);
      return item.contentType === 'date' && getDateConfig(data, focusArea, 'customFomatter');
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        return getDateConfig(data, focusArea, 'formatter');
      },
      set({ data, focusArea }, value: string) {
        setDateConfig(data, focusArea, 'formatter', value);
      }
    }
  }
];
