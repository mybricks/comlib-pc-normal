import React, { Fragment, useCallback } from 'react'
import { Space, Button, Tag } from 'antd'
import { FallOutlined, RiseOutlined } from '@ant-design/icons'
import css from '../runtime.less'
interface ScratchBlock {
  // customType: CustomType
  key: string
  outputId?: string
}
interface ButtonBlock extends ScratchBlock {
  customType: 'button'
  size: string
  type: string
  disabled?: boolean
  danger?: boolean
  title: string
}
interface PlainButtonBlock extends ScratchBlock {
  customType: 'plainButton'
  size: string
  type: string
  disabled: boolean
  className: string
  title: string
}
interface TextBlock extends ScratchBlock {
  customType: 'text'
  color: string
  content: string
}

interface TagBlock extends ScratchBlock {
  customType: 'tag'
  color: string
  title: string
}

interface ArrowBlock extends ScratchBlock {
  customType: 'arrow',
  type: 'rise' | 'fall'
}

interface WrapBlock extends ScratchBlock {
  customType: 'wrap',
  style: {
    padding: number[]
  }
}

type ScratchBlockType = ButtonBlock | PlainButtonBlock | TextBlock | TagBlock | ArrowBlock | WrapBlock
export type CustomType = ScratchBlockType['customType']

// type ScratchBlockType = ButtonBlock | PlainButtonBlock

interface ViewRow {
  type: 'default' | 'block'
  blocks: ScratchBlockType[]
}

interface ColumnCustomProps {
  scratchBlocks: ScratchBlockType[]
  record: Record<string, any>
  env: any
  outputs: any
  direction?: string
}

export default function ColumnCustom({ scratchBlocks, record, env, outputs, direction }: ColumnCustomProps) {

  const columnDirection =  direction || 'horizontal'

  const onOutput = useCallback((item) => {
    if (env.runtime && item.outputId) {
      outputs[item.outputId]({ ...record });
    }
  }, [])

  const scratchBlock = useCallback((item: ScratchBlockType) => {
    if (item.customType === 'button') {
      return (
        <Button
          key={item.key}
          size={item.size}
          type={item.type}
          disabled={item.disabled}
          danger={item.danger}
          onClick={() => {
            onOutput(item)
          }}
        >{getTitle(item.title)}</Button>
      )
    } else if (item.customType === 'plainButton') {
      return (
        <Button
          className={css[item.className]}
          key={item.key}
          size={item.size}
          type={item.type}
          disabled={item.disabled}
          onClick={() => {
            onOutput(item)
          }}
        >{getTitle(item.title)}</Button>
      )
    } else if (item.customType === 'text') {
      return (
        <span
          style={{ color: item.color, cursor: item.outputId ? 'pointer': void 0 }}
          key={item.key}
          onClick={() => {
            onOutput(item)
          }}
        >{getTitle(item.content)}</span>
      )
    } else if (item.customType === 'tag') {
      return (
        <Tag
          key={item.key}
          color={item.color}
          // visible={item.visible}
        >{getTitle(item.title)}</Tag>
      )
    } else if (item.customType === 'arrow') {
      const typeMap = {
        rise: <RiseOutlined key={item.key} style={{ color: '#f5222d' }} />,
        fall: <FallOutlined key={item.key} style={{ color: '#52c41a' }} />
      }
      return typeMap[item.type]
    } else {
      return ''
    }
  }, [])
  const viewList = getViewForScratchBlocks(scratchBlocks)
  // console.log(scratchBlocks)
  
  return (
    <Fragment>
      {
        viewList.map((row, index) => {
          if (row.type === 'block') {
            const style = row.blocks[0].style

            return (
              <div key={index} style={{ paddingTop: style?.padding[0], paddingBottom: style?.padding[1] }}></div>
            )
          }
      
          return (
            <div key={index}>
              <Space direction={columnDirection} wrap>
                {row.blocks.map((item) => {
                  return scratchBlock(item)
                })}
              </Space>
            </div>
          )
        })
      }
    </Fragment>
  )
}

function getTitle (val: any) {
  if (typeof val === 'string' || typeof val === 'number') {
    return val
  }
  console.error(`Scratch 块数据发生错误：接受到数据类型为 ${typeof val}`)
  return '数据错误'
}

function getViewForScratchBlocks (scratchBlocks: ScratchBlockType[]) {
  const arr: Array<ViewRow> = []
  let index = 0

  scratchBlocks.forEach(item => {
    if (item.customType === 'wrap') {
      index = index + 1
      arr[index] = { type: 'block', blocks: [item] }
      index = index + 1
    } else {
      if (!arr[index]) {
        arr[index] = { type: 'default', blocks: [] }
      }
      arr[index]['blocks'].push(item)
    }
  })

  return arr
}