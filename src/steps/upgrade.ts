import { Data, CLICK } from './constants';

export default function ({ input, output, data }: UpgradeParams<Data>): boolean {
  if (!input.get('setHideSteps')) {
    input.add('setHideSteps', '设置隐藏步骤', { type: 'array', items: { type: 'number' } });
  }

  data.stepAry
    .forEach((step) => {
      const clickOutputId = `${step.id}${CLICK}`;
      if (!output.get(clickOutputId)) {
        output.add(clickOutputId, `${step.title}点击时`, { type: 'any' });
      }
    });

  return true;
}
