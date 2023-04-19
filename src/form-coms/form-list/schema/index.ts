import { InputIds, OutputIds } from '../../types'

function getValueSchema(data) {
  const properties = {}
  data.items.forEach(item => {
    const { id, label, schema, name } = item
    properties[name || label] = { ...schema, title: label }
  })

  const schema = {
    type: 'array',
    items: {
      type: 'object',
      properties
    }
  };
  return schema
}

function refreshSchema({ data, inputs, outputs, slots }) {
  const schema = getValueSchema(data)

  outputs.get(OutputIds.OnChange).setSchema(schema)
  outputs.get(OutputIds.OnInitial).setSchema(schema)
  outputs.get(OutputIds.ReturnValue).setSchema(schema)

  inputs.get(InputIds.SetInitialValue).setSchema(schema)
  inputs.get(InputIds.SetValue).setSchema(schema)
}



export { refreshSchema }