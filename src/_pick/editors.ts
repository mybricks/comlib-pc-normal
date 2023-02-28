import type { Data, SuggestionType } from './types';
import { getSuggestionFromSchema } from './utils';

let suggestions: SuggestionType[] = [];
export default {
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
      title: '取值表达式',
      type: 'expression',
      description: `表达式用"{}"包裹，如{a}，级联取值{a.b.c}`,
      options: {
        suggestions
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.expression;
        },
        set({ data }: EditorResult<Data>, val: string) {
          data.expression = val;
        }
      }
    }
  ]
};
