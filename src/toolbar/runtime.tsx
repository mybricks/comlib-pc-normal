import React, { ReactNode, useEffect, useCallback, useState } from 'react'
import { Button, Menu, Dropdown, Switch } from 'antd'
// import Icon from '@es/icon-select';
import classnames from 'classnames';
import { DownOutlined } from '@ant-design/icons';
import css from './runtime.less'

/**
 * 配置项
 * @param id 唯一id
 * @param outVal 输出内容
 * @param icon 图标
 * @param title 按钮名称
 * @param btns 按钮配置数组（按钮组）
 * @param style 风格（按钮组）
 * @param color 颜色（按钮组）
 * @param margin 左右外间距
 * @param useIcon 是否使用图标
 * @param focusId 设置默认选中（按钮组）
 * @param showText 是否显示名称（使用图标时可供开关并生效）
 * @param dataType 点击输出内容的类型
 * @param inputContent 点击输出的内容
 * @param dropdown 是否为下拉（按钮组）
 * @param hideBorder 隐藏边框
 * @param dropdownName 下拉按钮名称，打开下拉时生效（按钮组）、
 * @param defaultChecked 默认选中（按钮组）
 * @param shape 按钮形状
 * @param size 按钮大小（暂时不支持配置）
 * @param type 按钮风格
 */

export enum Location {
  FRONT = "front",
  BACK = "back"
}
interface Tool {
  id: string
  outVal: any
  icon?: string
  title: string
  btns?: Tool[]
  style?: string
  color?: string
  margin: number[]
  useIcon?: boolean
  focusId?: string
  showText?: boolean
  dataType?: string
  inputContent?: any
  dropdown?: boolean
  hideBorder?: boolean
  dropdownName?: string
  defaultChecked?: boolean
  shape: 'circle' | 'round' | undefined
  size: 'small' | 'middle' | 'large' | any
  type: 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | any
  location?: Location
  dynamicDisabled?: boolean
  disabled?: boolean
  hideArrow?: boolean
  dropdownBtnProps?: Tool
  // description?: string  //tooltip description
  // isDisabled: boolean //（按钮）是否禁用
}

/**
 * 数据源
 * @param btns 兼容老数据，类似tools
 * @param tools 工具条配置数组
 * @param layout 对其方式
 * @param inputContent 接收外部传入数据
 */
export declare type Data = {
  btns: Tool[]
  tools: Tool[]
  layout: string
  inputContent: any
  disabled?:  boolean
}

const shapeClassMap: AnyMap = {
  '': css.noround,
  'round': css.round
}
const sizeClassMap: AnyMap = {
  'large': css.large,
  'small': css.small,
  'middle': css.middle
}
const btnNoFocusStyle: AnyMap = {
  borderColor: '#d9d9d9',
  color: 'rgba(0,0,0,.85)'
}


const btnItemR = ({ icon, text, location = Location.FRONT }: { icon: ReactNode, text: string, location: Location }) => {
  if (location === Location.FRONT) {
    return (
      <>
        <Icon type={icon} />
        <span>{text}</span>
      </>
    )
  }
  if (location === Location.BACK) {
    return (
      <>
        <span>{text}</span>
        <Icon type={icon} />
      </>
    )
  }
}

