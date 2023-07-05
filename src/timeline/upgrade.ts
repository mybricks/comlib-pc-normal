import { Data } from './constants';

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  (data.timelines || []).forEach((timeline) => {
    const { color, id } = timeline;
    const selector = `ul.ant-timeline > li[data-timeline-id="${id}"] > div.ant-timeline-item-head`;
    if(!!color){
      setDeclaredStyle(selector, { borderColor: color });
      timeline.color = ''
    }
  });
  return true;
}
