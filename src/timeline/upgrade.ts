import { Data } from './constants';

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  (data.timelines || []).forEach(({ color, id }) => {
    const selector = `ul.ant-timeline > li[data-timeline-id="${id}"] > div.ant-timeline-item-head`;
    setDeclaredStyle(selector, { borderColor: color });
  });
  return true;
}
