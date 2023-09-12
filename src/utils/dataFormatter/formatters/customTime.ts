import moment from 'moment'
import { TFormatterInfo } from '../types'

const customTimeFormatter: TFormatterInfo = {
  name: 'CUSTOMTIME',
  label: '自定义时间戳转化',
  genEditor(options) {
    return {
      type: 'text',
      options: {
        placeholder: 'YYYY-MM-DD HH:mm:ss',
        ...options
      }
    }
  },
  genFormatting(editorValue) {
    const formatTemplate = editorValue ?? 'YYYY-MM-DD HH:mm:ss'
    return (data) => {
      const m = moment(data)
      return m.format(formatTemplate)
    }
  },
}

export default customTimeFormatter