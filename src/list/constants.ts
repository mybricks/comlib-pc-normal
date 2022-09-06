import { ListGridType, ListItemLayout } from 'antd/lib/list';

export enum InputIds {
  DATA_SOURCE = 'dataSource',
  LOADING = 'loading',

  GetDataSource = 'getdataSource'
}
export enum OutputIds {
  GetDataSource = 'getdataSource'
}

export enum LayoutTypeEnum {
  Grid = 'grid',
  Flex = 'flex'
}

export enum FlexDirectionEnum {
  Column = 'column',
  ColumnReverse = 'column-reverse',
  Row = 'row',
  RowReverse = 'row-reverse'
}
export enum FlexWrapEnum {
  Nowrap = 'nowrap',
  Wrap = 'wrap',
  WrapReverse = 'wrap-reverse'
}
export enum FlexAlignEnum {
  FlexStart = 'flex-start',
  FlexEnd = 'flex-end',
  Center = 'center',
  SpaceBetween = 'space-between',
  SpaceAround = 'space-around'
}

export interface Data {
  layoutType?: LayoutTypeEnum;
  dataSource: any[];

  layout: ListItemLayout;
  grid: ListGridType;

  useLoading?: boolean;
  useGetDataSource?: boolean;

  flexStyle?: React.CSSProperties;
  flexAlign: FlexAlignEnum;
}
