export default {
  def: {
    jsCode: `({outputs,inputs})=>{outputs.output0(inputs.inputValue0)}`
  },
  prompts({startPin}){
    return `
      现在有一个函数模版A,如下所示({outputs,inputs})=>{},
      函数模版A中,inputs内可能包含了多个字段,第一个字段为inputs.inputValue0,第二个字段为inputs.inputValue1,以此类推,不存在不符合规律的其他字段,
      outputs可能包含了多个字段,第一个字段为outputs.output0,第二个字段为outputs.output1,以此类推,不存在不符合规律的其他字段,
      inputs下各字段值以及outputs下各函数的输出严格按照所给的JSON Schema来实现,所有的返回都由outputs下函数处理,所有的JSON Schema默认均为{"type":"any"},
      请以资深前端工程师的角度基于函数模版A以及以下所描述的功能按需使用inputs和outputs生成JS计算组件的定义,
      假设当前inputValue0的JSON Schema为{"type":"string"}
      问: 生成一个0-100的随机数，如果该随机数大于50从输出项1输出否则从输出项2输出的JS计算
      {
        type:'mybricks.normal-pc.muilt-inputJs:input',
        jsCode: '({outputs})=>{const num=Math.floor(Math.random()*100);if(num>50){outputs.output0(num)}else{outputs.output1(num)}}'
      };
      假设当前inputValue0的JSON Schema为{"type":"array","items":{"type":"number"}}
      问: 获取值大于60的结果的JS计算
      {
        type:'mybricks.normal-pc.muilt-inputJs:input',
        jsCode: '({outputs,inputs})=>{outputs.output0(inputs.inputValue0.filter(item=>item>60))}'
      };

      假设当前inputValue0的JSON Schema为${JSON.stringify(startPin.schema)}
    `
    // {"type":"array","items":{"type":"object","properties":{"isDiscount":"boolean","price":"number"}}}
  },
  '@create'(props) {
    console.log(props, 'props')
    const { def, data } = props
    
    if (def.jsCode) {
      data.fns = def.jsCode
    }
  }
}