import { Data } from './runtime'

interface ItemsSchema {
  type: string
  properties: Record<string, Schema>
}

interface Schema {
  type: string
  title: string
  items?: ItemsSchema
  properties?: Record<string, Schema>
  mock?: string
}

const inputSubmitSchema = {
  type: 'object',
  properties: {},
}

const uploadSubmitSchema = {
  title: "表单数据上传",
  type: "follow",
}

function getFormModelSchema(data: Data) {
  const modelSchema: Record<string, Schema> = {}
  data.formItems.map((item) => {
    if (item.type === 'dynamicItem') {
      const fieldDataSchema: Record<string, Schema> = {}
      item.fieldsFormItems.map((fieldItem) => {
        fieldDataSchema[fieldItem.name] = {
          type: 'string',
          title: item.label,
        }
      })
      modelSchema[item.name] = {
        type: 'array',
        title: item.label,
        items: {
          type: 'object',
          properties: fieldDataSchema,
        },
      }
    } else if (item.type === 'compositionItem') {
      const compositionItemsSchema: Record<string, Schema> = {}
      item.compositionItems?.map(compositionItem => {
        compositionItemsSchema[compositionItem.name] = {
          type: 'string',
          title: item.label,
        }
      })
      modelSchema[item.name] = {
        type: 'object',
        title: item.label,
        properties: compositionItemsSchema
      }
    } else if (item.type === 'datePicker' || 'timePicker') {
      modelSchema[item.name] = {
        type: 'string',
        mock: '@now()',
        title: item.label,
      }
    } else {
      modelSchema[item.name] = {
        type: 'string',
        title: item.label,
      }
    }
  })

  return modelSchema
}

function setSubmitSchema(modelSchema: Record<string, Schema>, output: any) {
  const pin = output.get('submit')
  if (pin) {
    pin.setSchema({
      title: '表单数据提交',
      type: 'object',
      properties: modelSchema,
    })
  }
}

function setOutputFormValueSchema(modelSchema: Record<string, Schema>, io: any) {
  const pin = io.get('getFormValue')
  if (pin) {
    pin.setSchema({
      title: '输出表单值',
      type: 'object',
      properties: modelSchema,
    })
  }
}

function setInitialSchema(modelSchema: Record<string, Schema>, input: any) {
  input.get('initial').setSchema({
    title: '初始化表单数据',
    type: 'object',
    properties: modelSchema,
  })
}

function setFormModelSchema({
  data,
  input,
  output,
}: {
  data: Data
  input: any
  output: any
}) {
  const modelSchema = getFormModelSchema(data)

  setSubmitSchema(modelSchema, output)
  setInitialSchema(modelSchema, input)
  setOutputFormValueSchema(modelSchema, output)
  setSubmitActionSchema(modelSchema, data, input, output)
}

function setSubmitActionSchema(
  modelSchema: Record<string, Schema>,
  data: Data,
  input: any,
  output: any
) {
  data.submitActions.forEach((item) => {
    const inputPin = input.get(item.inputId)
    const outputPin = output.get(item.outputId)
    if (inputPin) {
      inputPin.setSchema(inputSubmitSchema)
    }
    // input.get(item.inputId).setSchema(inputSubmitSchema)
    if (outputPin) {
      outputPin.setSchema({
        title: '表单数据提交',
        type: 'object',
        properties: modelSchema,
      })
    }
  })
}

export { setFormModelSchema, inputSubmitSchema, getFormModelSchema, uploadSubmitSchema }
