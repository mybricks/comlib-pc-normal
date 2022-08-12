/** @format */

import React, {useEffect, useState} from 'react'
import {Input} from 'antd'
import {IColumn} from '../../types'

interface Props {
  value: any
  record: any
  columnItem: IColumn
  env: any
}

const InputRender = (props: Props): JSX.Element => {
  const {value, record, columnItem, env} = props
  const {inputConfig = {}} = columnItem
  const {placeholder} = inputConfig
  const handleChange = (e) => {
    record[columnItem.dataIndex] = e.target.value
  }

  return env.runtime ? (
    <Input defaultValue={value} onChange={handleChange} placeholder={placeholder} />
  ) : (
    <Input placeholder={placeholder} />
  )
}

export default InputRender
