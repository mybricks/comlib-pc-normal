import {Form, Input} from 'antd'
import {useCallback, useEffect, useLayoutEffect, useMemo} from "react";

import css from './runtime.less'

export default function ({data, _inputs, inputs, _outputs, outputs}) {
  useLayoutEffect(() => {
    inputs['getValue'](val => {
      outputs['returnValue'](Math.random())
    })
  }, [])

  const changeValue = useCallback((e) => {
    outputs['valueChanged'](e.target.value)
  }, [])

  const props = {} as any
  if (data.addonBefore) {
    props.addonBefore = data.title
  }
  let jsx = (
    <Input {...props} type={"text"} onChange={changeValue}/>
  )

  return (
    <div className={css.fiText}>
      {jsx}
    </div>
  )
}