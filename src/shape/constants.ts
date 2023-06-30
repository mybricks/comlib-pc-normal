import { CSSProperties } from 'react';
/**
 * 数据源
 * @export
 * @interface ShapeProps
 * @param type 形状
 * @param style 样式
 * @param rotate 旋转角度
 * @param isImgRotate 图片是否跟随旋转
 * @param size 内容大小
 * @param image 图片地址
 */
export interface ShapeProps {
  type: ShapeType;
  style: CSSProperties;
  rotate: number;
  isImgRotate: boolean;
  size: number;
  image?: string;
}

export type ShapeType = "circle" | "square" | "triangle" | "ellipse";

export const clipPaths: Record<ShapeType, string> = {
  square: "inset(0)",
  ellipse: "ellipse(50% 25% at 50% 50%)",
  circle: "circle(50% at 50% 50%)",
  triangle: "polygon(50% 0%, 0% 100%, 100% 100%)",
};