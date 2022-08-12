import React, { useEffect, useMemo, useCallback, useLayoutEffect } from 'react';
import { Form, Button, Row, Col } from 'antd';

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
  const [formRef] = Form.useForm()

  const childrenInputs = useMemo<{ [id: string]: { [key in FormControlInputId]: (item?: any) => {}} }>(() => {
    return {}
  }, [env.edit])


  useLayoutEffect(() => {
    inputs['setFieldsValue']((val) => {
      formRef.setFieldsValue(val)
    })

    inputs['initial']((val) => {
      formRef.setFieldsValue(val)

      outputs['onInitial']({ values: val, formInstance: formRef })
    })

    inputs['resetFields']((val, outputRels) => {
      formRef.resetFields()
      outputRels['onResetFinish']()
    })

    inputs['submit']((val, outputRels) => {
      submit(outputRels)
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

  const submit = (outputRels?: any) => {
    validate().then(() => {
      getValue().then(values => {
        console.log('提交数据', values)
        if (outputRels) {
          outputRels['onFinish'](values)
        } else {
          outputs['onFinish'](values)
        }
      })
    }).catch(e => {
      console.log('校验失败', e)
    })
  }

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
    <Form
      form={formRef}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}>
      { content }
      <Row style={{ flex: '1 1 100%' }}>
        <Col offset={8}>
          <Form.Item data-form-actions>
            <Button type="primary" onClick={() => submit()}>提交</Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

const FormItem = (props: { com, item }) => {
  const { com, item }  = props

  return (
    <Form.Item
      label={item?.label}
      name={item?.name}
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