import { Data } from '../../constants';
import { getEleIdx, getSpanCount, setNextSpan } from '../utils';

export const StyleEditor = [
  // TODO 列超出策略调整
  {
    title: '所占列数',
    description: '范围是1到该行剩余column数',
    type: 'Slider',
    options({ data, focusArea }: EditorResult<Data>) {
      const max = data.column - getSpanCount({ data, focusArea });
      return {
        max,
        min: 1,
        steps: 1,
        formatter: `/${max}`
      }
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        if (!data.items[getEleIdx({ data, focusArea })].span) {
          data.items[getEleIdx({ data, focusArea })].span = 1;
        }
        return data.items[getEleIdx({ data, focusArea })].span;
      },
      set({ data, focusArea }: EditorResult<Data>, value: number) {
        if (!focusArea || isNaN(value)) return;
        const toSetSpan = Number(value) || 1;
        setNextSpan({ data, focusArea }, toSetSpan);
      }
    }
  },
  {
    title: '超出内容省略',
    type: 'Switch',
    value: {
      get({ data, focusArea }) {
        if (!focusArea) return;
        return data.items[getEleIdx({ data, focusArea })].ellipsis;
      },
      set({ data, focusArea }, value: boolean) {
        if (!focusArea) return;
        data.items[getEleIdx({ data, focusArea })].ellipsis = value;
      }
    }
  },
  {
    title: '行数限制',
    type: 'inputNumber',
    options: [{ min: 1, max: 10, width: 200 }],
    ifVisible({ data, focusArea }) {
      if (!focusArea) return;
      return data.items[getEleIdx({ data, focusArea })].ellipsis;
    },
    value: {
      get({ data, focusArea }) {
        if (!focusArea) return;
        return [data.items[getEleIdx({ data, focusArea })].rows ?? 1];
      },
      set({ data, focusArea }, value: number[]) {
        if (!focusArea) return;
        [data.items[getEleIdx({ data, focusArea })].rows] = value;
      }
    }
  }
];
