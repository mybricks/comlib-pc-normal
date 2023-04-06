// interface FormContainerAiProps {
//   type: string // addItem, updateItem
//   namespace: string
//   config: {
//     name: string
//     label: string
//     description: string
//     tooltip: string
//     descriptionStyle: any
//     labelStyle: any
//   }
// }
export default {
  def: {
    layout: "horizontal",
    buttons:[{type:'default',title:'提交'}]
  },
  prompts: `
    例如：
    问：过滤表单
    答：{type:'mybricks.normal-pc.form-container',buttons:[{type:'default',title:'搜索'}],slots:{}} 注意：这里因为在提出的问题中没有对于表单项的描述，所以slots为空。
    问：过滤表单，包含一个输入框
    答：{
          type:'mybricks.normal-pc.form-container',
          buttons:[{type:'default',title:'查询'}],
          slots:{
            content:[
               {type:'mybricks.normal-pc.form-text'}
            ]
          }
       }
  `,
  '@focus'({ data }) {
    const { items, config, ...otherData } = data

    return {
      data: {
        config
      },
      prompts: `
      当前是一个表单容器,
      添加组件的 namespace 必须由以下定义中选出进行组合：['form-text', 'select', 'radio', 'password', 'auto-complete', 'cascader', 'checkbox', 'date-picker', 'color', 'input-number', 'form-email', 'input-textarea', 'form-phone-number', 'range-picker', 'rate', 'search', 'slider', 'time-picker', 'time-range-picker', 'transfer', 'upload']
      返回的数据类型定义为{type: 'addItem'|'updateForm', namespace: string, config: {label: stirng, name: string}}, 如果需要添加多个组件则返回数组结构
      以下是一些例子：
      问：添加输入框
      答：{ type: 'addItem', namespace: 'form-text', config: { label: '输入框', name: 'name0' } }
      问：输入框、下拉框
      答：[{ type: 'addItem', namespace: 'form-text', config: { label: '输入框', name: 'name0' } },{ type: 'addItem', namespace: 'select', config: { label: '下拉框', name: 'name1'  } }]
      问：文本与上传
      答：[{ type: 'addItem', namespace: 'form-text', config: { label: '输入框', name: 'name0' } },{ type: 'addItem', namespace: 'upload', config: { label: '上传', name: 'name1'  } }]
      问：简单的登录表单
      答：[{ type: 'addItem', namespace: 'form-text', config: { label: '用户名', name: 'username' } },{ type: 'addItem', namespace: 'password', config: { label: '密码', name: 'password'  } }]
      问：内联布局
      答：{type: 'updateForm', data: { config: { layout: 'inline' } }}
      问：每行4列
      答：{type: 'updateForm', data: { formItemColumn: 4 }}
      `
    }
  },
  '@update'({ data, newData, slots }) { // 1. 动态添加组件，2. 样式问题  { namespace: mybricks.normal-pc.form-container }
    console.log(data, newData)
    try {
      const slot = slots.get('content')
      const newItems: any[] = []

      if (Array.isArray(newData)) {
        newData.forEach(item => {
          if (item.type === 'addItem') {
            const id = slot.addCom(`mybricks.normal-pc.${item.namespace}`)
            newItems.push({ id, ...item.config })
          }
        })
      } else {
        if (newData.type === 'addItem') {
          const id = slot.addCom(`mybricks.normal-pc.${newData.namespace}`)
          newItems.push({ id, ...newData.config })
        }

        if (newData.type === 'updateForm') {
          if (typeof newData.data?.formItemColumn === 'number') {
            data.formItemColumn = newData.data?.formItemColumn
            data.actions.span = (24 / data.formItemColumn)
            data.items.forEach(item => {
              item.span = (24 / data.formItemColumn);
            })
          }

          if (typeof newData.data?.config?.layout === 'string') {
            data.config.layout = newData.data?.config?.layout
          }
        }
      }

      setTimeout(() => { // hack...
        newItems.forEach(newItem => {
          const item = data.items.find(item => item.id === newItem.id)
          console.log(item, newItem)
          if (item) {
            newItem.name && (item.name = newItem.name + '_' + newItem.id)
            newItem.label && (item.label = newItem.label)
          }
        })
        // console.log(data.items)
      }, 100)
      
    } catch (ex) {
      console.error(ex)
    }
    
  }
}