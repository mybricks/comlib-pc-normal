/**
 * 数据源
 * @param loadingText loading文案
 */
export interface Data {
  loadingText: string;
  size: 'small' | 'default' | 'large';
  style: React.CSSProperties;
  maskStyle: React.CSSProperties;

  closeLoading?: boolean;
}

export const InputIds = {
  Trigger: 'open',
  Open: 'open',
  Close: 'close'
};

export const OutputIds = {
  Finish: 'finish'
}