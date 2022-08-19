import React, { Fragment, useEffect, useState } from 'react'
import { Spin } from 'antd'
import { SpinSize } from 'antd/es/spin'

export interface Data {
  tip?: string
  size?: SpinSize
}

export default function ({ env, data, inputs, slots }: RuntimeParams<Data>) {
  const { runtime } = env
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (runtime) {
      inputs['openLoading'](() => {
        setLoading(true)
      })

      inputs['closeLoading'](() => {
        setLoading(false)
      })
    }
  }, [])

  return (
    <Fragment>
      <Spin spinning={loading} size={data.size} tip={data.tip}>
        {slots && slots['content'].render()}
      </Spin>
    </Fragment>
  )
}