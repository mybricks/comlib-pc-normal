import React, { useEffect, useMemo, useState, useCallback, useLayoutEffect } from 'react'
import { Form, Button, Row, Col } from 'antd'

export interface Data {
  items: any[]
}

interface FormControlProps {
  com: any
  value?: string | number
  onChange?: (value: string | number | undefined) => void
}

type FormControlInputId = 'validate' | 'getValue'

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, env, outputs, inputs, slots } = props

  const childrenInputs = useMemo<{ [id: string]: { [key in FormControlInputId]: (item?: any) => {}} }>(() => {
    return {}
  }, [env.edit])

  const [value, setValue] = useState()

  useLayoutEffect(() => {
    inputs['validate']((val, outputRels) => {
      validate().then(r => {
        outputRels['returnValidate']({
          validateStatus: 'success',
        })
      })
    })

    inputs['getValue']((val, outputRels) => {
      getValue().then(v => {
        console.log('getValue', v)
        outputRels['returnValue'](v)
      })
    })
  }, [])

  const validate = useCallback(() => {
    return new Promise((resolve, reject) => {
      Promise.all(data.items.map(item => {
        const id = item.id
        const input = childrenInputs[id]
        return new Promise((resolve, reject) => {
          input?.validate({ ...item }).returnValidate(validateInfo => {//调用所有表单项的校验
            item.validateStatus = validateInfo?.validateStatus
            item.help = validateInfo?.help
            resolve(validateInfo)
          })
        })
      })).then(values => {
        let rtn = false
        values.forEach(item => {
          if (item.validateStatus !== 'success') {
            reject(item)
          }
        })

        resolve(rtn)
      }).catch(e => reject(e))
    })
  }, [])

  const getValue = useCallback(() => {
    return new Promise((resolve, reject) => {
      Promise.all(data.items.map(item => {
        const id = item.id
        const input = childrenInputs[id]

        return new Promise((resolve, reject) => {
          input?.getValue().returnValue(val => {//调用所有表单项的 getValue/returnValue
            resolve({name: item.name, value: val})
          })
        })
      })).then(values => {
        const rtn = {}

        values.forEach(item => {
          rtn[item.name] = item.value
        })

        resolve(rtn)
      }).catch(e => reject(e))
    })
  }, [])


  const content = useMemo(() => {
    return slots['content'].render({
      wrap(comAray: { id, jsx, def, inputs, outputs }[]) {
        const items = data.items

        if (comAray) {
          const jsx = comAray.map((com, idx) => {
            let item = items.find(item => item.id === com.id)

            childrenInputs[com.id] = com.inputs
            
            return <FormItem com={com} item={item} key={com.id} />
          })

          return jsx
        }
      }
    })
  }, [])

  return (
    <div>
      {content}
    </div>
  )
}


const FormItem = (props: { com, item }) => {
  const { com, item }  = props

  return (
    <Form.Item
      label={item?.label}
      name={['item0', item?.name]} // 需要父组件给到自组件的name
      data-formitem={com.id}
      validateStatus={item?.validateStatus}
      help={item?.help}>
      <JSXWrapper com={com} />
    </Form.Item>
  )
}

const JSXWrapper = ({ com, value, onChange }: FormControlProps) => {
  useLayoutEffect(() => { // 初始化表单项值
    com.inputs?.setValue(value) // 需求区分 表单API行为触发 与 用户行为触发 => inputs or _inputs
  }, [value])

  return com.jsx
}