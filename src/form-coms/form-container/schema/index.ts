import { outputIds, inputIds, slotInputIds, formItemPropsSchema } from '../constants'
import { deepCopy } from '../../../utils'
import { Data } from '../types'

function getSubmitSchema(data) {
  const properties = {}
  data.items.forEach(item => {
    const { id, label, schema, name } = item
    properties[name || label] = { ...schema, title: label }
  })

  const schema = {
    type: 'object',
    properties
  }
  return schema
}

function getFormItemPropsSchema(data: Data) {
  const { layout } = data.config;
  const { width, span, ...res } = formItemPropsSchema;
  const properties = {};

  data.items.forEach(item => {
    const { id, label, name, widthOption } = item
    const formItemPropsschema = deepCopy(res);

    // 动态配置项
    // if (layout !== 'horizontal') {
    //   formItemPropsschema['inlinePadding'] = inlinePadding;
    // }
    if (widthOption === 'px') {
      formItemPropsschema['width'] = width;
    }
    if (widthOption === 'span') {
      formItemPropsschema['span'] = span;
    }
    properties[name || label] = { type: 'object', title: label, properties: { ...formItemPropsschema } }
  })

  const schema = {
    type: 'object',
    properties
  }

  return schema
}

function refreshSchema({ data, inputs, outputs, slots }) {
  const schema = getSubmitSchema(data)

  outputs.get(outputIds.ON_FINISH).setSchema(schema)
  outputs.get(outputIds.ON_CLICK_SUBMIT).setSchema(schema)
  outputs.get(outputIds.RETURN_VALUES).setSchema(schema)
  outputs.get(outputIds.ON_VALUES_CHANGE).setSchema({
    type: "object",
    properties: {
      changedValues: schema, // Todo... 应该只有一项
      allValues: schema
    }
  })

  inputs.get(inputIds.SET_FIELDS_VALUE).setSchema(schema)
  inputs.get(inputIds.SET_INITIAL_VALUES).setSchema(schema);

  if (outputs.get('setInitialValuesDone')) {
    outputs.get('setInitialValuesDone').setSchema(schema);
  }

  if (outputs.get('setFieldsValue')) {
    outputs.get('setFieldsValue').setSchema(schema);
  }

  const contentSlot = slots?.get('content')

  contentSlot.inputs.get(slotInputIds.SET_FIELDS_VALUE).setSchema(schema)

  refreshParamsSchema(data, outputs)
  refreshFormItemPropsSchema({ data, inputs, outputs })
}

function refreshParamsSchema(data, outputs) {
  const schema = getSubmitSchema(data)
  if (data.paramsSchema?.type === 'object') {
    schema.properties = { ...schema.properties, ...data.paramsSchema.properties }
  }

  outputs.get(outputIds.ON_MERGE_FINISH).setSchema(schema)
}

function refreshFormItemPropsSchema({ data, inputs, outputs }) {
  const formItemPropsSchema = getFormItemPropsSchema(data)
  inputs?.get(inputIds.SET_FORM_ITEMS_PROPS).setSchema(formItemPropsSchema)

  if (outputs?.get('setFormItemsPropsDone')) {
    outputs?.get('setFormItemsPropsDone').setSchema(formItemPropsSchema);
  }
}

export { refreshSchema, refreshParamsSchema, getFormItemPropsSchema, refreshFormItemPropsSchema, getSubmitSchema }