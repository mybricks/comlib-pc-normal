import { Data } from '../../constants';
import { getEleIdx, getSpanCount, setNextSpan } from '../utils';

export const StyleEditor = [
  {
    title: '最大宽度',
    type: 'text',
    value: {
      get({ data, focusArea }) {
        if (!focusArea) return;
        return data.items[getEleIdx({ data, focusArea })].widthLimit;
      },
      set({ data, focusArea }, value) {
        if (!focusArea) return;
        data.items[getEleIdx({ data, focusArea })].widthLimit = value;
      }
    }
  },
  {
    title: '超出内容省略',
    type: 'Switch',
    value: {
      get({ data, focusArea }) {
        if (!focusArea) return;
        return data.items[getEleIdx({ data, focusArea })].limit;
      },
      set({ data, focusArea }, value) {
        if (!focusArea) return;
        data.items[getEleIdx({ data, focusArea })].limit = value;
      }
    }
  },
  {
    title: '行数限制',
    type: 'inputnumber',
    options: [{ min: 1, max: 10, width: 200 }],
    ifVisible({ data, focusArea }) {
      if (!focusArea) return;
      return data.items[getEleIdx({ data, focusArea })].limit;
    },
    value: {
      get({ data, focusArea }) {
        if (!focusArea) return;
        return data.items[getEleIdx({ data, focusArea })].lineLimit;
      },
      set({ data, focusArea }, value) {
        if (!focusArea) return;
        data.items[getEleIdx({ data, focusArea })].lineLimit = value;
      }
    }
  },
  // TODO 列超出策略调整
  {
    title: '所占列数',
    description: '范围是1到该行剩余column数',
    type: 'Slider',
    options({ data, focusArea }: EditorResult<Data>) {
      return [
        {
          max: data.column - getSpanCount({ data, focusArea }),
          min: 0,
          steps: 1
        }
      ];
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
  }
];
