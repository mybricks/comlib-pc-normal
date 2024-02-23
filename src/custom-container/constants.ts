import { CSSProperties } from 'react';

export enum InputIds {
  ScrollIntoView = 'scrollInfoView',
  SetMaxHeight = 'setMaxHeight',
  SetStyle = 'setStyle',
  ScrollTo = 'scrollTo'
}
export enum OutputIds {
  Click = 'click'
}
export enum SlotIds {
  Content = 'content'
}

export enum BehaviorEnum {
  Auto = 'auto',
  Smooth = 'smooth'
}
export enum PositionEnum {
  Start = 'start',
  Center = 'center',
  End = 'end',
  Nearest = 'nearest'
}
export enum OverflowEnum {
  Hidden = 'hidden',
  Auto = 'auto',
  Unset = 'unset'
}
export interface Data {
  style: CSSProperties;
  styleCatelog?: string;
  useHoverStyle?: boolean;
  hoverStyle?: CSSProperties;

  useSrcollIntoView?: boolean;
  behavior?: BehaviorEnum;
  block?: PositionEnum;
  inline?: PositionEnum;

  overflowY?: OverflowEnum;
  overflowX?: OverflowEnum;
  useOverflowUnset?: boolean;

  useClick?: boolean;

  slotStyle?: CSSProperties;

  id?: string;
  useFixed?: boolean;
  //configs style
  legacyConfigStyle: CSSProperties;
  //style editor暂不支持的style
  legacyStyle: CSSProperties;

  //自动滚动开关
  isAutoScroll: boolean;
  direction: 'horizontal'|'vertical';
  scrollTime: number;
}
