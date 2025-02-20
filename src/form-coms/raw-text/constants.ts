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

export enum ContextTypeEnum {
  Text = 'text',
  Number = 'number'
}

export interface Data {
  title: string
  tips?: string
  content: string | number;
  contentType: ContextTypeEnum;
  align?: AlignTypeEnum;
  style: React.CSSProperties;
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
