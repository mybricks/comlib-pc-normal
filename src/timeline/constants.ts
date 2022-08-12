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

export enum DATA_SOURCE_TYPE {
  STATIC = 1,
  DYNAMIC = 2
}
export interface Data {
  dataSource: DATA_SOURCE_TYPE;
  timelines: Item[];
  width?: string;
  mode: 'left' | 'alternate' | 'right';
  reverse?: boolean;
  supportCollapse?: boolean;
  useItemClick?: boolean;
}

export const InputIds = {
  SetDataSource: 'dataSource'
};
export const OutputIds = {
  ItemClick: 'itemClick'
};
export const SlotIds = {
  Content: 'content'
};

export const Schemas = {
  [InputIds.SetDataSource]: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        title: {
          title: '标题',
          type: 'string'
        },
        subTitle: {
          title: '子标题',
          type: 'string'
        },
        description: {
          title: '描述',
          type: 'string'
        },
        color: {
          title: '节点颜色',
          type: 'string'
        }
      }
    }
  }
};
