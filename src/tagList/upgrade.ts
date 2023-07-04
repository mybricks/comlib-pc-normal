import { Data } from './types';

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  const { tagStyle } = data;
  if (!data.appendBtn) {
    data.appendBtn = {
      text: '新增',
      icon: 'PlusOutlined'
    };
  }
  data.tags.forEach(({ borderColor, color, textColor }, index) => {
    const selector = `div[data-root] span[data-index="${index}"]`;
    const style = {
      background: color || tagStyle?.color,
      color: textColor || tagStyle?.textColor,
      borderColor: borderColor || tagStyle?.borderColor
    };
    setDeclaredStyle(selector, style);
  });
  return true;
}
