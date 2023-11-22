import { uuid } from '../../../utils';
import { Data, InputIds, TypeEnum } from '../../constants';
import { getDataSourceSchema, getEleIdx, updateIOSchema } from '../utils';

export const BaseEditor = [
  {
    title: '类型',
    type: 'Select',
    options: [
      { label: '文本', value: TypeEnum.Text },
      { label: '自定义插槽', value: TypeEnum.PartSlot }
    ],
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        return data.items[getEleIdx({ data, focusArea })]?.type || TypeEnum.Text;
      },
      set({ data, focusArea, slots, input }: EditorResult<Data>, value: TypeEnum) {
        if (!focusArea) return;
        const item = data.items[getEleIdx({ data, focusArea })];
        item.type = value;
        removeScopeSlotInputs({ item, slots });
        if (value === TypeEnum.AllSlot || value === TypeEnum.PartSlot) {
          const slotId = uuid();
          item.slotId = slotId;
          item.value = void 0;
          addScopeSlotInputs({ data, item, slots });
          updateScopeIOSchema({ data, item, slots, input });
        } else {
          item.showLabel = true;
        }
      }
    }
  },
  {
    title: '显示标签',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      return data.items[getEleIdx({ data, focusArea })]?.type === TypeEnum.PartSlot;
    },
    type: 'Switch',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        const { showLabel = true } = data.items[getEleIdx({ data, focusArea })];
        return showLabel;
      },
      set({ data, focusArea }: EditorResult<Data>, value: boolean) {
        data.items[getEleIdx({ data, focusArea })].showLabel = value;
      }
    }
  },
  {
    title: '标签名称',
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const { showLabel = true } = data.items[getEleIdx({ data, focusArea })];
      return showLabel;
    },
    type: 'Text',
    options: {
      locale: true
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        return data.items[getEleIdx({ data, focusArea })]?.label;
      },
      set({ data, focusArea, input, output }: EditorResult<Data>, value: string) {
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
    title: '标签说明',
    type: 'text',
    options: {
      locale: true
    },
    ifVisible({ data, focusArea }: EditorResult<Data>) {
      if (!focusArea) return;
      const { showLabel = true } = data.items[getEleIdx({ data, focusArea })];
      return showLabel;
    },
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        return data.items[getEleIdx({ data, focusArea })]?.labelDesc;
      },
      set({ data, focusArea }: EditorResult<Data>, val: string) {
        if (!focusArea) return;
        const item = data.items[getEleIdx({ data, focusArea })];
        item.labelDesc = val;
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
      set({ data, focusArea, input, output, slots }: EditorResult<Data>, value: string) {
        if (!focusArea) return;
        const item = data.items[getEleIdx({ data, focusArea })];
        item.key = value;
        updateIOSchema({ data, input, output });
        data.items.map((item) => {
          if (item.type !== TypeEnum.Text) {
            updateScopeIOSchema({ data, item, slots, input });
          }
        });
      }
    }
  },
  {
    title: '默认值',
    type: 'Text',
    options: {
      locale: true
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
  },
  {
    title: '数据类型',
    type: '_schema',
    value: {
      get({ data, focusArea }: EditorResult<Data>) {
        if (!focusArea) return;
        return data.items[getEleIdx({ data, focusArea })]?.schema;
      },
      set({ data, focusArea, input, output, slots }: EditorResult<Data>, value: string) {
        if (!focusArea) return;
        const item = data.items[getEleIdx({ data, focusArea })];
        item.schema = value;
        updateIOSchema({ data, input, output });
        data.items.map((item) => {
          if (item.type !== TypeEnum.Text) {
            updateScopeIOSchema({ data, item, slots, input });
          }
        });
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
      {
        id: InputIds.CurDs,
        title: '当前数据',
        schema: data.inputSchema ? item.schema : { type: 'string' }
      },
      {
        id: InputIds.DataSource,
        title: '列表数据',
        schema: data.inputSchema || { type: 'object', properties: getDataSourceSchema(data) }
      }
    ]
  });
}

function removeScopeSlotInputs({ item, slots }) {
  if (slots.get(item.slotId)) {
    slots.remove(item.slotId);
  }
}

export function updateScopeIOSchema({ data, slots, item, input }) {
  const slot = slots.get(item.slotId);
  slot.inputs.get(InputIds.CurDs).setSchema(item.schema || { type: 'string' });

  slot.inputs.get(InputIds.DataSource).setSchema(input.get(InputIds.SetDataSource).schema);
}
