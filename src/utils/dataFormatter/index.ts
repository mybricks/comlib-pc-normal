import customScriptFormatter from './formatters/customScript'
import customTimeFormatter from './formatters/customTime'
import expressionFormatter from './formatters/expression'
import keyMapFormatter from './formatters/keyMap'
import noneFormatter from './formatters/none'
import timeTemplateFormatter from './formatters/timeTemplate'
import { Params, TFormatterInfo, TFormatterRef, TformattersValue } from './types'
import { isEmpty } from "../types";


// 内置的格式器，用户可以直接指定名称来引入
export const builtInFormatters = {
  'NONE': noneFormatter,
  'KEYMAP': keyMapFormatter,
  'EXPRESSION': expressionFormatter,
  'TIMETEMPLATE': timeTemplateFormatter,
  'CUSTOMSCRIPT': customScriptFormatter,
  'CUSTOMTIME': customTimeFormatter
}

// 将配置的格式器转换成对应的编辑器
const convertFormatter2Editor = (formatterConfig, accessor: Params['value']) => {
  const { formatter, description, options, defaultValue } = formatterConfig
  const { genEditor, name } = formatter

  if (!genEditor || typeof genEditor !== 'function') return null
  return {
    title: '格式化参数配置',
    description: description ?? undefined,
    ifVisible(info) {
      const data = accessor.get(info)
      return data?.formatterName === name;
    },
    value: {
      get(info) {
        // 获取到存储在组件上当前格式器的数据
        const values = accessor?.get(info)?.values || {}
        if (typeof values?.[name] === 'undefined') {
          values[name] = defaultValue
        }
        return values[name]
      },
      set(info, value) {
        const data = accessor?.get(info) || {}
        const values = data.values || {}
        // 设置当前格式器的数据
        values[name] = value
        // 设置当前格式化方法
        accessor.set(info, data)
      }
    },
    //@ts-ignore
    ...genEditor(options),
  }
}

const getFormatterByNmae = (formatterName: string) => {
  const name = Object.keys(builtInFormatters).find(name => name === formatterName.toUpperCase())
  if (!name) {
    throw new Error(`找不到名为${formatterName}的格式转化器`)
  }
  return builtInFormatters[name]
}

// 生成内部真正使用的格式化转换器数组，同时塞入默认的none转换器
const genRealFormatterInfos = (formatters: Params['formatters']) => {
  const realFormatters = formatters.map(item => {
    return typeof item.formatter === 'string'
      ? {
        ...item,
        formatter: getFormatterByNmae(item.formatter),
      }
      : item
  })

  return [
    { formatter: noneFormatter },
    //@ts-ignore
    ...realFormatters
  ]
}

const createFormatterSelector = (formatters: TFormatterInfo[], accessor: Params['value']) => {
  return {
    title: '格式化类型',
    type: 'select',
    options: formatters.map((item) => ({
      label: item.label,
      value: item.name
    })),
    value: {
      get(info) {
        let data = accessor?.get(info) || {}
        return data?.formatterName || noneFormatter.name
      },
      set(info, v) {
        const data = accessor?.get(info) || {}
        // 设置当前格式化方法
        data.formatterName = v
        accessor.set(info, data)
      }
    }
  }
}

const createDataFormatEditor = <I, O>({ title, formatters, value }: Params<I, O>) => {
  const realFormatters = genRealFormatterInfos(formatters || [])
  const editors = realFormatters.map(item => convertFormatter2Editor(item, value))

  return {
    title,
    items: [
      {
        title: '空值处理',
        type: 'Switch',
        description: '开启后，可将输入值为undefined、null、空字符串转换成预期值',
        value: {
          get(info) {
            const values = value?.get(info) || {}
            return values?.['nullValueHandling'] || false;
          },
          set(info, switchValue: boolean) {
            const values = value?.get(info) || {}
            values['nullValueHandling'] = switchValue
            value.set(info, values)
          }
        }
      },
      {
        title: '空值处理',
        type: 'Text',
        description: '设置将输入值为undefined、null、空字符串转换成的预期值',
        ifVisible(info) {
          const values = value?.get(info) || {}
          return values?.['nullValueHandling'] || false;
        },
        value: {
          get(info) {
            const values = value?.get(info) || {}
            if (typeof values?.['nullValueHandlingValue'] === 'undefined') {
              values['nullValueHandlingValue'] = '';
            }
            return values?.['nullValueHandlingValue'];
          },
          set(info, textValue: string) {
            const values = value?.get(info) || {}
            values['nullValueHandlingValue'] = textValue
            value.set(info, values)
          }
        }
      },
      createFormatterSelector(realFormatters.map(item => item.formatter), value),
      ...(editors.filter(item => !!item))
    ]
  }
}

// 用于组件内部通过格式器的配置获取当前格式化函数
export const genFormatting = (formatData: TformattersValue) => {
  const {
    formatterName = 'NONE',
    values = {},
    nullValueHandling = false,
    nullValueHandlingValue = ''
  } = formatData || {};
  const formatter: TFormatterInfo = builtInFormatters[formatterName]
  if (!formatter) {
    throw new Error(`找不到名为${formatterName}的格式器`)
  }
  const editValue = values[formatterName] || ''

  const formatting = v => {
    try {
      return isEmpty(v) && nullValueHandling
        ? nullValueHandlingValue
        : formatter?.genFormatting(editValue)(v);
    } catch (e) {
      console.error(`[${formatterName}]:格式转化错误, 格式器参数为`, editValue, `待转化数据为`, v)
    }
  }
  return formatting
}

export default createDataFormatEditor