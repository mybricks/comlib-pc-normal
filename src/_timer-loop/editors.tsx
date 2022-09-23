import { uuid } from '../utils';
import { Data, InputIds, OutputIds, Schemas } from './constants';

const setDescByData = ({ data, setDesc }: { data: Data; setDesc }) => {
  const { delay, immediate } = data;
  const info = [immediate && '立即执行一次', `每${delay}ms执行一次`];
  setDesc(info.filter((item) => !!item).join('\n'));
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
      title: '循环时间（ms）',
      type: 'Text',
      options: {
        type: 'Number'
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
    },
    {
      title: '立即触发',
      description: '开启后会立即触发一次执行',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.immediate;
        },
        set({ data, setDesc }: EditorResult<Data>, value: boolean) {
          data.immediate = value;
          setDescByData({ data, setDesc });
        }
      }
    },
    {
      title: '取消操作',
      description: '开启后，支持取消当前循环执行',
      type: 'Switch',
      value: {
        get({ data }: EditorResult<Data>) {
          return data.useCancel;
        },
        set({ data, input }: EditorResult<Data>, value: boolean) {
          data.useCancel = value;
          if (value) {
            input.add(InputIds.Cancel, '取消', Schemas.Any);
          } else {
            input.remove(InputIds.Cancel);
          }
        }
      }
    }
  ]
};
