import { CSSProperties } from 'react';
export interface Data {
  src: string;
  autoplay?: boolean;
  controls?: boolean;
  poster?: string;
  usePoster?: boolean;
  style?: CSSProperties;
  loop?: boolean;
  dynamicSrc?: boolean
}

export enum VideoType {
  MP4 = 'mp4',
  HLS = 'm3u8',
  RTMP = 'rtmp',
  FLV = 'flv',
  MOV = 'mov'
}
