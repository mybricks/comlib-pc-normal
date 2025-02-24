export function formatNumberWithChineseUnits(num: number, decimals: number = 2) {
  if (num === undefined || num === null) return '0';

  // 处理小数位数，但不要丢失小数部分
  const numStr = num.toString();
  const [integerPart, decimalPart] = numStr.split('.');

  // 处理整数部分
  let billion = Math.floor(Number(integerPart) / 100000000);
  let million = Math.floor((Number(integerPart) % 100000000) / 10000);
  let thousand = Number(integerPart) % 10000;

  // 构建结果字符串
  let result = '';

  // 处理整数部分的单位显示
  if (billion > 0) {
    result += billion + '亿';
    if (million > 0) {
      result += million + '万';
    }
    if (thousand > 0) {
      result += thousand;
    }
  } else if (million > 0) {
    result += million + '万';
    if (thousand > 0) {
      result += thousand;
    }
  } else {
    result += thousand;
  }

  // 添加小数部分
  if (decimalPart) {
    result += '.' + decimalPart;
  }

  return result;
}
