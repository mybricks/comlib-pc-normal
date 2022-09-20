/**
 * 数据源
 * @param loadingText loading文案
 */
export interface Data {
  loadingText: string;
  size: 'small' | 'default' | 'large';
  style: React.CSSProperties;
  maskStyle: React.CSSProperties;
}

export const InputIds = {
  Open: 'open',
  Close: 'close'
};
