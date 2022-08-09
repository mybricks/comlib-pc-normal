import css from './runtime.less'

import {Button, Form} from 'antd'
import React, { useCallback, useMemo, useRef, useLayoutEffect, useEffect } from "react";

interface FromControlProps {
  com: any
  value?: string | number
  onChange?: (value: string | number | undefined) => void
}

type FromControlInputId = 'validate' | 'getValue'

export default function ({env, data, inputs, outputs, slots}) {
  const [form] = Form.useForm()

  const childrenInputs = useMemo<{ [id: string]: { [key in FromControlInputId]: () => {}} }>(() => {
    return {}
  }, [env.edit])


  // useEffect(() => {
  //   form.setFieldsValue({ item0: 'test', item1: '11' })
  // }, [])

  const validate = useCallback(() => {
    return new Promise((resolve, reject) => {
      Promise.all(data.items.map(item => {
        const id = item.id
        const input = childrenInputs[id]
        return new Promise((resolve, reject) => {
          input?.validate().returnValidate(validateInfo => {//调用所有表单项的校验
            item.validateStatus = validateInfo.validateStatus
            item.help = validateInfo.help
            resolve(validateInfo)
          })
        })
      })).then(values => {
        let rtn = false
        values.reduce((pre, cur, idx, array) => {
          rtn &= cur
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

  const submit = useCallback(() => {
    // form.validateFields().then(values => { // 触发表单校验 TODO 重构
    //   form.submit()
    // })
    validate().then(isOk => {
      getValue().then(values => {
        outputs['submit'](values)
      })
    })
  }, [])

  const content = useMemo(() => {
    return slots['content'].render({
      wrap(comAray: { id, jsx, def, inputs, outputs }[]) {
        const items = data.items

        if (comAray) {
          const jsx = comAray.map((com, idx) => {
            let item = items.find(item => item.id === com.id)
            if (!item) {
              const nowC = data.nameCount++
              item = {
                id: com.id,
                name: `item${nowC}`,
                label: `表单项${nowC}`,
                schema: com.def._valueSchema
              }

              data.items.push(item)
            }

            childrenInputs[com.id] = com.inputs
            
            return <FromItem com={com} item={item} key={com.id} />
          })

          return jsx
        }
      }
    })
  }, [])

  const onFinish = (values) => { // 提交成功值输出
    outputs['submit'](values)
  }

  return (
    <div className={css.container}>
      <Form
        form={form}
        name="basic"
        labelCol={{span: 8}}
        wrapperCol={{span: 16}}
        labelAlign="right"
        autoComplete="off"
        colon={false}
        onFinish={onFinish}
      >
        {content}

        <Form.Item label=" ">
          <Button type="primary" onClick={submit}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

const FromItem = (props: { com, item }) => {
  const { com, item }  = props

  return (
    <Form.Item
      label={item.label}
      name={item.name}
      data-formitem={com.id}
      validateStatus={item.validateStatus}
      help={item.help}>
      <JSXWrapper com={com} />
    </Form.Item>
  )
}

const JSXWrapper = ({ com, value, onChange }: FromControlProps) => {
  useLayoutEffect(() => { // 初始化表单项值
    com.inputs?.setValue(value)
  }, [value])

  return com.jsx
}
