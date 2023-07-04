import { Data } from './constants';
import { getFilterSelector } from '../utils/cssSelector';

export default function ({
  id,
  input,
  output,
  data,
  setDeclaredStyle
}: UpgradeParams<Data>): boolean {
  setDeclaredStyle(`.root${getFilterSelector(id)}`, { ...data.style });
  data.rows.forEach((row, rowIndex) => {
    const { columns, backgroundColor } = row;
    setDeclaredStyle(`.root > .ant-row:nth-child(${rowIndex + 1})${getFilterSelector(id)}`, {
      backgroundColor
    });
    columns.forEach((col, colIndex) => {
      const selector = `.root > .ant-row:nth-child(${rowIndex + 1}) > .ant-col:nth-child(${
        colIndex + 1
      })${getFilterSelector(id)}`;
      const { backgroundColor, ...colStyle } = col.colStyle || {};
      setDeclaredStyle(selector, {
        ...data.globalColStyle,
        //去掉bg测试脏数据
        backgroundColor: backgroundColor === '#000' ? 'inherit' : backgroundColor,
        ...colStyle
      });
    });
  });
  return true;
}
