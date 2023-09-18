import { Data } from './constants';
import { getFilterSelector } from '../utils/cssSelector';
import { isEmptyObject } from '../utils';

export default function ({
  id,
  input,
  output,
  data,
  setDeclaredStyle
}: UpgradeParams<Data>): boolean {
  if (!isEmptyObject(data.style)) {
    setDeclaredStyle(`.root${getFilterSelector(id)}`, { ...data.style });
    data.style = {};
  }
  data.rows.forEach((row, rowIndex) => {
    const { columns, backgroundColor } = row;
    if (!!backgroundColor) {
      setDeclaredStyle(`.root > .ant-row:nth-child(${rowIndex + 1})${getFilterSelector(id)}`, {
        backgroundColor
      });
      row.backgroundColor = '';
    }
    columns.forEach((col, colIndex) => {
      const coordinate = `${row.key},${col.key}`
      const selector = `.root > .ant-row > div[data-col-coordinate="${coordinate}"]${getFilterSelector(id)}`;
      const { backgroundColor, ...colStyle } = col.colStyle || {};
      const dataStyle = {
        ...data.globalColStyle,
        ...colStyle
      };
      if (!isEmptyObject(dataStyle)) {
        //去掉bg测试脏数据
        setDeclaredStyle(selector, {
          ...dataStyle,
          backgroundColor: backgroundColor === '#000' ? 'inherit' : backgroundColor
        });
        data.globalColStyle = {};
        col.colStyle = {}
      }
    });
  });
  return true;
}
