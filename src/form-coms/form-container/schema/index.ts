import { outputIds, inputIds, slotInputIds, formItemPropsSchema, commonDynamicItemSchema } from '../constants'
import { deepCopy } from '../../../utils'
import { Data } from '../types'
import cloneDeep from 'lodash/cloneDeep'

function getSubmitSchema(data) {
  const properties = {}
  data.items.forEach(item => {
    const { id, label, schema, name } = item
    properties[name || label] = { ...schema, title: label, description: '字段名为 ' + name +'的表单项值' }
  })

  const schema = {
    type: 'object',
    properties
  }
  return schema
}

function getDynamicItemsSchema(data) {
  return {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: '表单项字段名'
        },
        label: {
          type: 'string',
          description: '表单项标签'
        },
        relOriginField: {
          type: 'string',
          enum: data.items.map((iter) => iter.name),
          description: `使用搭建态表单中已有的字段类型,可以取以下字段:${data.items
            .map((iter) => iter.name)
            .join(',')}`
        },
        formItemProps: commonDynamicItemSchema
      }
    }
  };
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

  if(data.useDynamicItems) {
    // 动态生成表单项开启后，更新schema内容
    const dynamicItemsSchema  = getDynamicItemsSchema(data)
    inputs.get(inputIds.setDynamicFormItems).setSchema(dynamicItemsSchema)
    outputs.get(outputIds.setDynamicFormItemsDone).setSchema(dynamicItemsSchema)
  }
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

export interface FieldSourceOptions {
  type: 'add' | 'remove' | 'update'
  fieldName: string
  originFieldName?: string,
  schema?: any
}
function refreshFieldSourceSchema({ data, inputs, outputs, slots }, options: FieldSourceOptions) {
  const { type, fieldName, originFieldName, schema} = options
  if(inputs.get(inputIds.setFieldsSource)) {
    let fieldSourceSchema = cloneDeep(inputs.get(inputIds.setFieldsSource).schema);
    if(options.type === 'add') {
      fieldSourceSchema.properties[fieldName] = schema
    }
    if(options.type === 'remove') {
      delete fieldSourceSchema.properties[fieldName]
    }
    if(options.type === 'update' && originFieldName) {
      const originFieldSchema = fieldSourceSchema.properties[originFieldName]
      // 更新的时候，fieldSourceSchema里存在数据源时，进行更新
      if (originFieldSchema) {
        delete fieldSourceSchema.properties[originFieldName]
        fieldSourceSchema.properties[fieldName] = originFieldSchema
      }
    }
    inputs.get(inputIds.setFieldsSource).setSchema(fieldSourceSchema)
    if (outputs?.get(outputIds.setFieldsSourceDone)) {
      outputs?.get(outputIds.setFieldsSourceDone).setSchema(fieldSourceSchema);
    }
    const contentSlot = slots?.get('content')
    if(contentSlot && contentSlot.inputs.get(slotInputIds.SET_FIELDS_SOURCE)) {
      contentSlot.inputs.get(slotInputIds.SET_FIELDS_SOURCE).setSchema(fieldSourceSchema)
    }
  }
}

export { refreshSchema, refreshParamsSchema, getFormItemPropsSchema, refreshFormItemPropsSchema, getSubmitSchema, refreshFieldSourceSchema }