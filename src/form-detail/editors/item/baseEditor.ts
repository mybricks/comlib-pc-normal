import { uuid } from '../../../utils';
import { Data, DataSourceEnum, TypeEnum } from '../../constants';
import { getEleIdx, updateIOSchema } from '../utils';

export const BaseEditor = [
  {
    title: '显示名称',
    type: 'Text',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        return data.items[getEleIdx({ data, focusArea })]?.label;
      },
      set(
        { data, focusArea, input, output }: EditorResult<Data>,
        value: string
      ) {
        if (!focusArea) return;
        const item = data.items[getEleIdx({ data, focusArea })];
        item.label = value;
        const outputId = `${item.id}-suffixClick`;
        if (output.get(outputId)) {
          output.setTitle(outputId, `点击${item.label}-${value}`);
        }
        updateIOSchema({ data, input, output });
      }
    }
  },
  {
    title: '字段名',
    type: 'Text',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        return data.items[getEleIdx({ data, focusArea })]?.key;
      },
      set(
        { data, focusArea, input, output }: EditorResult<Data>,
        value: string
      ) {
        if (!focusArea) return;
        data.items[getEleIdx({ data, focusArea })].key = value;
        updateIOSchema({ data, input, output });
      }
    }
  },
  {
    title: '类型',
    type: 'Select',
    description: '描述列表的类型',
    options: [
      { label: '文本', value: TypeEnum.Text },
      { label: '全局自定义插槽', value: TypeEnum.AllSlot },
      { label: '局部自定义插槽', value: TypeEnum.PartSlot }
    ],
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        return (
          data.items[getEleIdx({ data, focusArea })]?.type || TypeEnum.Text
        );
      },
      set({ data, focusArea, slot }: EditorResult<Data>, value: TypeEnum) {
        if (!focusArea) return;
        const item = data.items[getEleIdx({ data, focusArea })];
        item.type = value;
        if (value === TypeEnum.AllSlot || value === TypeEnum.PartSlot) {
          const slotId = uuid();
          item.slotId = slotId;
          slot.add(slotId, '自定义内容');
        } else {
          if (slot.get(item.slotId)) {
            slot.remove(item.slotId);
            item.slotId = '';
          }
        }
      }
    }
  },
  {
    title: '字段值',
    type: 'Text',
    ifVisible({ data }: EditorResult<Data>) {
      return data.dataSource === DataSourceEnum.Default;
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        return data.items[getEleIdx({ data, focusArea })]?.value;
      },
      set({ data, focusArea }: EditorResult<Data>, value: string) {
        if (!focusArea) return;
        data.items[getEleIdx({ data, focusArea })].value = value;
      }
    }
  }
];
