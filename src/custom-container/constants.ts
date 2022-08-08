import { CSSProperties } from 'react';

export enum InputIds {
  SlotProps = 'slotProps',
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
type OverflowProps = 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto';

export interface Data {
  id: string;
  useSlotProps?: boolean;

  styleCatelog?: string;
  useHoverStyle?: boolean;
  style?: CSSProperties;
  hoverStyle?: CSSProperties;

  useSrcollIntoView?: boolean;
  behavior?: BehaviorEnum;
  block?: PositionEnum;
  inline?: PositionEnum;

  overflowY?: OverflowProps;
  overflowX?: OverflowProps;

  useClick?: boolean;

  useSetMaxHeight?: boolean;

  useFixed?: boolean;
}
