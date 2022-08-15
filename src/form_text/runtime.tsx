import {Form, Input} from 'antd'
import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";

import css from './runtime.less'

export default function ({data, _inputs, inputs, _outputs, outputs}) {

  useLayoutEffect(() => {
    inputs['setValue']((val) => {
      data.value = val
    })

    inputs['validate']((val, outputRels) => {
      // outputRels['returnValidate'](data.value)
      if (data.value) {
        outputRels['returnValidate']({
          validateStatus: 'success',
        })
      } else {
        outputRels['returnValidate']({
          validateStatus: 'error',
          help: '请输入内容'
        })
      }
    })

    inputs['getValue']((val, outputRels) => {
      outputRels['returnValue'](data.value)
    })
  }, [])

  const changeValue = useCallback((e) => {
    const value = e.target.value
    data.value = value
    outputs['valueChanged'](value)
  }, [])

  const props = {} as any
  if (data.addonBefore) {
    props.addonBefore = data.title
  }
  let jsx = (
    <Input {...props} type={"text"} value={data.value} onChange={changeValue}/>
  )

  return (
    <div className={css.fiText}>
      {jsx}
    </div>
  )
}