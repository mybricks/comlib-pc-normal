import { InputIds, OutputIds } from '../../types'
import { SlotIds, SlotInputIds } from '../constants'
import { Data } from '../types'

function getItemSchema(data) {
  const properties = {}
  data.items.forEach(item => {
    const { id, label, schema, name } = item
    properties[name || label] = { ...schema, title: label }
  })

  return {
    type: 'object',
    properties
  }
}

function refreshSchema({ data, inputs, outputs, slots }: { data: Data, inputs: any, outputs: any, slots: any }) {
  const itemSchema = getItemSchema(data)

  const actionSchema = {
    type: 'object',
    properties: {
      value: {
        title: '当前项数据',
        ...itemSchema
      },
      index: {
        title: '当前项索引',
        type: 'number',
      },
      key: {
        title: '当前项标识',
        type: 'number',
      },
    },
  };

  const valueSchema = {
    type: 'array',
    items: itemSchema
  };

  outputs.get(OutputIds.OnChange).setSchema(valueSchema)
  outputs.get(OutputIds.OnInitial).setSchema(valueSchema)
  outputs.get(OutputIds.ReturnValue).setSchema(valueSchema)
  outputs.get(OutputIds.OnValidate).setSchema(valueSchema)

  data.actions.items.forEach(action => {
    const { key } = action;
    if (key !== 'add') {
      outputs.get(key).setSchema(actionSchema);
    }
  });

  inputs.get(InputIds.SetInitialValue).setSchema(valueSchema)
  inputs.get(InputIds.SetValue).setSchema(valueSchema)

  // slots.get(SlotIds.FormItems).inputs.get(SlotInputIds.CUR_VALUE).setSchema(itemSchema)
}



export { getItemSchema, refreshSchema }