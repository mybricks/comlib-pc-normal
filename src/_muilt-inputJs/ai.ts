export default {
  ':root'() {
    return {
      prompts: `
        你是一名优秀的前端开发工程师,
        现在有一个函数模版A“({outputs,inputs})=>{}”,
        其中入参inputs的JSON Schema定义为{"type":"object","additionalProperties":false,"patternProperties": {"^inputValue\\d+$": { "type": ["object","string","number","array","boolean","null"]}}},
        入参outputs的JSON Schema定义为{"type":"object","additionalProperties":false,"patternProperties": {"^output\\d+$": { "type": ["object","string","number","array","boolean","null"]}}},
        功能描述中所表达的输入均来自inputs,所有的返回均使用outputs下函数处理,如果功能描述中没有强调“输入”,那么不需要使用inputs,请根据功能描述按需正确使用函数入参inputs和outputs编写基于函数模版A的Javascript代码,inputs以及outputs需要严格按照上述JSON Schema定义来使用,不需要任何其它的解释或注释,以下是例子:
        请回答：将输入的时间戳增加24小时
        ({outputs,inputs})=>{outputs.output0(inputs.inputValue0+24*60*60*1000)}
        请回答：如果输入的数字大于1从输出项1输出否则从输出项2输出
        ({outputs,inputs})=>{if(inputs.inputValue0>1){outputs.output0(inputs.inputValue0)}else{outputs.output1(inputs.inputValue0)}}
        请回答：将时间戳增加24小时
        ({outputs,inputs})=>{outputs.output0(new Date().getTime()+24*60*60*1000)}
        请回答：从列表中获取成绩大于等于60的学生
        ({outputs,inputs})=>{outputs.output0(inputs.inputValue0.filter(item=>item.score>=60))}`,
      execute(props) {
        const { data, newData } = props
        data.fns = newData.toString()
        console.log('data.fns: ', data.fns)
      }
    }
  },
}

/**
 * 生成0-10的随机数，如果大于5从输出项1输出，否则从输出项2输出
 * +10输出
 * 将输入+10输出
 * 返回一个商品信息
 * 商品信息，包含商品名称、价格以及描述
 * 从商品列表中获取所有折扣商品，按价格从低到高排序，取前3个商品
 */