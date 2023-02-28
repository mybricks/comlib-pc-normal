import type { Data, PickType, SuggestionType } from './types';
import { getSuggestionFromSchema, uuid } from './utils';

const createPick = () => {
  return {
    key: uuid(),
    title: '新取值',
    expression: ''
  };
};

const updateOutput = (data, output) => {
    const outputs = output.get()
    
};

let suggestions: SuggestionType[] = [];
export default {
  '@init': ({ style, data, output }: EditorResult<Data>) => {
    const initialPick = {
      key: 'pick0',
      title: '取值',
      expression: ''
    };
    data.picks = [initialPick];
    output.add(initialPick.key, initialPick.title, { type: 'any' });
  },
  '@inputConnected'({ data, output }, fromPin) {
    data.suggestions = getSuggestionFromSchema(fromPin.schema);
  },
  //   ':root': ({ data }: EditorResult<Data>, cate1) => {
  //     cate1.title = '取数配置';
  //     cate1.items = [
  //       {
  //         title: '取值表达式',
  //         type: 'expression',
  //         options: {
  //           suggestions: data.suggestions
  //         },
  //         value: {
  //           get({ data }: EditorResult<Data>) {
  //             return data.expression;
  //           },
  //           set({ data }: EditorResult<Data>, val: string) {
  //             data.expression = val;
  //           }
  //         }
  //       }
  //     ];
  //   },
  ':root': [
    {
      title: '',
      type: 'array',
      options: {
        addText: '添加取值',
        editable: true,
        getTitle(item) {
          return item.title;
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
            description: `表达式用"{}"包裹，如{a}，级联取值{a.b.c}`,
            options: {
              suggestions
            }
          }
        ]
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return [...(data.picks || [])];
        },
        set({ data, output, input, slot }: EditorResult<Data>, val: Array<PickType>) {
          data.picks = val;
          updateOutput(data, output);
        }
      }
    }
    // {
    //   title: '取值表达式',
    //   type: 'expression',
    //   description: `表达式用"{}"包裹，如{a}，级联取值{a.b.c}`,
    //   options: {
    //     suggestions
    //   },
    //   value: {
    //     get({ data }: EditorResult<Data>) {
    //       return data.expression;
    //     },
    //     set({ data }: EditorResult<Data>, val: string) {
    //       data.expression = val;
    //     }
    //   }
    // }
  ]
};