export default function Toolbar({env, data, inputs, outputs}: RuntimeParams<Data>) {
  if (env.preview) {
    return RenderPreview()
  }
  // 外部传入数据
  const [inputVal, setInputVal] = useState<any>();

  useEffect(() => {
    if (env.runtime) {
      // 表单
      inputs['install'] &&
        inputs['install']((res) => {
          const { formProps } = res || {};
          const { disabled } = formProps || {};
          data.disabled = disabled;
        });
      // 逻辑连线
      inputs['input'] &&
        inputs['input']((ds: any) => {
          setInputVal(ds);
        });
      // 插槽参数
      inputs['slotProps'] &&
        inputs['slotProps']((ds: any) => {
          setInputVal(ds);
        });
      data.tools.forEach((item) => {
        const { id, dataType, type, btns } = item;
        if (type !== 'btngroup') {
          if (dataType === 'external') {
            inputs[id]((ds) => {
              item.inputContent = ds;
            });
          }
          if (item.dynamicDisabled) {
            inputs[`disable${id}`] &&
              inputs[`disable${id}`]((ds) => {
                // 兼容老版本逻辑
                item.disabled = ds !== false;
              });
            inputs[`enable${id}`] &&
              inputs[`enable${id}`](() => {
                item.disabled = false;
              });
          }
        } else {
          btns?.forEach((item) => {
            const { dataType } = item;
            if (dataType === 'external') {
              inputs[item.id]((ds) => {
                item.inputContent = ds;
              });
            }
          });
        }
      });
    }
  }, [])

  const btnClick = (item: Tool, type = 'btn') => {
    if (env.runtime) {
      const outputVal: string | number =
        item.dataType === 'external'
          ? item.inputContent || inputVal
          : item.outVal;
      let outputId = '';
      switch (type) {
        case 'btn':
          outputId = item.id;
          break;
        case 'groupBtn':
          const groupId = item.id.split('&&')[0];
          outputId = item.dropdown ? item.id : groupId;
          break;
      }
      if (outputs[outputId]) {
        outputs[outputId](outputVal, (_val: any) => {
          console.warn(`return val from (${item.title})`, _val);
        });
      }
    }
  }

  const switchChange = useCallback((item: Tool, v: boolean) => {
    outputs[item.id](v)
  }, [])

  const renderTools = (tools) => {
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
            >{btn.useIcon ? btnItemR({icon: btn.icon, text: btn.title, location: btn.location}) : btn.title}</Button>
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
            render = renderBtn(tool, btnClick, data)
            break
        }
        return render
      })
    }
  }

  return (
    <div
      className={css.toolbar}
      style={{
        justifyContent: data.layout,
        alignItems: env.edit ? 'unset' : 'center'
      }}
    >
      {data.tools?.length > 0 || data.btns?.length > 0 ? (
        renderTools(data.tools)
      ) : (
        <p className={css.suggestion}>在编辑栏中点击"添加按钮"</p>
      )}
    </div>
  );
}

function renderBtn(tool: Tool, fn: {(arg: Tool): void}, data) {
  const {id, useIcon, icon, type, size, shape, showText, title, margin, hideBorder, location, disabled} = tool
  const [left, right] = margin
  const marginStyle: AnyMap = {
    marginLeft: left + 2,
    marginRight: right + 2,
    height: 'fit-content',
  }
  return (
    <div key={id} data-btn-id={id} style={marginStyle} className={css.button}>
      {type === 'a' ? (
        <a
          onClick={() => fn(tool)}
          className={data.disabled || disabled ? css.disabled : ''}
        >
          {useIcon
            ? btnItemR({ icon, text: showText && title, location })
            : showText && title}
        </a>
      ) : (
        <Button
          type={type}
          size={size}
          shape={shape}
          disabled={data.disabled || disabled}
          style={{ borderColor: hideBorder ? '#00000000' : '' }}
          onClick={() => fn(tool)}
        >
          {useIcon
            ? btnItemR({ icon, text: showText && title, location })
            : showText && title}
        </Button>
      )}
    </div>
  );
}

