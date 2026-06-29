export const OutputIds = {
  Click: 'click'
};
export const InputIds = {
  SetImages: 'setImages',
  AddImages: 'addImages',
  GetImages: 'getImages',
  SetImageStyle: 'setImageStyle'
};

export type ObjectFit = 'fill' | 'contain' | 'cover' | 'none';
export type Layout = 'grid' | 'flex';

export interface ImageItem {
  id: string;
  src: string;
  alt?: string;
  previewImgSrc?: string;
  width?: string | number;
  height?: string | number;
  style?: Record<string, any>;
}

export interface Data {
  images: ImageItem[];

  layout: Layout;
  columns: number;
  gap: number;

  objectFit?: ObjectFit;

  usePreview?: boolean;
  useFallback?: boolean;
  fallbackImgSrc?: string;

  customStyle?: any;

  disableContextMenu?: boolean;
  disableDrag?: boolean;
}
