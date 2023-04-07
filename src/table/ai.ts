import { uuid } from '../utils';

export default {
  def: {
    columns: [{ field: 'name', title: '名称', slots: [] }],
    usePagination: true
  },
  prompts: `
    例如：
    问：带有编辑功能的表格
    答：{
          type:'mybricks.normal-pc.table',
          usePagination: true,
          columns:[
            {field:'name',title:'名称'},
            ..., // 其他列，此处作为演示已省略
            {
              field:'$handlers',
              title:'操作',
              slots: [
                {
                  namespace: 'mybricks.normal-pc.custom-button',
                  def: { text: '编辑', },
                },
              ]
            }
          ]
        }
  `,
  '@create'(props) {
    const { def, data } = props;
    if (Array.isArray(def.columns) && def.columns.length > 0) {
      data.columns = def.columns.map((item) => ({
        _id: uuid(),
        title: item.title,
        dataIndex: item.field,
        key: item.field,
        contentType: item.buttons ? 'slotItem' : 'text',
        visible: true,
        width: 140
      }));
    }

    if (typeof def.usePagination !== 'undefined') {
      data.usePagination = def.usePagination;
    }

    // TODO: 如何统计处理slots内组建的创建
  }
};
