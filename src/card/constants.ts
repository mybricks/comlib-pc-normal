/**
 * 数据源
 * @param title 名称
 * @param useExtra 卡片右上角操作
 * @param bordered 是否有边框
 * @param size 卡片尺寸
 * @param style 卡片样式
 * @param hoverable 鼠标移过时可浮起
 */
export interface Data {
  title: string;
  useExtra?: boolean;
  bordered?: boolean;
  size?: 'default' | 'small';
  style: any;
  bodyStyle?: any;
  hoverable?: boolean;
  cursor?: boolean;
  useClick?: boolean;
  outputContent?: any;
  dataType: 'null' | 'number' | 'string' | 'object' | 'boolean' | 'external';
  borderStyle?: Object; 
  isAction: boolean;
  items: [Item];
  padding: string;
  inVal: any;
  isHeight: boolean;
  height: string;
  showTitle: boolean;
  slotStyle?: Object; 
}

export interface Item {
  key: string;
  name: string;
}

export const OutputIds = {
  Click: 'click',
  DoubleClick: 'doubleClick',
};

export const InputIds = {
  SetTitle: 'title'
};

export const SlotIds = {
  Body: 'body',
  Extra: 'extra'
};

export const SizeOptions = [
  {
    label: '正常',
    value: 'default'
  },
  {
    label: '小',
    value: 'small'
  }
];
