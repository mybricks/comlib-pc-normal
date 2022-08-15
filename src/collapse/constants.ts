/**
 * 数据源
 * @param title 标题
 */
export interface Data {
  title: string;
  expanded?: boolean;
  useDynamicTitle?: boolean;
  useDynamicExpand?: boolean;
  useExtra?: boolean;
}

export const InputIds = {
  Title: 'title',
  Expanded: 'expanded',
  Folded: 'folded'
};

export const OutputIds = {
  ExpandedChange: 'expandedChange',
};

export const SlotIds = {
  Content: 'content',
  Extra: 'extra'
};

export const Schemas = {
  Title: {
    type: 'string'
  },
  Expanded: {
    type: 'any'
  },
  Folded: {
    type: 'any'
  },
  ExpandedChange: {
    type: 'boolean'
  }
};
