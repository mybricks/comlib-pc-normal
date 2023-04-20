export default {
  ':root' ({ data }) {
    return {
      prompts: `你是一名优秀的程序员，根据用户的需求，返回合理的数据
      当前是一个对话框, 组件相关定义为：${JSON.stringify({...data, backgroundColor:'#FFFFFF'})}
      要求：
      1.回答仅返回JSON格式的内容，不需要任何注释等信息
      2.如果没有合适的答案，返回 null

      以下是一些例子：
      请回答：添加表格
      {
        title: "对话框",
        slots:{
          container:[
            {type:'mybricks.normal-pc.table'}
          ]
        }
      }
      `,
      execute({ data, newData, slots }) {
        const slot = slots.get('container')
        //1、标题
        if(typeof newData.title === 'string'){
          data.title = newData.title
        }
        //2、隐藏标题
        if(typeof newData.hideTitle === 'boolean'){
          data.hideTitle = newData.hideTitle
        }
        //3、垂直居中
        if(typeof newData.centered === 'boolean'){
          data.centered = newData.centered
        }
        //4、关闭按钮
        if(typeof newData.closable === 'boolean'){
          data.closable = newData.closable
        }
        //5、页脚显隐
        if(typeof newData.useFooter === 'boolean'){
          data.useFooter = newData.useFooter
        }
        //6、对齐方式
        if(typeof newData.footerLayout === 'string'){
          data.footerLayout = newData.footerLayout
        }
        //7、工具条
        if(newData.footerBtns !== undefined){
          data.footerBtns = newData.footerBtns
        }
        //8、对话框插槽里加入组件
        if(newData.slots !== undefined){
          if(newData.slots.container !== undefined){
            newData.slots.container.forEach((item)=>{
              if(item.type){
                slot.addCom(item.type)
              }
            })
          }
        }
        //9、对话框宽度
        if(typeof newData.width === 'number'){
          data.width = newData.width
        }
        //10、背景色
        if(typeof newData.backgroundColor === 'string'){
          if (!data.bodyStyle) {
            data.bodyStyle = {};
          }
          data.bodyStyle.backgroundColor = newData.backgroundColor
        }
        //11、最大限制高度
        // if(typeof newData.maxHeight === 'number'){
        //   data.bodyStyle.maxHeight = newData.maxHeight;
        // }
      }
    }
  },
  prompts: `根据用户的需求，设计一个合理的对话框
    例如：
    请回答：添加对话框
    {
      type:'mybricks.normal-pc.dialog',
      title: "请确认",
      footerBtns:[{ type: 'default', title: '关闭',"id": "Btn1","showText": true },{ type: 'primary', title: '确认',"id": "Btn2","showText": true }],
      slots:{}
    }
    注意：这里因为在提出的问题中没有对于对话框内部或者类型的描述，所以slots为空。
    请回答：对话框，包含一个文本
    {
      type:'mybricks.normal-pc.dialog',
      title: "请确认",
      footerBtns:[{ type: 'default', title: '关闭',"id": "Btn1","showText": true },{ type: 'primary', title: '确认',"id": "Btn2","showText": true }],
      slots:{
        container:[
          {type:'mybricks.normal-pc.text'}
        ]
      }
    }
    请回答：确认类型对话框
    {
      type:'mybricks.normal-pc.dialog',
      title: "请确认",
      footerBtns:[{ type: 'default', title: '关闭',"id": "Btn1","showText": true },{ type: 'primary', title: '确认',"id": "Btn2","showText": true }],
      slots:{
        container:[
          {type:'mybricks.normal-pc.form-container', slots:{ content: [{type:'mybricks.normal-pc.form-text', label: '输入框', name: 'name0'}] }}
        ]
      }
    }`,
  '@create'(props) {
    const { def, data } = props
    console.log('def',def)
    //1、标题
    if(typeof def.title === 'string'){
      data.title = def.title
    }
    //2、工具条
    if(def.footerBtns){
      data.footerBtns = def.footerBtns
    }
    if(def.slots.container !== undefined && def.slots){
      const items = def.slots.container;
      if(items.length === 1 && def.slots.container[0].type === 'mybricks.normal-pc.form-container'){
        data.useFooter = false
      }
    }
  }
}