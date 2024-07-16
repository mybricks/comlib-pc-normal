import React, { CSSProperties } from "react";
export type Placement = "top" | "bottom" | "left" | "right";
export type Trigger = "hover" | "focus" | "click";
export interface Data {
  title: string | React.ReactNode;
  content: string | React.ReactNode;
  placement?: Placement;
  trigger?: Trigger;
  useTitleSlot?: boolean;
  useContentSlot?: boolean;
  style?: CSSProperties;
  slotStyle?: Object; 
  /** 编辑态隐藏自定义标题和内容时的弹出层面板 */
  hidePopupPanel?: boolean
}
