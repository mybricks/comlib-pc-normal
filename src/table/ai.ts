import { uuid } from '../utils';
import { merge } from 'lodash'

export default {
  prompts() {
    return `下面是数据表格的问答示例
    例如：
    请回答：设计一个表格
    {
          type:'mybricks.normal-pc.table',
          usePagination: true,
          headStyle: {
            color: '#1f1f1f',
            backgroundColor: '#f5f7f9'
          },
          contentStyle: { color: '#434343' },
          columns:[
            {field:'name',title:'名称'},
          ],
        }
  `
  },
  '@create'(props) {
    const { def, data, slots } = props;

    if (def.headStyle) {
      data.headStyle = { ...def.headStyle };
    }
    if (def.contentStyle) {
      data.contentStyle = { ...def.contentStyle };
    }

    data.columns = def.columns.map((item) => {
      let slotId;
      // if (Array.isArray(def.columns) && def.columns.length > 0) {
      //   if (Array.isArray(item.slots) && item.slots.length > 0) {
      //     slotId = uuid();
      //     slots.add({ id: slotId, title: '操作', type: 'scope' });
      //     item.slots.forEach((s) => {
      //       // console.log('slot.get(slotId)', slots.get(slotId));
      //       slots.get(slotId).addCom(s.namespace);
      //     });
      //   }
      // }
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
  },

  ':root'({ data }) {
    return {
      prompts: `
        你是一个优秀的程序员，当前是一个数据表格组件,你可以修改配置返回我需要的内容，当前的配置为${JSON.stringify(data)},
        以下是一些例子，其中关于样式部分的配置你可以根据问题进行修改：
        请回答：修改成一个普通数据表格
        {
          type:'mybricks.normal-pc.table',
          columns:[
            {field:'name',title:'名称'},
            {field:'age',title:'年龄'},
          ],
        }
        请回答：修改表格的样式
        {
          headStyle: {
            color: '#1f1f1f',
            backgroundColor: '#f5f7f9'
          },
          contentStyle: { color: '#434343' },
        },
      `,
      execute({ data, newData, slots }) {
        if (newData.headStyle) {
          data.headStyle = { ...newData.headStyle };
        }
        if (newData.contentStyle) {
          data.contentStyle = { ...newData.contentStyle };
        }

        if (newData.columns) {
          data.columns = [...newData.columns];
        }
        data.columns = data.columns.map((item, index) => {
          return {
            ...item,
            headStyle: newData.headStyle ? { ...newData.headStyle } : undefined,
            contentStyle: newData.contentStyle ? { ...newData.contentStyle } : undefined,
          }
        })
      }
    }
  }
};
