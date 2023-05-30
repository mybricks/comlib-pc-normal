import { TFormatterInfo } from '../types'

const keyMapFormatter: TFormatterInfo = {
  name: 'KEYMAP',
  label: '枚举映射',
  genEditor() {
    return {
      type: 'map'
    }
  },
  genFormatting(editorValue) {
    return (data) => {
      const map = editorValue || {}
      return map[data] || null
    }
  },
}

export default keyMapFormatter