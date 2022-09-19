import { CSSProperties } from 'react';
import { Actions } from '../utils/history';

export interface Data {
  content: string;
  url: string;
  routeType: Actions | 'customEvent';
  isChoose: boolean;
  icon?: string;
  location?: string;
  useHoverStyle?: boolean;
  styleCatelog?: string;
  style?: CSSProperties;
  hoverStyle?: CSSProperties;
}

export const InputIds = {
  SetUrl: 'url',
  SetContent: 'content'
};
