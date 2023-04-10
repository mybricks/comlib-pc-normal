import { uuid } from '../utils';

export default {
  def: {
    columns: [
      {
        field: 'name',
        title: '名称',
        slots: []
      }
    ],
    headStyle: {
      color: '#1f1f1f',
      backgroundColor: '#f5f7f9'
    },
    contentStyle: { color: '#434343' },
    usePagination: true
  },
  prompts: `
    例如：
    问：带有编辑功能的表格
    答：{
          type:'mybricks.normal-pc.table',
          usePagination: true,
          headStyle: {
            color: '#1f1f1f',
            backgroundColor: '#f5f7f9'
          },
          contentStyle: { color: '#434343' },
          columns:[
            {field:'name',title:'名称'},
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
          ],
        }
  `,
  '@create'(props) {
    const { def, data, slots } = props;
    console.log('props', props);

    if (def.headStyle) {
      data.headStyle = { ...def.headStyle };
    }
    if (def.contentStyle) {
      data.contentStyle = { ...def.contentStyle };
    }

    data.columns = def.columns.map((item) => {
      let slotId;
      if (Array.isArray(def.columns) && def.columns.length > 0) {
        if (Array.isArray(item.slots) && item.slots.length > 0) {
          slotId = uuid();
          slots.add({ id: slotId, title: '操作', type: 'scope' });
          item.slots.forEach((s) => {
            // console.log('slot.get(slotId)', slots.get(slotId));
            slots.get(slotId).addCom(s.namespace);
          });
        }
      }
      return {
        _id: uuid(),
        title: item.title,
        dataIndex: item.field,
        key: item.field,
        contentType: slotId ? 'slotItem' : 'text',
        visible: true,
        width: 140,
        slotId,
        headStyle: def.headStyle ? { ...def.headStyle } : {},
        contentStyle: def.contentStyle ? { ...def.contentStyle } : {}
      };
    });

    if (typeof def.usePagination !== 'undefined') {
      data.usePagination = def.usePagination;
    }
    // TODO: 如何统计处理slots内组建的创建
  }
};
