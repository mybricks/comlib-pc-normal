export enum JustifyTypeEnum {
  Start = 'start',
  End = 'end',
  Center = 'center',
  SpaceAround = 'space-around',
  SpaceBetween = 'space-between'
}
export enum AlignTypeEnum {
  Top = 'top',
  Middle = 'middle',
  Bottom = 'bottom',
  Stretch = 'stretch'
}
export enum WidthUnitEnum {
  Px = 'px',
  Auto = 'auto',
  Span = 'span',
  Media = '@media',
  Percent = '%'
}
export enum OverflowEnum {
  Auto = 'auto',
  None = 'hidden'
}

export interface ColumnParams {
  key: string;
  slot: string;
  span: number;
  colStyle?: React.CSSProperties;

  widthOption: WidthUnitEnum;
  width: number;
  // 响应式宽度
  breakPoints?: Object;

  // 最大/最小宽度单位
  minMaxWidthOption?: WidthUnitEnum;
  minWidth?: number;
  maxWidth?: number;
  flex: number;
  useClick?: boolean;
  slotStyle?: React.CSSProperties;
   //style editor暂不支持的style
  legacyStyle: React.CSSProperties;
}

export interface IRow {
  key: string;
  columns: ColumnParams[];
  justify: JustifyTypeEnum;
  align: AlignTypeEnum;
  wrap?: boolean;
  backgroundColor?: string;
  gutter: number | object | [number, number];
}

export interface Data {
  rows: IRow[];
  style: React.CSSProperties;
  widthUnit?: string;
  globalColStyle?: React.CSSProperties
}
