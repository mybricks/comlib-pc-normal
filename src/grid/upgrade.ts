import { Data } from './constants';

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  setDeclaredStyle(':root', { ...data.style });
  data.rows.forEach((row) => {
    const { columns, key, backgroundColor } = row;
    setDeclaredStyle(`div[data-row-index=${JSON.stringify(key)}]`, { backgroundColor });
    columns.forEach((col) => {
      const param = `col-${col.key}`;
      const selector = `.ant-row > div[data-type-col="${param}"]`;
      setDeclaredStyle(selector, {
        ...data.globalColStyle,
        ...col.colStyle
      });
    });
  });
  return true;
}
