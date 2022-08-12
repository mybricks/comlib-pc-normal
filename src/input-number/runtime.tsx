import React, { useLayoutEffect, useState } from 'react';
import { InputNumber } from 'antd'

interface Data {
  options: any[]
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs } = props
  const [value, setValue] = useState()

  useLayoutEffect(() => {
    inputs['setValue']((val) => {
      setValue(val)
    })

    inputs['validate']((val, outputRels) => {
      if (value) {
        outputRels['returnValidate']({
          validateStatus: 'success',
        })
      } else {
        outputRels['returnValidate']({
          validateStatus: 'error',
          help:  `请输入${val.label}`
        })
      }
    })

    inputs['getValue']((val, outputRels) => {
      outputRels['returnValue'](value)
    })
  }, [value])

  const onChange = (value) => {
    setValue(value)
    outputs['onChange'](value)
  }

  return (
    <div>
      <InputNumber value={value} onChange={onChange} />
    </div>
  )
}