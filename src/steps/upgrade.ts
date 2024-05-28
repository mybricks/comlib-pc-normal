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

  const nextStepComplete = output.get('nextStepComplete')
  if(!nextStepComplete) {
    output.add('nextStepComplete', '完成', {type: 'any'})
    input.get('nextStep').setRels(['nextStepComplete'])
  }

  const prevStepComplete = output.get('prevStepComplete')
  if(!prevStepComplete) {
    output.add('prevStepComplete', '完成', {type: 'any'})
    input.get('prevStep').setRels(['prevStepComplete'])
  }

  const jumpToComplete = output.get('jumpToComplete')
  if(!jumpToComplete) {
    output.add('jumpToComplete', '完成', {type: 'any'})
    input.get('jumpTo').setRels(['jumpToComplete'])
  }

  const setHideStepsComplete = output.get('setHideStepsComplete')
  if(!setHideStepsComplete) {
    output.add('setHideStepsComplete', '完成', {type: 'any'})
    input.get('setHideSteps').setRels(['setHideStepsComplete'])
  }

  /**
   * @description v1.0.24 改变title
   */
  if (input.get('nextStep').title === "显示下一步") {
    input.get('nextStep').setTitle('下一步');
  }
  if (input.get('prevStep').title === "显示上一步") {
    input.get('prevStep').setTitle('上一步');
  }
  //=========== v1.1.3 end ===============


  /**
   * @description v1.0.25 校准jumpTo.Title
   */
  input.setTitle('jumpTo', `跳转（0～${data.stepAry.length - 1}）`)

  return true;
}
