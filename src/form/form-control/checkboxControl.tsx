import React, { useEffect } from 'react'
import { Checkbox } from 'antd';
import { observe, useObservable } from '@mybricks/rxui'
import { FormContext } from '../runtime'
import { FormItemContext } from '../form-item'
import { UpOutlined, DownOutlined } from '@ant-design/icons';

interface CheckboxControlProps {
    checked?: CheckboxList[]
    onChange?: (value: string | undefined | CheckboxList[]) => void
}

interface CheckboxList {
    label: string
    value: string
}

class CheckboxContext {
    checkedList: CheckboxList[] = []
    indeterminate = false
    checkAll = false
    showFilter = false
}

export default function checkboxControl ({ checked = [], onChange }: CheckboxControlProps) {
    const formContext = observe(FormContext, {from: 'parents'})
    const formItemContext = observe(FormItemContext, {from: 'parents'})
    const index = formItemContext.index
    const formItem = formItemContext.formItem
    const env = formContext.env
    let { checkboxOptions = [] } = formItem

    if (typeof formItem.checkboxDefaultUnFold === 'undefined') {
        formItem.checkboxDefaultUnFold = true
    }

    if (formItem.options && formItem.options.length) {
        checkboxOptions = formItem.options
    }

    if(checkboxOptions && checkboxOptions.length) {
        checkboxOptions = checkboxOptions.filter(Boolean)
    } else {
        checkboxOptions = []
    }

    const checkBoxCtx = useObservable(CheckboxContext, next => next({
        checkedList: checked,
        indeterminate: !!checked.length && checked.length < checkboxOptions.length,
        checkAll: !!checked.length && checked.length === checkboxOptions.length,
        showFilter: formItem.checkboxDefaultUnFold
    }))

    const onCheckedChange = (list: CheckboxList[]) => {
        if (onChange) {
            if (!list) {
                onChange([])
                checkBoxCtx.checkedList = []
                checkBoxCtx.indeterminate = false
                checkBoxCtx.checkAll = false
            } else {
                onChange(list)
                checkBoxCtx.checkedList = list
                checkBoxCtx.indeterminate = !!list.length && list.length < checkboxOptions.length
                checkBoxCtx.checkAll = !!list.length && list.length === checkboxOptions.length
            }
        }
    } 
    
    const onCheckChange = list => {
        const outputList = list.map(item => {
            return item
        })
        onCheckedChange(outputList)
    }

    const onCheckAllChange = e => {
        const allOutputList = checkboxOptions.map(item => {
            return item.value
        })
        onCheckedChange(e.target.checked ? allOutputList : [])
    }

    useEffect(() => {
        // console.log('useEffect')
        checkBoxCtx.checkedList = checked
    }, [checked.length])

    useEffect(() => {
        // console.log('useEffect')
        checkBoxCtx.indeterminate = !!checked.length && checked.length < checkboxOptions.length
        checkBoxCtx.checkAll = !!checked.length && checked.length === checkboxOptions.length
    }, [checkboxOptions.length])

    return (
        <React.Fragment>
            {formItem.checkAllOption ? 
            <Checkbox
                style={formItem.checkboxFolded ? {margin: '5px 0 0'} : {}}
                disabled={formItem.disabled}
                indeterminate={checkBoxCtx.indeterminate}
                onChange={onCheckAllChange}
                checked={checkBoxCtx.checkAll}>
                全部
            </Checkbox> : undefined}
            <Checkbox.Group
                disabled={formItem.disabled}
                value={checkBoxCtx.checkedList}
                onChange={onCheckChange}
                options={env.runtime ? checkboxOptions : undefined}
                style={checkBoxCtx.showFilter ? {display: "contents"} : {display: 'none'}}
            >
            {
                !env.runtime && checkboxOptions.map((checkbox, checkboxIndex) => {
                    return (
                        <div
                            data-checkbox-form-item-index={index}
                            key={checkbox.value + checkboxIndex}
                            style={formItem.checkboxFolded ? {display: "inline-flex", marginTop: '5px'} : {display: "inline-flex"}}
                        >
                            <Checkbox key={checkbox.value + checkboxIndex} value={checkbox.value}>{checkbox.label}</Checkbox>
                        </div>
                    )
                })
            }
            </Checkbox.Group>
            <React.Fragment>
                {formItem.checkboxFolded && env.runtime ?
                <a
                    style={{display: 'block', marginTop: '1px'}}
                    onClick={() => {
                        checkBoxCtx.showFilter = !checkBoxCtx.showFilter
                        // setShowFilter(!showFilter)
                    }}
                >
                    {checkBoxCtx.showFilter ? '收起 ' : '查看更多 '}
                    {checkBoxCtx.showFilter ? <UpOutlined /> : <DownOutlined />}
                </a> : undefined}
                {formItem.checkboxFolded && !env.runtime ?
                <a
                    style={{display: 'block', marginTop: '1px'}}
                    onClick={() => {
                        checkBoxCtx.showFilter = !checkBoxCtx.showFilter
                        // setShowFilter(!showFilter)
                    }}
                >
                    {formItem.checkboxDefaultUnFold ? '收起 ' : '查看更多 '}
                    {formItem.checkboxDefaultUnFold ? <UpOutlined /> : <DownOutlined />}
                </a> : undefined}
            </React.Fragment>
        </React.Fragment>
    )
}
