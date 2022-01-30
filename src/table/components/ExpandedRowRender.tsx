import React from 'react'
import { getScratchScript } from '../utils'
import { observe, useComputed } from '@mybricks/rxui'
import { TableContent } from '../runtime'
import ColumnCustom from '../column-custom'

interface ExpandedRowRenderProps {
  record: Record<string, any>
  index: number
  indent: number
  expanded: boolean
}

export default function ExpandedRowRender ({ record, index, indent, expanded }: ExpandedRowRenderProps) {
  const tableContent = observe(TableContent, { from: 'parents' })
  const { runtime } = tableContent.env
  const script = tableContent.data.expandableBlocks.script || ''
  const noScriptView = useComputed(() => {
    return <div>请在右侧编辑展开显示内容</div>
  })
  let result: JSX.Element

  if (!script) {
    return runtime ? <div></div> : noScriptView
  }

  try {
    const evalScript = getScratchScript(tableContent.data.expandableBlocks)
    const validatorFn = eval(evalScript)
    const rowInput = {
      record,
      index
    }
    const scratchBlocks = validatorFn(rowInput) || []

    result = (
      <ColumnCustom
        scratchBlocks={scratchBlocks}
        record={record}
        env={tableContent.env}
        outputs={tableContent.outputs}
      />
    )
  } catch (e) {
    result = <div>Scratch错误，请检查</div>
    console.warn(e)
  }
  
  return result
}