/**
 * 面包屑配置项
 * @param key 唯一id
 * @param label 值
 * @param clickable 是否可点击
 * @param outputValue 点击输出内容，允许点击为前提
 */
export interface Children {
  key: string;
  label: string;
  clickable?: boolean;
  outputValue: string;
  event: any;
  style?: any;
}
/**
 * 数据源
 * @param padding 内边距
 * @param separator 分割符
 * @param children 面包屑配置数组
 * @param customSeparator 是否自定义分割符
 */
export interface Data {
  padding: number;
  separator: string;
  children: Children[];
  customSeparator: string;
}

export const InputIds = {
  SetMsg: 'inputInfo',
  SetDesc: 'description'
};
export const SlotIds = {
  DescSlot: 'description'
};

export const TypeOptions = [
  {
    label: '默认',
    value: 'info'
  },
  {
    label: '成功',
    value: 'success'
  },
  {
    label: '错误',
    value: 'error'
  },
  {
    label: '警告',
    value: 'warning'
  }
];
