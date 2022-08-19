import { ResolveType, Data } from './types';

export default {
  ':root': [
    {
      title: '处理类型',
      type: 'select',
      options: [
        {
          label: '分割',
          value: ResolveType.SPLIT
        },
        {
          label: '拼接',
          value: ResolveType.JOIN
        },
        {
          label: '替换',
          value: ResolveType.REPLACE
        }
      ],
      value: {
        get({ data }: EditorResult<Data>) {
          return data.resolveType;
        },
        set({ data, input, output }: EditorResult<Data>, val: string) {
          data.resolveType = val;
          const inputPin = input.get('input');
          const outputPin = output.get('output');
          let inputSchema = { type: 'any' },
            outputSchema = { type: 'any' };
          switch (val) {
            case ResolveType.SPLIT:
              inputSchema = { type: 'string' };
              outputSchema.type = 'array';
              outputSchema['items'] = { type: 'string' };
              break;
            case ResolveType.REPLACE:
              inputSchema = { type: 'string' };
              outputSchema = { type: 'string' };
              break;
            case ResolveType.JOIN:
              inputSchema = { type: 'array' };
              outputSchema = { type: 'string' };
              break;
          }
          inputPin.setSchema(inputSchema);
          outputPin.setSchema(outputSchema);
        }
      }
    },
    {
      title: '分割符',
      type: 'text',
      ifVisible({ data }: EditorResult<Data>) {
        return data.resolveType === ResolveType.SPLIT;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.splitChar;
        },
        set({ data }: EditorResult<Data>, val: string) {
          data.splitChar = val;
        }
      }
    },
    {
      title: '拼接符',
      type: 'text',
      ifVisible({ data }: EditorResult<Data>) {
        return data.resolveType === ResolveType.JOIN;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.joinChar;
        },
        set({ data }: EditorResult<Data>, val: string) {
          data.joinChar = val;
        }
      }
    },
    {
      title: '目标字符',
      type: 'text',
      ifVisible({ data }: EditorResult<Data>) {
        return data.resolveType === ResolveType.REPLACE;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.targetChar;
        },
        set({ data }: EditorResult<Data>, val: string) {
          data.targetChar = val;
        }
      }
    },
    {
      title: '替换字符',
      type: 'text',
      ifVisible({ data }: EditorResult<Data>) {
        return data.resolveType === ResolveType.REPLACE;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.replaceChar;
        },
        set({ data }: EditorResult<Data>, val: string) {
          data.replaceChar = val;
        }
      }
    },
    {
      title: '全部替换',
      type: 'switch',
      ifVisible({ data }: EditorResult<Data>) {
        return data.resolveType === ResolveType.REPLACE;
      },
      value: {
        get({ data }: EditorResult<Data>) {
          return data.isReplaceAll;
        },
        set({ data }: EditorResult<Data>, val: boolean) {
          data.isReplaceAll = val;
        }
      }
    }
  ]
};
