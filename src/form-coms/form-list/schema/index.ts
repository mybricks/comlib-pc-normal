import { InputIds, OutputIds } from '../../types'
import { SlotIds, SlotInputIds, fieldItemPropsSchema, InputIds as innerInputIds } from '../constants'
import { Data } from '../types'
import { deepCopy } from '../../../utils'

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

  refreshModifyFieldSchema({ data, inputs, outputs })

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

function refreshModifyFieldSchema({ data, inputs, outputs }) {
  const fieldItemPropsSchema = getDataItemFieldSchema(data)
  const modifySchema = {
    type: "object",
    properties: {
      config: {
        type: "object",
        description: "列表这一项中表单项的配置",
        properties: fieldItemPropsSchema.properties
      },
      index: {
        type: "number",
        description: "修改位置(index从0开始)"
      }
    }
  }
  inputs?.get(innerInputIds.ModifyField).setSchema(modifySchema)

  if (outputs?.get('modifyFieldDone')) {
    outputs?.get('modifyFieldDone').setSchema(modifySchema);
  }
}

export function getDataItemFieldSchema(data: Data) {
  // const { layout } = data.config;
  const properties = {};

  data.items.forEach(item => {
    const { id, label, name, widthOption } = item
    const formItemPropsschema = deepCopy(fieldItemPropsSchema);

    properties[name || label] = { type: 'object', title: label, properties: { ...formItemPropsschema } }
  })

  const schema = {
    type: 'object',
    properties
  }

  return schema
}

export { getItemSchema, refreshSchema }