import css from './index.less'

import TextInput from './TextInput'
import Password from './Password'
import DatePickerYMD from './DatePickerYMD'
import DatePickerYMDHMS from './DatePickerYMDHMS'

export const REG = [
  {type: 'text', title: '文本', impl: TextInput},
  {type: 'password', title: '密码', impl: Password},
  {type: 'datePickerYMD', title: '日期-年月日', impl: DatePickerYMD},
  {type: 'DatePickerYMDHMS', title: '日期-年月日时分秒', impl: DatePickerYMDHMS},
]

export default function (formItem: T_FormItem, data: T_Data) {
  let item

  REG.find(reg => {
    if (reg.type === formItem.type) {
      item = reg.impl(formItem)
      return true
    }
  })

  const style: { padding } = {}
  if (data.formItemsCfg) {
    if (data.formItemsCfg.paddingTB) {
      style.padding = `${data.formItemsCfg.paddingTB}px 0 ${data.formItemsCfg.paddingTB}px`
    }
  }

  return item ? (
    <div key={formItem.name} data-form-item={formItem.name}
         className={css.formItem}
         style={style}>
      {item}
    </div>
  ) : null
}