import React from 'react'
import css from './runtime.less'
import { useCallback } from 'react'
import { RuntimeParams } from 'src/types'
import { Button, Menu, Dropdown, Switch, Tooltip, Row, Col } from 'antd'
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined'

interface Tools {
  id: string
  btns?: any
  icon: string
  title: string
  style?: string
  color?: string
  outVal: string
  margin: number[]
  useIcon: boolean
  focusId?: string
  showText: boolean
  dataType?: string
  description?: string  //tooltip description
  isDisabled: boolean //（按钮）是否禁用
  inputContent: any
  dropdown: boolean
  dropdownName: string
  defaultChecked: boolean
  shape: 'circle' | 'round' | undefined
  size: 'small' | 'middle' | 'large' | any
  type: 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | any
}

export declare type Data = {
  btns: Tools[]
  tools: Tools[]
  layout: string
  inputContent: any
}

const shapeClassMap = {
  '': css.noround,
  'round': css.round
}

const sizeClassMap = {
  'large': css.large,
  'middle': css.middle,
  'small': css.small
}

const btnNoFocusStyle: any = {
  color: 'rgba(0,0,0,.85)',
  borderColor: '#d9d9d9'
}

export default function Toolbar({env, data, inputs, outputs}: RuntimeParams<Data>) {
  if (env.runtime && inputs) {
    inputs['input']((ds: any) => {
      data.inputContent = ds
    })

    data.tools.forEach(item => {
      const { id, dataType, type, btns } = item
      if (type !== 'btngroup') {
        if (dataType === 'external') {
          inputs[id](ds => {
            item.inputContent = ds
          })
        }
      } else {
        btns.forEach(item => {
          const { dataType } = item
          if (dataType === 'external') {
            inputs[item.id](ds => {
              item.inputContent = ds
            })
          }
        })
      }
    })
  }

  const btnClick = useCallback((item: Tools, type = 'btn') => {
    if (env.runtime) {
      const outputVal: string | number = item.dataType === 'external' ? (item.inputContent || data.inputContent) : item.outVal
      let outputId = ''
      switch (type) {
        case 'btn':
          outputId = item.id
          break
        case 'groupBtn':
          outputId = item.id.split('&&')[0]
          break
      }
      outputs[outputId](outputVal, (_val: any) => {
        console.warn(`return val from (${item.title})`, _val)
      })
    }
  }, [])

  const switchChange = useCallback((item: Tools, v: boolean) => {
    outputs[item.id](v)
  }, [])

  const renderTools = useCallback((tools) => {
    if (!tools && data.btns) {
      return data.btns.map(btn => {
        return (
          <div
            data-btn='1'
            data-btn-id={btn.id}
            key={btn.id}
            style={{padding: '2px'}}
          >
            <Button
              type={btn.type}
              size={btn.size}
              shape={btn.shape}
              onClick={() => btnClick(btn)}
            >{btn.title}</Button>
          </div>
        )
      })
    } else if (tools) {
      return tools.map(tool => {
        const {type} = tool
        let render: any
        switch (type) {
          case 'btngroup':
            render = renderGtoupBtn(tool, env, btnClick)
            break
          case 'switch':
            render = renderSwitch(tool, env, switchChange)
            break
          default:
            render = renderBtn(tool, btnClick)
            break
        }
        return render
      })
    }
  }, [])

  return (
    <div className={css.toolbar} style={{justifyContent: data.layout, alignItems: env?.runtime ? 'center' : ''}}>
      {
        data.tools?.length > 0 || data.btns?.length > 0 ? renderTools(data.tools) : (
          <p className={css.suggestion}>在编辑栏中点击"添加按钮"</p>
        )
      }
    </div>
  )
}

