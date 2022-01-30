import css from './DataTable.less'
import {useComputed, useObservable} from "@mybricks/rxui";
import {Table} from 'antd'

import getCol from './columns'
import {useMemo} from "react";

export class TableCtx {
  ds
  outputs
  loading: boolean = true
}

export default function ({env, data, outputs}) {
  const ctx = useObservable(TableCtx, next => {
    next({outputs})
  }, {to: 'children'})

  const columns = useComputed(() => {
    return data.columns.map(col => getCol({col, ctx}))
  })

  useMemo(() => {
    if (env.edit) {
      const rowData = {key: 1}
      data.columns.forEach(col => {
        rowData[col.dataIndex] = '数据'
      })
      ctx.ds = [rowData]
      ctx.loading = false
    } else if (env.runtime) {
      if (data.useDSInput) {

      } else {
        if (data.fns) {
          const rtn = []

          const script = data.fns[0].script
          eval(`(function (datasource) {
            ${script}
          })`)(ds => {
            if (Array.isArray(ds)) {
              ds.forEach((row, idx) => {
                const rowData = {key: idx}
                data.columns.forEach(col => {
                  rowData[col.dataIndex] = row[col.dataIndex]
                })
                rtn.push(rowData)
              })
            }
            ctx.ds = rtn
            ctx.loading = false
          })
        }
      }
    }
  }, [])


  return (
    <div className={css.dataTable}>
      <Table rowKey='key' size='small'
             loading={ctx.loading}
             bordered={data.bordered}
             dataSource={ctx.ds}>
        {columns}
      </Table>
    </div>
  )
}