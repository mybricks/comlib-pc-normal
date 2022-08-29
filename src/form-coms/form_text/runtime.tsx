import {Form, Input} from 'antd'
import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";

import css from './runtime.less'

interface Data {
  value: string
  visible: boolean
  config: {
    allowClear: boolean
    disabled: boolean
    addonBefore: string
    addonAfter: string
  }
}

export default function ({env, data, _inputs, inputs, _outputs, outputs}: RuntimeParams<Data>) {
  const { edit } = env

  useLayoutEffect(() => {
    inputs['setValue']((val) => {
      data.value = val
    })

    inputs['validate']((val, outputRels) => {
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

    inputs['setVisible']((val: boolean) => {
      data.visible = val
    })

    inputs['setDisabled']((val: boolean) => {
      data.config.disabled = val
    })
  }, [])

  

  const changeValue = useCallback((e) => {
    const value = e.target.value
    data.value = value
    outputs['onChange'](value)
  }, [])

  let jsx = (
    <Input
      type="text"
      {...data.config}
      value={data.value}
      readOnly={!!edit}
      onChange={changeValue}
    />
  )

  return (
    <div className={css.fiText}>
      {jsx}
    </div>
  )
}