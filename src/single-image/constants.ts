export const OutputIds = {
  Click: 'click'
};
export const InputIds = {
  SetImgSrc: 'setImgSrc',
  SetPreviewImgSrc: 'setPreviewImgSrc'
};

export interface Data {
  src: string;
  alt?: string;

  usePreview?: boolean;
  previewImgSrc?: string;

  useFallback?: boolean;
  fallbackImgSrc?: string;

  customStyle?: any;
}
