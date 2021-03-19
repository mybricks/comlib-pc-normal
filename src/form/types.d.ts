type T_ComArgs = {
  env, data: T_Data
}

type T_EdtArgs = {
  env, data: T_Data
}


type T_Data = {
  width: '100%' | number
  title: {
    display: boolean
    content: string
  }
  labelWidth: number
  formItems: T_FormItem[]
  formItemsCfg: {
    layout: 'column' | 'row'
    columns: number
    paddingTB: number
  }
  buttons: {
    display: boolean
    submit: {
      title: string
    }
  }
}

//-------------------------------------------------------

type T_FormItem = T_FormItemText | T_FormItemPassword

type FormItemBase = {
  label: string
  name: string
  rules?: Rules
}

type T_FormItemText = FormItemBase & {
  type: 'text'
}

type T_FormItemPassword = FormItemBase & {
  type: 'password'
}

//-------------------------------------------------------

type Rules = RuleRequired[]
type RuleRequired = {
  required: boolean, message: string
}

//export {T_Data,T_FormItem}