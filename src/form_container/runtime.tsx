import css from './runtime.less'

import {Form, Button, Input} from 'antd'
import {useCallback, useMemo} from "react";

export default function ({data, inputs, outputs, slots}) {
  const getValues = []
  const submit = useCallback(() => {
    Promise.all(getValues.map(fn => {
      return new Promise((resolve, reject) => {
        fn().returnValue(val => {
          resolve(val)
        })
      })
    })).then(values => {
      outputs['submit'](values)////TODO Test
    })

  }, [])

  const content = useMemo(() => {
    return slots['content'].render({
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

  return (
    <div className={css.container}>
      <Form
        name="basic"
        labelCol={{flex: '110px'}}
        labelAlign="right"
        autoComplete="off"
        colon={false}
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