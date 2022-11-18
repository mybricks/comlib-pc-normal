import { Data, OutputIds, Schemas } from './constants';
import { getInputOrder, getOutputSchema } from './utils';

export default {
  '@inputUpdated'({ input, output }: EditorResult<Data>, updatePin) {
    if (updatePin.id !== OutputIds.Output) {
      output.get(OutputIds.Output).setSchema(getOutputSchema(input));
    }
  },
  '@inputConnected'({ output, input }: EditorResult<Data>) {
    output.get(OutputIds.Output).setSchema(getOutputSchema(input));
  },
  '@inputDisConnected'({ output, input }: EditorResult<Data>) {
    output.get(OutputIds.Output).setSchema(getOutputSchema(input));
  },
  ':root': [
    {
      title: '添加输入项',
      type: 'Button',
      value: {
        set({ input }: EditorResult<Data>) {
          const idx = getInputOrder({ input });
          const title = `输入项${idx}`;
          const hostId = `input${idx}`;
          input.add(hostId, title, Schemas.Follow, true);
        }
      }
    },
    {
      title: '是否合并',
      type: 'switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return !!data.isMerge;
        },
        set({ data }: EditorResult<Data>, val: boolean) {
          data.isMerge = val;
        }
      }
    }
  ]
};
