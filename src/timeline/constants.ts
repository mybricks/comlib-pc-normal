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
export enum DataSourceEnum {
  STATIC = 1,
  DYNAMIC = 2
}
export interface Data {
  dataSource: DataSourceEnum;
  timelines: Item[];
  mode: ModeEnum;
  reverse?: boolean;
  supportCollapse?: boolean;
  defaultCollapse?: boolean;
  useItemClick?: boolean;

  useContentSlot?: boolean;
}

export const InputIds = {
  SetDataSource: 'dataSource',

  CurrentDs: 'currentDs',
  Index: 'index'
};
export const OutputIds = {
  ItemClick: 'itemClick'
};
export const SlotIds = {
  Content: 'content'
};

export const Schemas = {
  Any: {
    type: 'any'
  },
  Object: {
    type: 'object'
  },
  Number: {
    type: 'number'
  },
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
  },
  [InputIds.CurrentDs]: {
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
      }
    }
  }
};
