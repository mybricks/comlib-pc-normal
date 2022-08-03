export type QRType = 'svg' | 'canvas';
export interface QRICON {
  url: string;
  width: string;
  height: string;
}
export interface Data {
  link: string;
  renderAs?: QRType;
  size?: number;
  icon?: QRICON;
  hasIcon?: boolean;
}
