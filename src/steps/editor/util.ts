import { Data, INTO, LEAVE, CLICK } from '../constants';

export const addSlot = (slots, id, title) => {
  slots.add({
    id,
    title
  });
};

export const addEventIO = (output, id, title) => {
  output.add(`${id}${INTO}`, `${title}显示`, { type: 'any' });
  output.add(`${id}${LEAVE}`, `${title}隐藏`, { type: 'any' });
  output.add(`${id}${CLICK}`, `${title}点击时`, { type: 'any' });
};

export const removeEventIO = (output, id) => {
  output.remove(`${id}${INTO}`);
  output.remove(`${id}${LEAVE}`);
};


export const updateIOTitle = (output, id, title) => {
  output.setTitle(`${id}${INTO}`, `${title}显示`);
  output.setTitle(`${id}${LEAVE}`, `${title}隐藏`);
};

export const updateNextIOTitle = () => {};

export const setDynamicStepsIO = (props: EditorResult<Data>, hasPower: boolean) => {
  const { input, output } = props;
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
  if (!!hasPower) {
    input.add('setSteps', '设置步骤', stepsSchema);
    output.add('setStepsDone', '设置步骤完成', stepsSchema);
    input.get('setSteps').setRels(['setStepsDone']);
    output.add('onStepChange', '步骤改变', { type: 'number' });
  } else {
    if (input.get('setSteps')) {
      input.remove('setSteps');
    }
    if(output.get('setStepsDone')){
      output.remove('setStepsDone');
    }
    if(output.get('onStepChange')){
      output.remove('onStepChange');
    }
  }
};
