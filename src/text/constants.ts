export enum AlignTypeEnum {
  Left = 'left',
  Center = 'center',
  Right = 'right'
}
export enum CursorTypeEnum {
  Pointer = 'pointer',
  Default = 'default'
}
export enum WhiteSpaceEnum {
  PreWrap = 'pre-wrap',
  NoWrap = 'nowrap'
}

export interface Data {
  content: string;
  align?: AlignTypeEnum;
  style: Record<string, any>;
  useClick?: boolean;
  outputContent?: string;
  isEllipsis: boolean;
  ellipsis: Record<string, any>;

  useDynamicStyle?: boolean;
}

export const InputIds = {
  SetContent: 'content',
  SetStyle: 'setStyle'
};
export const OutputIds = {
  Click: 'click'
};
export const Schemas = {
  String: {
    type: 'string'
  },
  Style: {
    type: 'object',
    properties: {
      color: {
        type: 'string'
      },
      fontSize: {
        type: 'string'
      },
      fontWeight: {
        type: 'number'
      }
    }
  }
};