function renderDropdownGtoupBtn(tool: Tool, env: Env, fn: any) {
  const isEdit = !!env.edit;
  const { id, btns, shape, size, margin, dropdownName = '下拉', dropdownBtnProps } = tool;
  const { type, hideBorder, hideArrow } = dropdownBtnProps || {};
  const [left, right] = margin;
  const marginStyle = {
    padding: '2px',
    marginLeft: left + 2,
    marginRight: right + 2,
    height: 'fit-content'
  };
  if (isEdit) {
    return (
      <div key={id} style={marginStyle} data-btngroup-id={id}>
        <Dropdown overlay={null} placement="bottomRight">
          <Button
            size={size}
            shape={shape}
            type={type}
            className={css.dropdownBtn}
            style={{ borderColor: hideBorder ? '#00000000' : '' }}
          >
            {dropdownName}
            {!hideArrow && <DownOutlined />}
          </Button>
        </Dropdown>
        {btns?.length &&
          btns.map((btn) => {
            return (
              <div
                key={btn.id}
                style={{ padding: '5px 12px' }}
                className={classnames(css.button, 'ant-dropdown-menu-item')}
                data-groupbtn-id={btn.id}
              >
                {btn.useIcon ? (
                  btnItemR({
                    icon: btn.icon,
                    text: btn.title,
                    location: btn.location
                  })
                ) : (
                  <span>{btn.title}</span>
                )}
              </div>
            );
          })}
      </div>
    );
  }

  let menu = (
    <Menu>
      {btns?.map((item) => {
        return (
          <Menu.Item
            key={item.id}
            onClick={() => fn({ ...item, dropdown: true }, 'groupBtn')}
          >
            {item.useIcon ? (
              btnItemR({
                icon: item.icon,
                text: item.title,
                location: item.location
              })
            ) : (
              <span>{item.title}</span>
            )}
          </Menu.Item>
        );
      })}
    </Menu>
  );
  return (
    <div key={id} style={marginStyle} data-btngroup-id={id}>
      <Dropdown overlay={menu} placement="bottomRight">
        <Button
          size={size}
          shape={shape}
          type={type}
          className={css.dropdownBtn}
          style={{ borderColor: hideBorder ? '#00000000' : '' }}
        >
          {dropdownName}
          {!hideArrow && <DownOutlined />}
        </Button>
      </Dropdown>
    </div>
  );
}
function renderGtoupBtn(tool: Tool, env: Env, fn: any) {
  const {id, btns, shape, size, focusId, color, style, margin, dropdown, dropdownName = '下拉'} = tool
  const [left, right] = margin
  const marginStyle = {
    marginLeft: left + 2,
    marginRight: right + 2,
    height: 'fit-content'
  }
  if (dropdown) {
    return renderDropdownGtoupBtn(tool, env, fn);
  }
  return (
    <div
      key={id}
      style={marginStyle}
      data-btngroup-id={id}
      className={`${!dropdown ? css.btngroup : ''} ${!dropdown ? (shape && shapeClassMap[shape]) || '' : ''}`}
    >
      {
        btns?.length && btns.map(btn => {
          const {showText, title, useIcon, icon, location} = btn
          const divFocusStyle: AnyMap = {
            zIndex: 1,
            color
          }
          const divNoFocusStyle: AnyMap = {
            zIndex: 0,
            color
          }
          let btnFocusStyle: AnyMap = {
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
              key={btn.id}
              className={css.button}
              data-groupbtn-id={btn.id}
              style={focusId === btn.id ? divFocusStyle : divNoFocusStyle}
            >
              <Button
                size={size}
                shape={shape}
                className={`${sizeClassMap[size] || ''}`}
                style={focusId === btn.id ? btnFocusStyle : btnNoFocusStyle}
                onClick={() => groupBtnClick(tool, btn, fn)}
              >
                 {useIcon ?  btnItemR({icon, text: showText && title, location})  : showText && title}
              </Button>
            </div>
          )
        })
      }
    </div>
  )
}

function groupBtnClick(tool: Tool, btn: Tool, fn: (arg0: Tool, arg1: string) => void) {
  tool.focusId = btn.id
  fn(btn, 'groupBtn')
}

function renderSwitch(tool: Tool, env: Env, fn: (arg0: Tool, arg1: boolean) => void) {
  const { edit, runtime } = env || {}
  const { id, margin, defaultChecked = false } = tool
  const [left, right] = margin
  const marginStyle: AnyMap = {
    marginLeft: left + 2,
    marginRight: right + 2,
    height: 'fit-content',
    paddingTop: env.edit ? '5px' : '',
    paddingBottom: env.edit ? '5px' : ''
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
        onChange={(v) => fn(tool, v)}
      />}
    </div>
  )
}

function RenderPreview() {
  return (
    <div style={{padding: '2px'}}>
      <Button type={'default'}>按钮1</Button>
      <Button type={'default'}>按钮2</Button>
    </div>
)
}