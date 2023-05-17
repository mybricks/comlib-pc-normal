import { ExpressionSandbox } from '../../../../package/com-utils'
import { TFormatterInfo } from '../types'

const expressionFormatter: TFormatterInfo = {
  name: 'EXPRESSION',
  label: '表达式',
  genEditor(options) {
    return {
      type: 'expression',
      options: {
        autoSize: true,
        placeholder: '请输入表达式',
        suggestions: [],
        ...options,
      }
    }
  },
  genFormatting(editorValue) {
    editorValue = typeof editorValue === 'string' ? editorValue : JSON.stringify(editorValue ?? '')
    return (data) => {
      const sandbox = new ExpressionSandbox({
        context: data
      })
      try {
        return sandbox.executeWithTemplate(editorValue)
      } catch (e) {
        console.error(`格式化表达式出错错误`, e)
      }
    }
  },
}

export default expressionFormatter