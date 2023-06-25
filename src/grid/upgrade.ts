import { Data } from './constants';

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  setDeclaredStyle('.root', { ...data.style });
  data.rows.forEach((row, rowIndex) => {
    const { columns, backgroundColor } = row;
    setDeclaredStyle(`.root > .ant-row:nth-child(${rowIndex + 1})`, { backgroundColor });
    columns.forEach((col, colIndex) => {
      const selector = `.root > .ant-row:nth-child(${rowIndex + 1}) > .ant-col:nth-child(${
        colIndex + 1
      })`;
      setDeclaredStyle(selector, {
        ...data.globalColStyle,
        ...col.colStyle
      });
    });
  });
  return true;
}
