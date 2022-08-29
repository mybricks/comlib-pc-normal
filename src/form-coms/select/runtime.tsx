import React, { useLayoutEffect, useState } from 'react';
import { Select } from 'antd'

interface Data {
  config: {
    options: any[]
    disabled: boolean
  }
  visible: boolean
}

export default function Runtime(props: RuntimeParams<Data>) {
  const { data, inputs, outputs } = props
  const [value, setValue] = useState()

  useLayoutEffect(() => {
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

  useLayoutEffect(() => {
    inputs['setValue']((val) => {
      setValue(val)
      onChange(val)
    })

    inputs['setDisabled']((val) => {
      data.config.disabled = val
    })

    inputs['setOptions']((val) => {
      data.config.options = val
    })

    inputs['setVisible']((val) => {
      data.visible = val
    })
  }, [])

  const onChange = (value) => {
    setValue(value)
    outputs['onChange'](value)
  }

  return data.visible && (
    <div>
      <Select
        allowClear
        value={value}
        placeholder="请选择"
        {...data.config}
        // options={[{ label: '选项一', value: '11'}, { label: '选项二', value: '22'}]}
        onChange={onChange}
      />
    </div>
  )
}