import { TFormatterInfo } from '../types'
import { runJs } from '../../../../package/com-utils';

const customScriptFormatter: TFormatterInfo = {
  name: 'CUSTOMSCRIPT',
  label: '自定义脚本',
  genEditor(options) {
    return {
      type: 'code',
      options: {
        babel: true,
        comments: '',
        theme: 'light',
        minimap: {
          enabled: false
        },
        lineNumbers: 'on',
        eslint: {
          parserOptions: {
            ecmaVersion: '2020',
            sourceType: 'module'
          }
        },
        autoSave: false,
        ...options
      }
    }
  },
  genFormatting(editorValue) {
    return (data) => {
      const { value, index, rowRecord } = data
      return runJs(editorValue, [
        {
          value,
          index,
          rowRecord
        }
      ]);
    }
  },
}

export default customScriptFormatter