import { Data } from '../../constants';
import { getEleIdx } from '../utils';

export const LogicEditor = [
  {
    title: '逻辑',
    items: [
      {
        title: '隐藏',
        description: '隐藏字段的表达式',
        type: 'Textarea',
        options: {
          placeholder: '例: {status} === 1'
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            const item = data.items[getEleIdx({ data, focusArea })];
            return item && item.isHiddenScript;
          },
          set({ data, focusArea }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const item = data.items[getEleIdx({ data, focusArea })];
            item.isHiddenScript = value;
          }
        }
      }
    ]
  }
];
