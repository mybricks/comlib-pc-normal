import {Form, Input} from 'antd'
import {useCallback, useEffect, useLayoutEffect, useMemo} from "react";

import css from './runtime.less'

export default function ({data, _inputs, _outputs, outputs}) {
  useLayoutEffect(() => {
    _inputs['getValue'](val => {
      _outputs['returnValue'](Math.random())
    })
  }, [])

  const changeValue = useCallback((e) => {
    outputs['valueChanged'](e.target.value)
  }, [])

  let jsx
  if (data.type === 'normal') {
    const props = {} as any
    if (data.addonBefore) {
      props.addonBefore = data.title
    }
    jsx = (
      <Input {...props} type={"text"} onChange={changeValue}/>
    )
  } else if (data.type === 'formItem') {
    jsx = (
      <Form.Item label={data.title} name={data.name}>
        <Input type={"text"} onChange={changeValue}/>
      </Form.Item>
    )
  }

  return (
    <div className={css.fiText}>
      {jsx}
    </div>
  )
}