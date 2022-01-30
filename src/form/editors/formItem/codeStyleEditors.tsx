/** @format */

import {CodeStyleConfig, Data} from '../../runtime'
import {checkItemType, getFormItem, getFormItemProps, setFormItemProps} from './utils'
import get from 'lodash/get'
import set from 'lodash/set'

const getCodeStyleConfig = <T extends keyof CodeStyleConfig>(
  {focusArea, data},
  propKey: T
): CodeStyleConfig[T] => {
    const formItem = getFormItem({ focusArea, data })
  return formItem && formItem.codeStyleConfig ? get(formItem.codeStyleConfig, propKey) : undefined
}

const setCodeStyleConfig = <T extends keyof CodeStyleConfig, P extends CodeStyleConfig[T]>(
  {focusArea, data},
  propKey: T,
  value: P
) => {
    const formItem = getFormItem({ focusArea, data })
    if (!formItem.codeStyleConfig) {
        formItem.codeStyleConfig = {}
    }
  if (formItem && formItem.codeStyleConfig) {
    set(formItem.codeStyleConfig, propKey, value)
  }
}

const codeStyleEditors = [
  {
    title: '编辑器样式',
    ifVisible({data, focusArea}) {
      return checkItemType({data, focusArea}, ['codeEditor'])
    },
    items: [
      {
        title: '行数限制',
        type: 'Inputnumber',
        options: [
          { title: '最小', min: 3, width: 100 },
          { title: '最大', min: 6, width: 100 }
        ],
        description: '行数限制',
        value: {
          set({ data, focusArea }: EditorResult<Data>, value: number[]) {
            if (!focusArea) return;
            setFormItemProps({ data, focusArea }, 'minRows', value[0]);
            setFormItemProps({ data, focusArea }, 'maxRows', value[1]);
          },
          get({ data, focusArea }: EditorResult<Data>) {
            if (!focusArea) return;
            return [
              getFormItemProps({ data, focusArea }, 'minRows') || 3,
              getFormItemProps({ data, focusArea }, 'maxRows') || 6
            ];
          }
        }
      },
      {
        title: '超出换行',
        type: 'Switch',
        value: {
          get({ data, focusArea }) {
            if (!focusArea) return
            if (!getCodeStyleConfig({data, focusArea}, 'wrap')) {
              setCodeStyleConfig({data, focusArea}, 'wrap', false)
            }
            return getCodeStyleConfig({data, focusArea}, 'wrap')
          },
          set({data, focusArea}, value: string) {
            if (!focusArea) return
            setCodeStyleConfig({data, focusArea}, 'wrap', value)
          }
        }
      }
    ]
  }
]

export default codeStyleEditors
