import { Row, Col } from 'antd'
import { RuntimeParams } from 'src/types'
import css from './runtime.less'
// import { useObservable, useComputed } from '@mybricks/rxui'
import React, { useMemo, useCallback } from 'react'

export type JustifyType =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | undefined
export type AlignType = 'top' | 'middle' | 'bottom' | 'stretch' | undefined
// export type ColumnInnerFlexType = 'row' | 'column'
export type ColumnInnerJustifyType =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-around'
  | 'space-between'
export type ColumnInnerAlignType = 'start' | 'bottom' | 'center'
export interface ColumnParams {
  flex?: number | string
  justify: ColumnInnerJustifyType
  align: ColumnInnerAlignType
  backgroundColor?: string
  span: number
  key: string
  slot: string
  widthOption: string
  width?: number
}

export interface IRow {
  flex?: number | string
  justify: JustifyType
  gutter: number | object | []
  align: AlignType
  backgroundColor: string
  columns: ColumnParams[]
  key: string
  height?: string
}

interface IStyle {
  backgroundColor?: string
  borderRadius?: string
  display?: string
  flexDirection?: string
  height?: string
}

interface RStyle {
  flex?: number | string,
  alignItems?: string
}

export interface Data {
  rows: IRow[]
  style: IStyle
  rowStyle: RStyle
}

export default function ({ env, data, slots, outputs }: RuntimeParams<Data>) {
  const { preview, runtime } = env
  // const columnInnerStyle = useCallback(
  //   (
  //     flex: ColumnInnerFlexType = 'row',
  //     justify: ColumnInnerJustifyType = 'flex-start',
  //     align: ColumnInnerAlignType = 'center'
  //   ) => {
  //     const style: { [key: string]: string } = {
  //       width: '100%',
  //       height: '100%',
  //       display: 'flex',
  //       flexDirection: flex,
  //       justifyContent: justify,
  //       alignItems: align,
  //     }

  //     return style
  //   },
  //   []
  // )

  const noRows = useMemo(() => {
    if (data.rows.length <= 0) {
      return <div className={css.gridText}>添加行</div>
    }
  }, [data.rows.length])

  const column = useCallback(
    (column: ColumnParams, rowIndex: number, colIndex: number) => {
      column.widthOption = column.widthOption ? column.widthOption : 'span'

      const slotRender = slots[column.slot] && slots[column.slot].render()
      const height = data.rows[rowIndex].height
      let flex = ''
      if (column.widthOption === 'px') flex = column.width + 'px'
      if (column.widthOption === 'auto') flex = '1'
      let span = column.widthOption === 'span' ? column.span : void 0
      return (
        <Col
          className={!runtime ? css.colWrapper : void 0}
          key={column.key}
          span={span}
          flex={flex}
          data-index={`[${rowIndex}, ${colIndex}]`}
          style={{ height: height, backgroundColor: column.backgroundColor, overflow: height ? 'auto' : void 0 }}
        >
          {slotRender}
        </Col>
      )
    },
    [slots]
  )

  const previewRow = useMemo(() => {
    return (
      <div>
        <Row>
          <Col span={24} className={css.previewColLight}>col-24</Col>
        </Row>
        <Row gutter={0}>
          <Col span={12} className={css.previewColLight}>col-12</Col>
          <Col span={12} className={css.previewColDark}>col-12</Col>
        </Row>
        <Row gutter={0}>
          <Col span={8} className={css.previewColLight}>col-8</Col>
          <Col span={8} className={css.previewColDark}>col-8</Col>
          <Col span={8} className={css.previewColLight}>col-8</Col>
        </Row>
        <Row gutter={0}>
          <Col span={6} className={css.previewColLight}>col-6</Col>
          <Col span={6} className={css.previewColDark}>col-6</Col>
          <Col span={6} className={css.previewColLight}>col-6</Col>
          <Col span={6} className={css.previewColDark}>col-6</Col>
        </Row>
      </div>
    )
  }, [])

  return (
    <div className={css.gridWrapper} style={{ ...data.style }}>
      {preview && previewRow}
      {!preview && noRows}
      {!preview &&
        data.rows.map((row, rowIndex) => {
          return (
            <Row
              className={!runtime ? css.rowWrapper : void 0}
              style={row.flex ? { backgroundColor: row.backgroundColor, ...data.rowStyle } : { backgroundColor: row.backgroundColor }}
              data-row-index={rowIndex}
              key={row.key}
              justify={row.justify}
              align={row.align}
            // gutter={row.gutter}
            >
              {row.columns.map((item, colIndex) => {
                return column(item, rowIndex, colIndex)
              })}
            </Row>
          )
        })}
    </div>
  )
}
