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
  style?: CSSProperties
}
