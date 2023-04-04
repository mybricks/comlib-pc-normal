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
  '@focus'({ data }) {
    const { items, ...otherData } = data

    return {
      data: otherData,
      prompts: `
      当前是一个表单容器
      添加的物料namespace必须由以下定义中选出进行组合：['mybricks.normal-pc.form-text', 'mybricks.normal-pc.select', 'mybricks.normal-pc.radio', 'mybricks.normal-pc.password']
      类型相关定义如下：type ActionType = 'addItem'; interface Res { type: ActionType, namespace: string, config: {label: stirng, name: string}};
      返回的数据定义为 Res | Res[]
      以下是一些例子：
      Q：添加输入框
      A：{ type: 'addItem', namespace: 'mybricks.normal-pc.form-text', config: { label: '输入框', name: 'name0'  } }
      Q：添加输入框和下拉框
      A：[{ type: 'addItem', namespace: 'mybricks.normal-pc.form-text', config: { label: '输入框', name: 'name0'  } },{ type: 'addItem', namespace: 'mybricks.normal-pc.select', config: { label: '下拉框框', name: 'name1'  } }]
      `
    }
  },
  '@update'({ data, newData, slots }) { // 1. 动态添加组件，2. 样式问题  { namespace: mybricks.normal-pc.form-container }
    // console.log(data, newData)
    try {
      const slot = slots.get('content')
      const newItems: any[] = []

      if (Array.isArray(newData)) {
        newData.forEach(item => {
          if (item.type === 'addItem') {
            const id = slot.addCom(item.namespace)
            newItems.push({ id, ...item.config })
          }
        })
      } else {
        if (newData.type === 'addItem') {
          const id = slot.addCom(newData.namespace)
          newItems.push({ id, ...newData.config })
        }
      }
      // if (newData.namespace) {
      //   if (typeof newData.namespace === 'string') {
      //     slot.addCom(newData.namespace)
      //   } else if (Array.isArray(newData.namespace)) {
      //     newData.namespace.forEach(namespace => {
      //       const id = slot.addCom(namespace)
      //       ids.push(id)
      //     })
      //   }
      // }

      setTimeout(() => {
        newItems.forEach(newItem => {
          const item = data.items.find(item => item.id === newItem.id)
          if (item) {
            // console.log(item, newItem)
            newItem.name && (item.name = newItem.name + '_' + newItem.id)
            newItem.label && (item.label = newItem.label)
          }
        })
        // console.log(data.items)
      }, 0)
      
    } catch (ex) {
      console.error(ex)
    }
    
  }
}