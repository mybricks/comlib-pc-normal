import {Form, Input} from 'antd'
import {useEffect, useLayoutEffect, useMemo} from "react";

import css from './runtime.less'

export default function ({data, _inputs, _outputs}) {
  useLayoutEffect(() => {
    _inputs['getValue'](val => {
      _outputs['returnValue'](Math.random())
    })
  }, [])

  let jsx
  if (data.type === 'normal') {
    const props = {} as any
    if (data.addonBefore) {
      props.addonBefore = data.title
    }
    jsx = (
      <Input {...props} type={"text"}/>
    )
  } else if (data.type === 'formItem') {
    jsx = (
      <Form.Item label={data.title} name={data.name} valuePropName="checked">
        <Input type={"text"}/>
      </Form.Item>
    )
  }

  return (
    <div className={css.fiText}>
      {jsx}
    </div>
  )
}