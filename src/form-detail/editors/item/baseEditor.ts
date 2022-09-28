import { uuid } from '../../../utils';
import { Data, DataSourceEnum, InputIds, ScopeSlotIds, TypeEnum } from '../../constants';
import { getDataSourceSchema, getEleIdx, updateIOSchema } from '../utils';

export const BaseEditor = [
  {
    title: '类型',
    type: 'Select',
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
      set({ data, focusArea, slots }: EditorResult<Data>, value: TypeEnum) {
        if (!focusArea) return;
        const item = data.items[getEleIdx({ data, focusArea })];
        item.type = value;
        if (value === TypeEnum.AllSlot || value === TypeEnum.PartSlot) {
          const slotId = uuid();
          item.slotId = slotId;
          item.value = void 0;
          addScopeSlotInputs({ data, item, slots });
        } else {
          removeScopeSlotInputs({ item, slots });
        }
      }
    }
  },
  {
    title: '显示名称',
    type: 'Text',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        return data.items[getEleIdx({ data, focusArea })]?.label;
      },
      set(
        { data, focusArea, input, output, slots }: EditorResult<Data>,
        value: string
      ) {
        if (!focusArea) return;
        const item = data.items[getEleIdx({ data, focusArea })];
        item.label = value;
        const outputId = `${item.id}-suffixClick`;
        if (output.get(outputId)) {
          output.setTitle(outputId, `点击${item.label}`);
        }
        updateIOSchema({ data, input, output });
        // TODO
        // slots.get(item.slotId).setTitle(value);
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
    title: '默认值',
    type: 'Text',
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

function addScopeSlotInputs({ data, item, slots }) {
  slots.add({
    id: item.slotId,
    title: item.label,
    type: 'scope',
    inputs: [
      { id: InputIds.CurDs, title: '当前数据', schema: { type: 'string' } },
      {
        id: InputIds.DataSource,
        title: '列表数据',
        schema: { type: 'object', properties: getDataSourceSchema(data) }
      }
    ]
  });
}

function removeScopeSlotInputs({ item, slots }) {
  slots.remove(item.slotId)
}