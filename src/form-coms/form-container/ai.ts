export default {

  ':root'({ data }) {
    return {
      prompts: `
      你是一名优秀的程序员，当前是一个表单容器,
      添加组件的 namespace 必须由以下定义中选出进行组合：['form-text', 'select', 'radio', 'password', 'auto-complete', 'cascader', 'checkbox', 'date-picker', 'color', 'input-number', 'form-email', 'input-textarea', 'form-phone-number', 'range-picker', 'rate', 'search', 'slider', 'time-picker', 'time-range-picker', 'transfer', 'upload']
      返回的数据类型定义为{type: 'addItem'|'updateForm', namespace: string, config: {label: stirng, name: string}}, 如果需要添加多个组件则返回数组结构
      以下是一些例子：
      请回答：添加输入框
      { type: 'addItem', namespace: 'form-text', config: { label: '输入框', name: 'name0' } }
      请回答：输入框、下拉框
      [{ type: 'addItem', namespace: 'form-text', config: { label: '输入框', name: 'name0' } },{ type: 'addItem', namespace: 'select', config: { label: '下拉框', name: 'name1'  } }]
      请回答：文本与上传
      [{ type: 'addItem', namespace: 'form-text', config: { label: '输入框', name: 'name0' } },{ type: 'addItem', namespace: 'upload', config: { label: '上传', name: 'name1'  } }]
      请回答：简单的登录表单
      [{ type: 'addItem', namespace: 'form-text', config: { label: '用户名', name: 'username' } },{ type: 'addItem', namespace: 'password', config: { label: '密码', name: 'password'  } }]
      请回答：内联布局
      {type: 'updateForm', data: { config: { layout: 'inline' } }}
      请回答：每行4列
      {type: 'updateForm', data: { formItemColumn: 4 }}
      仅需返回合法的JSON，不需要任何注释等信息
      `,
      execute({ data, newData, slots }) {
        // console.log(newData)
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
  },
//   '[data-menugroup]'({ data, focusArea }) {
//     const menuIndex = focusArea.dataset['menugroup']

//     const menuGroup = data.modules.navMenu.menus[parseInt(menuIndex)]

//     return {
//       prompts: `
// 您是一位卓越的产品架构师，请根据用户的需求，设计一个合理的后台管理系统的模块.
// 要求返回的答案是json格式.
// 当前模块定义为:${JSON.stringify(menuGroup)}
//       `,
//       execute({ data, newData, slots }) {
//         const menuGroup = data.modules.navMenu.menus[parseInt(menuIndex)]
//         menuGroup.subMenus = newData.subMenus
//       }
//     }
//   },
  prompts () {
    const def = {
      layout: 'horizontal',
      buttons: [{type: 'primary', title: '提交'}],
      buttonsAlign: 'left',
      formItemColumn: 1
    }

    return `根据用户的需求，设计一个合理的后台管理系统的表单，其中包括布局、标题文案、按钮、表单项类型等
    组件定义: ${JSON.stringify(def)}
    可添加的表单项type：['form-text', 'select', 'radio', 'password', 'auto-complete', 'cascader', 'checkbox', 'date-picker', 'color', 'input-number', 'form-email', 'input-textarea', 'form-phone-number', 'range-picker', 'rate', 'search', 'slider', 'time-picker', 'time-range-picker', 'transfer', 'upload']
    布局说明：buttons单独为一列，总列数为表单项数+1
    例如：
    请回答：过滤表单
    {type:'mybricks.normal-pc.form-container',buttons:[{type:'primary',title:'搜索'}],slots:{}} 注意：这里因为在提出的问题中没有对于表单项的描述，所以slots为空。
    请回答：过滤表单，包含一个输入框
    {
      type:'mybricks.normal-pc.form-container',
      buttons:[{type:'primary',title:'查询'}],
      layout: 'inline',
      formItemColumn: 4,
      slots:{
        content:[
          {type:'mybricks.normal-pc.form-text', label: '输入框', name: 'name0'}
        ]
      }
    }
    请回答：一行排列表单
    {
      type:'mybricks.normal-pc.form-container',
      buttons:[{type:'primary',title:'查询'}],
      formItemColumn: 2,
      slots:{
        content:[
          {type:'mybricks.normal-pc.form-text', label: '输入框', name: 'name0'}
        ]
      }
    }
    请回答：过滤表单，1行3列布局
    {
      type:'mybricks.normal-pc.form-container',
      buttons:[{type:'primary',title:'查询'}],
      layout: 'inline',
      formItemColumn: 3,
      slots:{
        content:[
          {type:'mybricks.normal-pc.form-text', label: '输入框', name: 'name0'}
        ]
      }
    }
  `
  },
  '@create'(props) {
    const { def, data } = props
    // console.log('def:', def)
    if (def.buttons && def.buttons.length > 0) {
      def.buttons.forEach((item, index) => {
        data.actions.items[index].title = item.title
      })

      data.actions.items = data.actions.items.slice(0, def.buttons.length)
    }

    if (typeof def.buttonsAlign === 'string') {
      data.actions.align = def.buttonsAlign
    }

    if (typeof def.formItemColumn === 'number') {
      data.formItemColumn = def.formItemColumn + 1
      data.actions.span = (24 / data.formItemColumn)
      setTimeout(() => {
        data.items.forEach(item => {
          item.span = (24 / data.formItemColumn);
        })
      }, 100)
    }

    setTimeout(() => {
      if (def.slots && def.slots.content && def.slots.content.length > 0) {
        def.slots.content.forEach((item, index) => {

          if (data.items[index]) { // Todo...
            item.label && (data.items[index].label = item.label)
            item.name && (data.items[index].name = item.name)
          }

        })
      }
    }, 100)

    if (typeof def.layout === 'string') {
      data.config.layout = def.layout
    }
    // console.log('data:', data)
  }
}