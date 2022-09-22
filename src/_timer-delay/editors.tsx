import { uuid } from '../utils';
import { Data, InputIds, OutputIds, Schemas } from './constants';

const setDescByData = ({ data, setDesc }: { data: Data; setDesc }) => {
  const { delay } = data;
  const info = [`延迟${delay}ms执行`];
  setDesc(info.join('\n'));
};

export default {
  '@inputUpdated'({ output }: EditorResult<Data>, pin) {
    if (pin.id === InputIds.Trigger) {
      output.get(OutputIds.Trigger).setSchema(pin.schema);
    }
  },
  '@inputDisConnected'({ output }: EditorResult<Data>, fromPin, toPin) {
    if (toPin.id === InputIds.Trigger) {
      output.get(OutputIds.Trigger).setSchema(Schemas.Any);
    }
  },
  '@init': ({ data, setDesc }: EditorResult<Data>) => {
    data.id = uuid();
    setDescByData({ data, setDesc });
  },
  ':root': [
    {
      title: '延迟时间（ms）',
      type: 'text',
      options: {
        type: 'number'
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.delay;
        },
        set({ data, setDesc }: EditorResult<Data>, value: string) {
          data.delay = parseInt(`${value}`, 10) || 0;
          setDescByData({ data, setDesc });
        }
      }
    }
  ]
};
