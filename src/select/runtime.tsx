import React, { useLayoutEffect, useState } from 'react';
import { Select } from 'antd'

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
          help: '请选择一项'
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
      <Select
        allowClear
        value={value}
        options={[{ label: '选项一', value: '11'}, { label: '选项二', value: '22'}]}
        onChange={onChange}
      />
    </div>
  )
}