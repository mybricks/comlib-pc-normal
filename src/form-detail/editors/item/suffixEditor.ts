import { Data, TypeEnum } from '../../constants';
import { getEleIdx, Schemas } from '../utils';

export const SuffixEditor = [
  {
    title: '后置操作配置',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      return data.items[getEleIdx({ data, focusArea })]?.type === TypeEnum.Text;
    },
    items: [
      {
        title: '后置按钮',
        type: 'Switch',
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            return data.items[getEleIdx({ data, focusArea })]?.useSuffix;
          },
          set({ data, focusArea, output }: EditorResult<Data>, value: boolean) {
            if (!focusArea) return;
            const item = data.items[getEleIdx({ data, focusArea })];
            item.useSuffix = value;
            item.suffixBtnText = item.suffixBtnText || '查看更多';
            const outputId = `${item.id}-suffixClick`;
            const hasEvent = output.get(outputId);
            if (value && item.id && !hasEvent) {
              output.add(
                outputId,
                `点击${item.label}-${item.suffixBtnText}`,
                Schemas.SuffixClick(data)
              );
            }
            if (!value && hasEvent) {
              output.remove(output);
            }
          }
        }
      },
      {
        title: '按钮文案',
        type: 'Text',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return data.items[getEleIdx({ data, focusArea })]?.useSuffix;
        },
        value: {
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            return data.items[getEleIdx({ data, focusArea })]?.suffixBtnText;
          },
          set({ data, focusArea, output }: EditorResult<Data>, value: string) {
            if (!focusArea) return;
            const item = data.items[getEleIdx({ data, focusArea })];
            item.suffixBtnText = value;
            const outputId = `${item.id}-suffixClick`;
            if (output.get(outputId)) {
              output.setTitle(outputId, `点击${item.label}-${value}`);
            }
          }
        }
      },
      {
        title: '点击',
        type: '_Event',
        ifVisible({ data, focusArea }: EditorResult<Data>) {
          return data.items[getEleIdx({ data, focusArea })]?.useSuffix;
        },
        options: ({ data, focusArea }: EditorResult<Data>) => {
          const item = data.items[getEleIdx({ data, focusArea })];
          const outputId = `${item.id}-suffixClick`;
          return {
            outputId
          };
        }
      }
    ]
  }
];
