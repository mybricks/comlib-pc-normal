import { CSSProperties } from 'react';
export type Align =
  | 'auto'
  | 'horizontal-start'
  | 'horizontal-center'
  | 'horizontal-end'
  | 'vertical-start'
  | 'vertical-center'
  | 'vertical-end';
export type TextType = 'secondary' | 'danger' | 'warning' | undefined;
export type Color = 'success' | 'processing' | 'error' | 'warning' | 'default';
export type Description = { label: string; key: string; value: any };
export interface Item {
  // 1 可视化配置 2 外部输入
  src: 1 | 2;
  key: string;
  type: 'Link' | 'Text' | 'Tag' | 'PicAndText' | 'Description';
  content: string | Description[];
  oldcontent: string | Description[];
  textType?: TextType;
  fontSize?: number;
  fontStyle?:
    | 'normal'
    | 'bold'
    | 'bolder'
    | 'lighter'
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900;
  color?: Color;
  title?: string;
  size?: 'default' | 'small' | 'middle';
  layout?: 'horizontal' | 'vertical';
  column?: number;
  stylePadding?: number[];
  style?: {
    [prop: string]: string | number;
  };
  click?: boolean;
  outputContent?: string;
  link?: string;
  useAppend?: boolean;
  align?: 'left' | 'center' | 'right';
  active?: boolean;
}
// 数据源
export interface Data {
  align: Align;
  margin: number;
  items: Item[];
  flexStyle?: any;
  style: CSSProperties;
  itemList: Item[];

  //是否统一样式
  isUnity: boolean;
  //统一间距
  padding: [number, number];
  //唯一标识
  rowKey: string;
}
