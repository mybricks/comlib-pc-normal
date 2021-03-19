import {Table} from 'antd'

export default function ({col,ctx}) {
  return (
    <Table.Column
      {...col}
      title={col.title}
      key={col.dataIndex}
      width={col.width||200}
    />
  )
}