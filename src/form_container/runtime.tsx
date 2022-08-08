import css from './runtime.less'

import {Button, Form} from 'antd'
import {useCallback, useMemo} from "react";

export default function ({data, inputs, outputs, slots}) {
  const [form] = Form.useForm()
  const getValues = []
  const submit = useCallback(() => {
    form.validateFields().then(values => { // 触发表单校验
      form.submit()
    })

    Promise.all(getValues.map(fn => {
      return new Promise((resolve, reject) => {
        fn().returnValue(val => {
          resolve(val)
        })
      })
    })).then(values => {
      outputs['submit'](values)
    })

  }, [])

  const content = useMemo(() => {
    return slots['content'].render({
      wrap(comAray: { id, jsx, def }[]) {
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
            return (
              <Form.Item key={com.id}
                         label={item.label}
                         name={item.name}
                         data-formitem={com.id}>
                {com.jsx}
              </Form.Item>
            )
          })

          return jsx
        }
      },
      _inputs: {
        getValue(fn) {
          getValues.push(fn)
        }
      },
      _outputs: {
        getValue(ref) {
          debugger
        }
      }
    })
  }, [])

  const onFinish = (values) => { // 提交成功值输出
    console.log(values)
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