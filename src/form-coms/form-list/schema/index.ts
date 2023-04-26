import { InputIds, OutputIds } from '../../types'
import { SlotIds, SlotInputIds } from '../constants'

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

function refreshSchema({ data, inputs, outputs, slots }) {
  const itemSchema = getItemSchema(data)
  const schema = {
    type: 'array',
    items: itemSchema
  };

  outputs.get(OutputIds.OnChange).setSchema(schema)
  outputs.get(OutputIds.OnInitial).setSchema(schema)
  outputs.get(OutputIds.ReturnValue).setSchema(schema)

  inputs.get(InputIds.SetInitialValue).setSchema(schema)
  inputs.get(InputIds.SetValue).setSchema(schema)

  slots.get(SlotIds.FormItems).inputs.get(SlotInputIds.CUR_VALUE).setSchema(itemSchema)
}



export { refreshSchema }