import {REG} from "../columns";

export default {
  '.ant-table-thead .ant-table-cell': {
    title: '表格列',
    items: [
      {
        title: '常规',
        items: [
          {
            title: '标题',
            type: 'text',
            value: {
              get({data, focusArea}) {
                const col = data.columns[focusArea.index]
                return col.title
              }, set({data, focusArea}, tt) {
                const col = data.columns[focusArea.index]
                col.title = tt
              }
            }
          },
          {
            title: '字段',
            type: 'text',
            value: {
              get({data, focusArea}) {
                const col = data.columns[focusArea.index]
                return col.dataIndex
              }, set({data, focusArea}, tt) {
                const col = data.columns[focusArea.index]
                col.dataIndex = tt
              }
            }
          },
          {
            title: '类型',
            type: 'select',
            options() {
              return REG.map(reg => ({value: reg.type, label: reg.title}))
            },
            value: {
              get({data, focusArea}) {
                const col = data.columns[focusArea.index]
                return col.type
              }, set({data, focusArea}, tt) {
                const col = data.columns[focusArea.index]
                col.type = tt
              }
            }
          },
        ]
      },
      {
        title: '前移',
        type: 'button',
        ifVisible({data, focusArea}){
          return focusArea.index>0
        },
        value:{
          set({data, focusArea}){
            const col = data.columns[focusArea.index]
            data.columns.splice(focusArea.index,1)
            data.columns.splice(focusArea.index-1,0,col)
          }
        }
      },
      {
        title: '后移',
        type: 'button',
        ifVisible({data, focusArea}){
          return focusArea.index<data.columns.length-1
        },
        value:{
          set({data, focusArea}){
            const col = data.columns[focusArea.index]
            data.columns.splice(focusArea.index,1)
            data.columns.splice(focusArea.index+1,0,col)
          }
        }
      },
      {
        title: '删除',
        type: 'button'
      }
    ]
  },
  '[data-btns]': {
    title: '按钮组',
    items: [
      {
        title: '添加按钮',
        type: 'button'
      }
    ]
  },
  '[data-btns-btn]': {
    title: '按钮',
    items: [
      {
        title: '标题',
        type: 'text',
        value: {}
      },
      {
        title: '事件',
        sameAs: 'shortcut',
        items: [
          {
            title: '单击',
            type: 'button',
            value: {
              set({diagram}) {
                diagram.edit('btn0')
              }
            }
          }
        ]
      }
    ]
  }
}


function getColumn(dataIndex: string, {data}) {
  return data.columns.find(item => item.dataIndex === dataIndex)
}