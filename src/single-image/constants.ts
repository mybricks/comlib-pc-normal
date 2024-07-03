export const OutputIds = {
  Click: 'click'
};
export const InputIds = {
  SetImgSrc: 'setImgSrc',
  SetPreviewImgSrc: 'setPreviewImgSrc'
};

export type ObjectFit = 'fill' | 'contain' | 'cover' | 'none';

export interface Data {
  src: string;
  alt?: string;

  usePreview?: boolean;
  previewImgSrc?: string;

  useFallback?: boolean;
  fallbackImgSrc?: string;

  objectFit?: ObjectFit;

  customStyle?: any;

  disableContextMenu?: boolean; // 禁止右键下载
  disableDrag?: boolean; // 禁止拖拽图片
}
