export interface ImageItem {
  id: string;
  title: string;
  alt: string;
  src: string;
  fallback?: string;
  width?: string | number;
  height?: string | number;
  margin: [number, number, number, number];
  placeholder?: boolean | ImageItem;
  preview?:
    | {
        src?: string;
      }
    | boolean;
  customBorderStyle?: {
    [prop: string]: string;
  };
  supportFallback?: boolean;
}

export interface Data {
  images: ImageItem | ImageItem[];
  dataSource: 1 | 2;
  configMode: 1 | 2;
  config: {
    width?: number | string;
    height?: number | string;
    margin: [number, number, number, number];
    placeholder?: boolean | ImageItem;
    preview?:
      | {
          src?: string;
        }
      | boolean;
    customBorderStyle?: {
      [prop: string]: string;
    };
    supportFallback?: boolean;
    fallback?: string;
  };
}

export const DEFAULT_IMAGE =
  'https://js-ec.static.yximgs.com/udata/pkg/ks-merchant/cps-hybrid/empty_position.9b16b85c5a152402.png';

export enum STYLE {
  WIDTH = 200,
  HEIGHT = 200
}

export const InputIds = {
  Image: 'image',
  SlotProps: 'slotProps'
};
