type TextType = 'secondary' | 'danger' | 'warning' | undefined;

export type AlignType = "left" | "center" | "right";

export interface Data {
  content: string;
  align?: AlignType;
  style?: Record<string, any>;
  stylePadding?: number[];
  textType?: TextType;
  click?: boolean;
  outputContent?: string;
  isEllipsis: boolean;
  ellipsis?: Record<string, any>;
}
