const version = ANTD_VERSION === 4 ? "" : "antd5."

export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '数据表格',
    usage: `data数据模型
rowKey: string # 表格行的唯一标识字段
dataSource: any[] # 表格数据源
columns: [ # 表格列配置
{
  key: string # 列唯一标识
  dataIndex: string
  title: string # 列标题
  width: string | number 
  visible: boolean 
  isRowKey: boolean 
  contentType: ['text', 'slotItem'] # 列内容类型
}
]
fixedHeader: boolean # 是否固定表头
enableStripe: boolean # 是否启用斑马纹
usePagination: boolean
paginationConfig: { 
total: number
current: number 
pageSize: number 
showSizeChanger: boolean 
showQuickJumper: boolean 
}

slots插槽
动态插槽，当cloumn的contentType为slotItem时，对应列的key

styleAry声明
表格: .ant-table
表头: .ant-table-thead
内容: .ant-table-tbody
分页: [data-table-pagination]

使用案例
\`\`\`dsl file="page.dsl"
<mybricks.normal-pc.${version}table
title="带分页和自定义操作列的表格"
layout={{ width: '100%' }}
data={{
  rowKey: "id",
  dataSource: [
    { id: "1", name: "张三", studentId: "20230001", class: "高一(1)班", status: "在校", lastExit: "2023-06-10 18:30", days: 0 }
  ],
  columns: [
    { key: "name", dataIndex: "name", title: "普通列", width: 120, visible: true, isRowKey: false, contentType: "text" },
    { key: "class", dataIndex: "class", title: "自适应宽度列", width: 'auto', visible: true, isRowKey: false, contentType: "text" },
    { key: "operation", dataIndex: "operation", title: "自定义插槽操作列", width: 120, visible: true, isRowKey: false, contentType: "slotItem", slotId: "operation" }
  ],
  enableStripe: true,
  usePagination: true,
  paginationConfig: {
    total: 50,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true
  }
}}
>
<slots.operation title="自定义操作列" layout={{ width: '100%', flexDirection: 'row' }}>
  <mybricks.normal-pc.${version}custom-button
    title="查看详情按钮"
    layout={{ width: 'fit-content' }}
    data={{
      size: "small",
      text: "查看详情",
      type: "link"
    }}
  />
</slots.operation>
</mybricks.normal-pc.${version}table>
\`\`\``
  },
  modifyTptJson: (component) => {
    if (!component.data) {
      component.data = {}
    }

    component.data.layout = component.data?.direction === 'row' ? 'horizontal' : 'vertical'
    delete component.data?.direction
    if (component.data.layout === 'vertical') {
      component.data.itemWidth = '100%'
    } else if (component.data.layout === 'horizontal') {
      component.data.isAuto = component.data.wrap ?? true
      delete component.data.wrap
    }

    component.data.useLoading = false;
    component.data.loadingTip = '加载中...';
  }
}