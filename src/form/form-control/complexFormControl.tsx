import React, { Fragment } from 'react'
import { Input, Select, Space, InputNumber } from 'antd'
import { observe, useComputed } from '@mybricks/rxui'
import { FormItemProps } from '../runtime'
import { FormItemContext } from '../form-item'
import TextControl from './textControl'
import css from '../runtime.less'
import DatePickerControl from './dateControl'
import moment from 'moment';

interface CompositionItemProps {
  value?: Record<string, string>
  onChange?: (value: Record<string, string>) => void
  compositionItems?: FormItemProps[]
  radioKey?: string | number
}

const FormItemSize: Record<string, string> = {
  large: '100%',
  middle: '70%',
  small: '50%'
};

export default function ComplexFormControl ({ value = {}, onChange, compositionItems, radioKey }: CompositionItemProps) {
  const formItemContext = observe(FormItemContext, {from: 'parents'})
  // const formItem = formItemContext.formItem
  // console.log(formItem.compositionItems)

  const triggerChange = (changedValue: Record<string, string>) => {
    if (onChange) {
      onChange({...value, ...changedValue})
    }
  }

  const onInputChange = (name: string, event: React.ChangeEvent<HTMLInputElement>) => {
    triggerChange({ [name]: event.target.value })
  }

  const onSelectChange = (name: string, value: any) => {
    triggerChange({ [name]: value })
  }

  const controlTypes = (item: FormItemProps) => {
    const itemWidth = FormItemSize[item.size] || item.width || '100%';
    if (item.type === 'inputText') {
      return (
        <Input
          // style={{ width: itemWidth }}
          type="text"
          allowClear={item.allowClear}
          value={value[item.name]}
          disabled={item.disabled}
          placeholder={item.placeholder}
          onChange={(event) => onInputChange(item.name, event)}
        />
      )
    } else if (item.type === 'inputNumber') {
      return (
        <InputNumber
          // style={{width: itemWidth}}
          placeholder={item.placeholder}
          disabled={item.disabled}
          onChange={(event) => onSelectChange(item.name, event)}
          max={item.max}
          min={item.min}
        />
      )
      
    } else if (item.type === 'select') {
      return (
        <Select 
          style={{ width: item.size !== 'custom' ? 140 || item.width : itemWidth }}
          value={value[item.name]}
          disabled={item.disabled}
          showSearch
          allowClear={item.allowClear}
          optionFilterProp="label"
          placeholder={item.placeholder}
          options={item.options}
          onChange={(value) => onSelectChange(item.name, value)}>
        </Select>
      )
    } else if (item.type === 'text') {
      return <TextControl value={value[item.name]} />
    } else if (item.type === 'datePicker') {
      return <DatePickerControl
                formItem={item} onChange={(e) => {
          onSelectChange(item.name, moment(e).valueOf())
        }}
      />
    }
  }

  const descPosition = useComputed(() => {
    return formItemContext.formItem.descriptionPosition === 'top' 
      ? { display: 'flex', flexDirection: 'column-reverse' }
      : { display: 'flex' }
  })

  return (
    <Fragment>
      <Space>
        {
          compositionItems?.map((compositionItem, index) => {
            const itemWidth = FormItemSize[compositionItem.size] || compositionItem.width || '100%';
            return (
              <div
                data-item-type="compositionItem"
                data-form-item-type={formItemContext.formItem.type}
                data-form-item-index={formItemContext.index}
                data-form-composition-item-index={index}
                data-form-item-radio-key={radioKey}
                key={compositionItem.key}>
                <Space className={css['composition-item']} style={{...descPosition, width: itemWidth}} align="baseline">
                {
                    compositionItem.preCopy
                      && (
                      <span style={{ color: compositionItem.descriptionColor || '' }} className={css.preCopy}>
                          {compositionItem.preCopy}
                        </span>
                      )
                  }
                  {controlTypes(compositionItem)}
                  {
                    compositionItem.postCopy || compositionItem.description 
                      && (
                      <span style={{ color: compositionItem.descriptionColor || '' }} className={css.postCopy}>
                          {compositionItem.postCopy || compositionItem.description }
                        </span>
                      )
                  }
                </Space>
              </div>
            )
          })
        }
      </Space>
    </Fragment>
  )
}