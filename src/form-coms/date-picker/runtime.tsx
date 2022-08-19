import React, { useLayoutEffect, useState } from 'react';
import { DatePicker } from 'antd'

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
          help:  `请选择${val.label}`
        })
      }
    })

    inputs['getValue']((val, outputRels) => {
      outputRels['returnValue'](value)
    })
  }, [value])

  const onChange = (date, dateString) => {
    setValue(dateString)
    outputs['onChange'](dateString)
  }

  return (
    <div>
      <DatePicker value={value} onChange={onChange} />
    </div>
  )
}