interface FormContainerAiProps {
  type: string // addItem, updateItem
  namespace: string
  config: {
    name: string
    label: string
    description: string
    tooltip: string
    descriptionStyle: any
    labelStyle: any
  }
}

export default {
  '@focus'({ data }) {
    return {
      data,
      prompts: `
      添加的物料由以下数据中选出：['mybricks.normal-pc.form-text', 'mybricks.normal-pc.select', 'mybricks.normal-pc.radio', 'mybricks.normal-pc.password']
      以下是一些例子：
      Q：添加输入框
      A：[{ type: 'addItem', namespace: 'mybricks.normal-pc.form-text', config: { label: '输入框', name: 'name0'  } }]
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
            newItem.name && (item.name = newItem.name + '_' + newItem.id)
            newItem.label && (item.label = newItem.label)
          }
          
          // console.log(newItem.id, item)
        })
      }, 0)
      
    } catch (ex) {
      console.error(ex)
    }
    
  }
}