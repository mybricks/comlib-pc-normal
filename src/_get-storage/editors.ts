import { uuid } from '../utils';
import { EnumStorage, type Data, type PickType } from './types';

const createPick = ({ itemKey } = { itemKey: 'key' }) => {
  const id = uuid();
  return {
    id,
    itemKey
  };
};

const updateOutput = (data: Data, output) => {
  output.get().forEach((port) => {
    const pick = data.picks.find(({ id }) => id === port.id);
    if (!pick) {
      output.remove(port.id);
    } else {
      const { id, itemKey } = pick;
      output.setTitle(id, itemKey);
    }
  });
  data.picks.forEach((item) => {
    const { itemKey, id } = item;
    if (!output.get(id)) {
      output.add({
        id,
        title: itemKey,
        schema: { type: 'any' },
        editable: true,
        deletable: true
      });
    }
  });
};

const updatePicks = (data: Data, output) => {
  const outputsId = output.get().map(({ id }) => id);
  data.picks = data.picks.filter(({ id }) => {
    return outputsId.includes(id);
  });
};

export default {
  '@pinRemoved'({ data, output }) {
    updatePicks(data, output);
  },
  '@init': ({ data, setAutoRun, isAutoRun }: EditorResult<Data>) => {
    const autoRun = isAutoRun ? isAutoRun() : false;
    if (autoRun || data.runImmediate) {
      setAutoRun(true);
      data.runImmediate = true;
    }
  },
  ':root': ({ data }: EditorResult<Data>, cate1) => {
    cate1.title = '取值配置';
    cate1.items = [
      {
        title: '取值方式',
        type: 'select',
        description: '选择从localStorage或sessionStorage中取值',
        options: [
          { label: 'localStorage', value: EnumStorage.LOCAL },
          { label: 'sessionStorage', value: EnumStorage.SESSION }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.storageType;
          },
          set({ data, output }: EditorResult<Data>, val: EnumStorage) {
            data.storageType = val;
          }
        }
      },
      {
        title: '取值列表',
        type: 'array',
        description: `设置需要获取的数据key`,
        options: {
          addText: '添加数据key',
          editable: true,
          draggable: false,
          getTitle(item) {
            return `${item.itemKey}`;
          },
          onAdd() {
            return createPick({ itemKey: 'key' + data.picks.length });
          },
          items: [
            {
              title: 'key',
              type: 'text',
              value: 'itemKey',
              options: {
                placeholder: '输入要获取的key'
              }
            }
          ]
        },
        value: {
          get({ data }: EditorResult<Data>) {
            return [...(data.picks || [])];
          },
          set({ data, output }: EditorResult<Data>, val: Array<PickType>) {
            data.picks = val;
            updateOutput(data, output);
          }
        }
      }
    ];
  }
};
