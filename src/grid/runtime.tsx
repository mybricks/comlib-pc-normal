import { Row, Col } from 'antd'
// import { RuntimeParams } from 'src/types'
import css from './runtime.less'
// import { useObservable, useComputed } from '@mybricks/rxui'
import React, { useMemo, useCallback, useRef } from 'react'
import debounce from 'lodash/debounce';

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
  contentWidth?: string;
  colStyle?: Record<string, string>
  useClick?: boolean;
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

  overflowY?: string;
  overflowX?: string;
}

interface RStyle {
  flex?: number | string,
  alignItems?: string
}

export interface Data {
  rows: IRow[]
  style: IStyle
  rowStyle: RStyle
  widthUnit?: string;
}

export default function ({ env, data, slots, outputs }: RuntimeParams<Data>) {
  const { preview, runtime, edit } = env
  const comAryRef = useRef<Set<any>>(new Set());
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

  const hasResizeEditor = (item) => {
    if (item && item.getConfigs) {
      const [config] = item.getConfigs() || [];
      return config?.groups?.[0]?.items?.some(
        (item) => item?.type === '_resizer_'
      );
    }
    return false;
  };
  // 渲染时更新内容宽度
  const updateSlotComAry = useCallback((slotRender, contentWidth) => {
    slotRender?.props?.model?.comAry?.forEach((item) => {
      if (contentWidth) {
        if (!hasResizeEditor(item)) {
          item.style._width_ = item.style._width_ || item.style.width;
          item.style.width = contentWidth;
        }
      } else {
        if (item.style._width_) {
          item.style.width = item.style._width_;
          delete item.style._width_;
        }
      }
    });
  }, []);
  // 对比渲染前后的插槽数据，恢复已移除组件的内容宽度
  const removeSlotComAry = debounce(() => {
    const tempComAryRef = new Set();
    Object.keys(slots).forEach(key => {
      const slotRender = slots[key] && slots[key].render();
      slotRender?.props?.model?.comAry?.forEach(item => {
        comAryRef.current.add(item);
        tempComAryRef.add(item);
      });
    });
    comAryRef.current.forEach(item => {
      if (!tempComAryRef.has(item)) {
        if (item.style._width_) {
          item.style.width = item.style._width_;
          delete item.style._width_;
        }
        comAryRef.current.delete(item);
      }
    });
  }, 300);

  const column = useCallback(
    (column: ColumnParams, rowIndex: number, colIndex: number, rowHeight: string) => {
      column.widthOption = column.widthOption ? column.widthOption : 'span'

      const slotRender = slots[column.slot] && slots[column.slot].render()
 
      let flex = ''
      if (column.widthOption === 'px') flex = column.width + 'px'
      if (column.widthOption === 'auto') flex = '1'
      let span = column.widthOption === 'span' ? column.span : void 0
      updateSlotComAry(slotRender, column.contentWidth);
      removeSlotComAry();
      return (
        <Col
          className={!runtime ? css.colWrapper : void 0}
          key={column.key}
          span={span}
          flex={flex}
          data-index={`[${rowIndex}, ${colIndex}]`}
          style={{
            height: rowHeight,
            backgroundColor: column.backgroundColor,
            // overflow: height ? 'auto' : void 0,
            ...column.colStyle,
            cursor: column.useClick ? 'pointer' : 'unset'
          }}
          onClick={() => {
            if (column.useClick && outputs[column.key]) {
              outputs[column.key](true);
            }
          }}
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
          let rowHeight = row.height;
          if (edit && rowHeight == void 0 && row.columns.every(column => slots[column.slot]?.size === 0)) {
            rowHeight = '50px';
          }
          return (
            <Row
              className={!runtime ? css.rowWrapper : void 0}
              style={row.flex ? { backgroundColor: row.backgroundColor, alignItems: 'stretch', ...data.rowStyle } : { backgroundColor: row.backgroundColor, alignItems: 'stretch' }}
              data-row-index={rowIndex}
              key={row.key}
              justify={row.justify}
              align={row.align}
            // gutter={row.gutter}
            >
              {row.columns.map((item, colIndex) => {
                return column(item, rowIndex, colIndex, rowHeight)
              })}
            </Row>
          )
        })}
    </div>
  )
}
