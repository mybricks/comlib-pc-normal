import type { Data, PickType } from './types';
import { getSuggestionFromSchema, uuid, getOutputSchema } from './utils';
import debounce from 'lodash/debounce';

const createPick = ({ title } = { title: '新取值' }) => {
  const key = uuid();
  return {
    key,
    title,
    expression: ''
  };
};

const updateOutput = (data: Data, output) => {
  output.get().forEach((port) => {
    const pick = data.picks.find(({ key }) => key === port.id);
    if (!pick) {
      output.remove(port.id);
    } else {
      port.setTitle(pick.title);
    }
  });
  data.picks.forEach((item) => {
    const { key, title } = item;
    if (!output.get(key)) {
      output.add({
        id: key,
        title,
        schema: data.inputSchema,
        editable: true,
        deletable: true
      });
    }
  });
};

const updateOutputSchema = debounce((data: Data, output) => {
  output.get().forEach((port) => {
    const pick = data.picks.find(({ key }) => key === port.id);
    if (!pick) return true;
    const outputSchema = getOutputSchema(pick.expression, data.inputSchema);
    port.setSchema(outputSchema);
  });
}, 1000);

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
  '@inputConnected'({ data, output }, fromPin) {
    data.suggestions = getSuggestionFromSchema(fromPin.schema);
    data.inputSchema = fromPin.schema;
    updateOutputSchema(data, output);
  },
  '@inputUpdated'({ data }: EditorResult<Data>, updatePin) {
    data.suggestions = getSuggestionFromSchema(updatePin.schema);
    data.inputSchema = updatePin.schema;
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
        description: `取值表达式约定以“inputValue”开头，如对象取值“{inputValue.a}”，数组取值“{inputValue[0]}”，联合取值“{{a: inputValue.a, b: inputValue.b}}”`,
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
                suggestions: data.suggestions,
                placeholder: '输入表达式如{inputValue.a}',
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
            updateOutputSchema(data, output);
          }
        }
      }
    ];
  }
};
