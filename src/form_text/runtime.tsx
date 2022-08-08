import {Form, Input} from 'antd'
import {useCallback, useEffect, useLayoutEffect, useMemo, useRef} from "react";

import css from './runtime.less'

export default function ({data, _inputs, inputs, _outputs, outputs}) {
  useLayoutEffect(() => {
    inputs['validate']((val, outputRels) => {
      outputRels['returnValidate'](false)///TODO
    })

    inputs['getValue']((val, outputRels) => {
      outputRels['returnValue'](Math.random())///TODO
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