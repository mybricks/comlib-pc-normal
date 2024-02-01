import { Data, InputIds, OutputIds } from './constants';

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  (data.timelines || []).forEach((timeline) => {
    const { color, id } = timeline;
    const selector = `ul.ant-timeline > li[data-timeline-id="${id}"] > div.ant-timeline-item-head`;
    if(!!color){
      setDeclaredStyle(selector, { borderColor: color });
      timeline.color = ''
    }
  });
  const setDataSource = input.get(InputIds.SetDataSource)
  const setDataSourceComplete = output.get(OutputIds.SetDataSourceComplete)
  if(setDataSource && !setDataSourceComplete) {
    output.add(OutputIds.SetDataSourceComplete, '完成', {type: 'any'})
    setDataSource.setRels([OutputIds.SetDataSourceComplete])
  }
  return true;
}
