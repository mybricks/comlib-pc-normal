import css from './Btns.less'
import {Table, Button} from 'antd'
import {observe} from "@mybricks/rxui";
import {TableCtx} from "../DataTable";

export default function ({col, ctx}) {
  //observe(TableCtx, {from: 'parents'})

  return (
    <Table.Column
      {...col}
      title={col.title}
      key={col.dataIndex}
      render={(text, record) => {
        return (
          <div className={css.btns} data-btns={1}>
            <Button data-btns-btn={1}
                    onClick={e => click(e, record, ctx)}>查看</Button>
          </div>
        )
      }}
    />
  )
}

function click(e, rowData, ctx) {
  ctx.outputs['btn0'](rowData)
}