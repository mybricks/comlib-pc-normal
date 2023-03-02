import type { Data, PickType } from './types';
import { getSuggestionFromSchema, uuid } from './utils';

const createPick = ({ title } = { title: '新取值' }) => {
  const key = uuid();
  return {
    key,
    title,
    expression: ''
  };
};

const updateOutput = (data: Data, output) => {
  const outputsId = output.get().map(({ id }) => id);
  outputsId.forEach((id) => {
    const pick = data.picks.find(({ key }) => key === id);
    if (!pick) {
      output.remove(id);
    } else {
      output.get(pick.key).setTitle(pick.title);
    }
  });
  data.picks.forEach((item) => {
    const { key, title } = item;
    if (!output.get(key)) {
      output.add({
        id: key,
        title,
        schema: {
          type: 'any'
        },
        editable: true,
        deletable: true
      });
    }
  });
};

const updatePicks = (data: Data, output) => {
  const outputsId = output.get().map(({ id }) => id);
  data.picks = data.picks.filter(({ key }) => {
    return outputsId.includes(key);
  });
};

export default {
  '@init': ({ data, output }: EditorResult<Data>) => {
    const initialPick = createPick({ title: '取值' });
    data.picks = [initialPick];
    output.add(initialPick.key, initialPick.title, { type: 'any' });
  },
  '@inputConnected'({ data }, fromPin) {
    data.suggestions = getSuggestionFromSchema(fromPin.schema);
  },
  '@inputUpdated'({ data }: EditorResult<Data>, updatePin) {
    data.suggestions = getSuggestionFromSchema(updatePin.schema);
  },
  '@pinRemoved'({ data, output }) {
    updatePicks(data, output);
  },
  ':root': ({ data }: EditorResult<Data>, cate1) => {
    cate1.title = '取数配置';
    cate1.items = [
      {
        title: '取值列表',
        type: 'array',
        description: `表达式用"{}"包裹，如{a}，级联取值{a.b.c}`,
        options: {
          addText: '添加取值',
          editable: true,
          draggable: false,
          getTitle(item) {
            return `${item.title}[${item.key}]`;
          },
          onAdd() {
            return createPick();
          },
          items: [
            {
              title: '名称',
              type: 'text',
              value: 'title'
            },
            {
              title: '表达式',
              type: 'expression',
              value: 'expression',
              options: {
                suggestions: data.suggestions
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
