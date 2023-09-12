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
  style: React.CSSProperties;
  useClick?: boolean;
  outputContent?: string;
  isEllipsis: boolean;
  ellipsis: Record<string, any>;

  useDynamicStyle?: boolean;

  useHoverStyle?: boolean;
  styleCatelog?: string;
  hoverStyle?: Record<string, any>;
  legacyConfigStyle: React.CSSProperties;
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
