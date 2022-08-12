export type AlignType = "left" | "center" | "right";

type TextType = 'secondary' | 'danger' | 'warning' | undefined;

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
