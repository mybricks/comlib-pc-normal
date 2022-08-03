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
  cursorStyle?: boolean;
}

export interface Data {
  image: ImageItem;
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
