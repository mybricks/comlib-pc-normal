///TODO 抓紧完善
export default {
  def: {
    columns:[{field:'name',title:'名称'}]
  },
  prompts: `
    例如：
    问：带有编辑功能的表格
    答：{
          type:'mybricks.normal-pc.table',
          columns:[
            {field:'name',title:'名称'},
            ..., // 其他列
            {
              field:'$handlers',
              title:'操作',
              buttons:[
                {title:'编辑',handler:'edit'}
              ]
            }
          ]
        }
  `
}