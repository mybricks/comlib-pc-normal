import { CSSProperties } from 'react'
export type Placement = "top" | "bottom" | "left" | "right";
export type Trigger = "hover" | "focus" | "click";
export interface Data {
  title: string;
  placement?: Placement;
  trigger?: Trigger;
  style?: CSSProperties
}
