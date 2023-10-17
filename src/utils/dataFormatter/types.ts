import { builtInFormatters } from './index'
// 具体的格式化函数，输入数据，返回格式化后的数据
export type TFormatting<I = any, O = any> = (v: I) => O

// 格式器的信息
export type TFormatterInfo<I = any, O = any> = {
  name: string,
  label: string,
  // 生成格式转化对应的编辑器，
  genEditor?: (options?: any) => {
    type: string,
    options?: any,
  }
  // 格式化器生成函数，参数为格式化器对应编辑器的值，修改格式化器的配置时触发
  genFormatting: (editorValue: any) => TFormatting<I, O>
}

export type TformattersValue<I = any, O = any> = {
  formatterName: string,
  nullValueHandling?: boolean,
  nullValueHandlingValue?: string,
  values: {
    [key: string]: any
  }
}

export type TFormatterRef = {
  formatter: keyof typeof builtInFormatters, // 通过字符串引用内部formatter
  description?: string
  options?: any // 用于覆盖内部formatter的配置,
  defaultValue?: any
}

export type Params<I = any, O = any> = {
  title: string,
  // 通过set/get 将内部数据到组件data特定字段上
  // 外部可以通过绑定的value.formatting来访问当前配置的转化器
  value: {
    get: (info: any) => TformattersValue<I, O>,
    set: (info: any, value: TformattersValue<I, O>) => void
  },
  formatters: Array<TFormatterRef>,
}
