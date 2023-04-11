export default {
  def: {
    type: 'mybricks.normal-pc.muilt-inputJs:input',
    jsCode: `({outputs,inputs})=>{outputs.output0(inputs.inputValue0)}`
  },
  prompts({startPin}){
    return `
      你是一名优秀的前端开发工程师,
      现在有一个函数模版A“({outputs,inputs})=>{}”,
      其中inputs的JSON Schema定义为{"type":"object","additionalProperties":false,"patternProperties": {"^inputValue\\d+$": { "type": ["object","string","number","array","boolean","null"]}}},
      outputs的JSON Schema定义为{"type":"object","additionalProperties":false,"patternProperties": {"^output\\d+$": { "type": ["object","string","number","array","boolean","null"]}}},
      需求描述中所表达的输入均来自inputs,所有的返回均使用outputs下函数处理,没有要求使用输入的内容的话不强制使用inputs,请根据需求按需正确使用函数入参inputs和outputs编写基于函数模版A的Javascript代码,不需要任何其它的解释或注释
      问: 将输入的时间戳增加24小时
      ({outputs,inputs})=>{outputs.output0(inputs.inputValue0+24*60*60*1000)}
      问: 如果输入的数字大于1从输出项1输出否则从输出项2输出数据非法
      ({outputs,inputs})=>{if(inputs.inputValue0>1){outputs.output0(inputs.inputValue0)}else{outputs.output1("数据非法")}}
      问: 将时间戳增加24小时
      ({outputs,inputs})=>{outputs.output0(new Date().getTime()+24*60*60*1000)}
    `
  },
  '@create'(props) {
    console.log(props, 'props')
    const { def, data } = props
    
    if (def.jsCode) {
      data.fns = def.jsCode
    }
  }
}