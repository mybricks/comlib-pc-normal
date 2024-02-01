export interface Item {
  id: string;
  title: string;
  color?: string;
  subTitle?: string;
  description?: string;
  position?: 'left' | 'right';
  _id?: string;
  [key: string]: any;
}

export enum ModeEnum {
  Left = 'left',
  Alternate = 'alternate',
  Right = 'right'
}

export interface Data {
  timelines: Item[];
  mode: ModeEnum;
  reverse?: boolean;
  supportCollapse?: boolean;
  defaultCollapse?: boolean;
  useContentSlot?: boolean;
  isDynamic?: boolean
}

export const InputIds = {
  SetDataSource: 'dataSource',

  CurrentDs: 'currentDs',
  Index: 'index'
};
export const OutputIds = {
  ItemClick: 'itemClick',
  SetDataSourceComplete: 'dataSourceComplete'
};
export const SlotIds = {
  Content: 'content'
};

