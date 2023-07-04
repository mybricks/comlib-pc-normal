import { TFormatterInfo } from '../types'

const noneFormatter: TFormatterInfo = {
  name: 'NONE',
  label: '保持原值',
  genFormatting() {
    return v => v
  },
}

export default noneFormatter