import { TFormatterInfo } from '../types'

const keyMapFormatter: TFormatterInfo = {
  name: 'KEYMAP',
  label: '枚举映射',
  genEditor(options) {
    return {
      type: 'map',
      options: {
        ...options
      }
    }
  },
  genFormatting(editorValue) {
    return (data) => {
      const map = editorValue || {}
      return map[data] || data
    }
  },
}

export default keyMapFormatter