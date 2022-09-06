import { CSSProperties } from 'react';

export enum InputIds {
  ScrollIntoView = 'scrollInfoView',
  SetMaxHeight = 'setMaxHeight'
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
  Auto = 'auto'
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

  useClick?: boolean;
}
