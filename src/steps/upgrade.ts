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

  /**
   * @description v1.0.18 新增【设置步骤完成】关联输出项
   */
  const stepsSchema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: {
          type: 'string'
        },
        title: {
          type: 'string'
        },
        subTitle: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
        iconSrc: {
          type: 'string'
        },
        iconSize: {
          type: 'enum',
          items: [
            {
              type: 'number'
            },
            {
              type: 'number'
            }
          ]
        }
      }
    }
  };
  if (input.get('setSteps') && !output.get('setStepsDone')) {
    output.add('setStepsDone', '设置步骤完成', stepsSchema);
    input.get('setSteps').setRels(['setStepsDone']);
  }
  return true;
}
