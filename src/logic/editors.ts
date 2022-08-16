import { Logic, Data } from './types';

export default {
  ':root': [
    {
      title: '添加输入项',
      type: 'button',
      value: {
        set({ data, input }: EditorResult<Data>, val: string) {
          const idx = getInputOrder({ data, input });
          const title = `输入项${idx}`;
          const hostId = `input${idx}`;
          input.add(
            hostId,
            title,
            {
              type: 'follow'
            },
            true,
            1
          );
        }
      }
    },
    {
      title: '逻辑关系',
      type: 'select',
      options: [
        {
          label: '与',
          value: Logic.AND
        },
        {
          label: '或',
          value: Logic.OR
        }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.logic;
        },
        set({ data }: EditorResult<Data>, val: string) {
          data.logic = val;
        }
      }
    }
  ]
};

const getInputOrder = ({ data, input }) => {
  if (data.inputCount === void 0) {
    data.inputCount = Object.keys(input.get()).length;
  }
  return data.inputCount++;
};