function renderBtn(data, fn) {
  const {id, useIcon, icon, type, size, shape, showText, title, margin, hideBorder, description, isDisabled} = data
  const [left, right] = margin
  const marginStyle = {
    marginLeft: left + 2,
    marginRight: right + 2,
    height: 'fit-content',
  }
  const tooltipStyle = {
    marginLeft: 2,
    fontSize: 11,
  }
  return (
    <div
      data-btn-id={id}
      key={id}
      className={css.button}
      style={marginStyle}
    >
      <Button
        style={{borderColor: hideBorder ? '#00000000' : ''}}
        type={type}
        size={size}
        shape={shape}
        onClick={() => fn(data)}
        disabled={isDisabled}
      >
        {showText && title}
      {/* <Row>
        <Col span={21}>
          {showText && title}
        </Col>
        <Col span={3}>
          <Row align='top'>
          {//单个按钮后添加tooltip文字描述
              (description !== undefined && description !== "") &&
              <Tooltip placement="top" title={description}>
                <span style={tooltipStyle}><InfoCircleOutlined /></span>
              </Tooltip> 
          }
          </Row>
        </Col>
      </Row> */}
      </Button>
    </div>
  )
}

function renderGtoupBtn(data, env, fn) {
  const {id, btns, shape, size, focusId, color, style, margin, dropdown, dropdownName = '下拉'} = data
  const [left, right] = margin
  const marginStyle = {
    marginLeft: left + 2,
    marginRight: right + 2,
    height: 'fit-content'
  }
  let menu = <Menu></Menu>
  if (dropdown) {
    menu = (
      <Menu>
        {btns.map(item => {
          return <Menu.Item key={item.id} onClick={() => groupBtnClick(data, item, fn)}>
            <span>{item.title}</span>
          </Menu.Item>
        })}
      </Menu>
    )
  }
  return (
    <div
      data-btngroup-id={id}
      key={id}
      className={`${!dropdown ? css.btngroup : ''} ${!dropdown ? shapeClassMap[shape] || '' : ''}`}
      style={marginStyle}
    >
      {
        !dropdown || (dropdown && env.edit) ? btns?.length && btns.map(btn => {
          const {showText, title, useIcon, icon} = btn
          const divFocusStyle: any = {
            zIndex: 1,
            color
          }
          const divNoFocusStyle: any = {
            zIndex: 0,
            color
          }
          let btnFocusStyle: any = {
            color,
            borderColor: color
          }
  
          if (env.edit) {
            divFocusStyle.zIndex = 3
          }
  
          if (style === 'solid') {
            btnFocusStyle = {
              color: '#fff',
              borderColor: color,
              backgroundColor: color
            }
          }
  
          return (
            <div
              data-groupbtn-id={btn.id}
              key={btn.id}
              className={css.button}
              style={focusId === btn.id ? divFocusStyle : divNoFocusStyle}
            >
              <Button
                className={`${sizeClassMap[size] || ''}`}
                style={focusId === btn.id ? btnFocusStyle : btnNoFocusStyle}
                size={size}
                shape={shape}
                onClick={() => groupBtnClick(data, btn, fn)}
              >{showText && title}</Button>
            </div>
          )
        }) : <Dropdown overlay={menu} placement="bottomRight">
        <Button type="primary">{dropdownName}</Button>
      </Dropdown>
      }
    </div>
  )
}

function groupBtnClick(data, btn, fn) {
  data.focusId = btn.id
  fn(btn, 'groupBtn')
}

function renderSwitch(data, env, fn) {
  const { edit, runtime } = env || {}
  const { id, margin, defaultChecked = false } = data
  const [left, right] = margin
  const marginStyle = {
    marginLeft: left + 2,
    marginRight: right + 2,
    height: 'fit-content'
  }

  return (
    <div
      key={id}
      data-switch-id={id}
      style={marginStyle}
      className={css.button}
    >
      {edit && <Switch checked={defaultChecked}/>}
      {runtime && <Switch
        defaultChecked={defaultChecked}
        onChange={(v) => fn(data, v)}
      />}
    </div>
  )
}