const unknownType = ['unknown', 'enum', 'tuple', 'indexObject', 'follow']
const anyType = ['object', 'string', 'number', 'array', 'boolean', 'null']

function getCodeTemplate ({useInputs}) {
  return `({outputs${useInputs ? ',inputs' : ''}})=>{}`
}

export default {
  ':root'(props) {
    const {
      input,
      output,
      inputs,
      outputs
    } = props
    const inputSchemaArray = input.get().map(({id}) => {
      const schema = inputs.get(id).schema
      return {
        id: id.split('.')[1],
        schema: JSON.stringify(unknownType.includes(schema.type) ? {type: anyType} : schema)
      }
    })
    const outputSchemaArray = output.get().map(({id}) => {
      const schema = outputs.get(id).schema
      return {
        id,
        schema: JSON.stringify(unknownType.includes(schema.type) ? {type: anyType} : schema)
      }
    })
    const useInputs = !!inputSchemaArray.length

    let inputsSchemaStr = ''
    let outputsSchemaStr = 'outputs含有以下几个输出方法,'

    if (useInputs) {
      inputSchemaArray.forEach(({id, schema}) => {
        inputsSchemaStr = (inputsSchemaStr ? ',' : '') + `"${id}":${schema}`
      })
      inputsSchemaStr = `inputs的JSON Schema定义为{"type":"object","additionalProperties":false,"properties":{${inputsSchemaStr}}},`
    }

    outputSchemaArray.forEach(({id, schema}) => {
      outputsSchemaStr = outputsSchemaStr + `${id}函数输出的值的JSON Schema定义为${schema},`
    })

    return {
      prompts: `
      你是一名优秀的前端开发工程师,
      现在有一个函数模版A“${getCodeTemplate({useInputs})}”,
      需要你根据问题基于函数模版A编写Javascript代码,问题中提到的各种数据如果没有明确表达来自输入时需要你来mock数据,否则需要严格参照JSON Schema定义,回答不需要任何其它的解释或注释,以下是例子:

      outputs含有以下几个输出方法,output0函数输出的值的JSON Schema定义为{"type":"number"},
      请回答：将时间戳增加24小时
      ({outputs})=>{const time=new Date().getTime();outputs.output0(time+24*60*60*1000)}
  
      inputs的JSON Schema定义为{"type":"object","additionalProperties":false,"properties":{"inputValue0":{"type":"array","items":{"type":"object","properties":{"score":{"type":"number"}}}}}},outputs含有以下几个输出方法,output0函数输出的值的JSON Schema定义为{"type":"array","items":{"type":"object","properties":{"score":{"type":"number"}}}},
      请回答：从列表中获取成绩大于等于60的学生
      ({outputs})=>{const list=[{score:1},{score:60},{score:99}];outputs.output0(list.filter(item=>item.score>=60))}

      inputs的JSON Schema定义为{"type":"object","additionalProperties":false,"properties":{"inputValue0":{"type":"number"}}},outputs含有以下几个输出方法,output0函数输出的值的JSON Schema定义为{"type":"number"},
      请回答：将输入的时间戳增加24小时
      ({outputs,inputs})=>{outputs.output0(inputs.inputValue0+24*60*60*1000)}

      inputs的JSON Schema定义为{"type":"object","additionalProperties":false,"properties":{"inputValue0":{"type":"number"}}},outputs含有以下几个输出方法,output0函数输出的值的JSON Schema定义为{"type":"number"},output1函数输出的值的JSON Schema定义为{"type":"number"},
      请回答：如果输入的数字大于1从输出项1输出否则从输出项2输出
      ({outputs,inputs})=>{if(inputs.inputValue0>1){outputs.output0(inputs.inputValue0)}else{outputs.output1(inputs.inputValue0)}}
      
      ${inputsSchemaStr}${outputsSchemaStr}如果提问中没有说明数据来自输入(输入项、inputs)时需要生成符合要求的mock数据,否则不允许出现mock数据且必须严格按照inputs的JSON Schema以及outputs下各函数的JSON Schema定义来实现,回答代码即可不允许出现任何解释或注释`,
      execute(props) {
        const { data, newData } = props
        if (typeof newData === 'function') {
          data.fns = newData.toString()
          console.log('生成可执行代码: ', data.fns)
        } else {
          console.log('生成代码错误: ', newData)
        }
      }
    }

    // return {
    //   prompts: `
    //   你是一名优秀的前端开发工程师,
    //   现在有一个函数模版A“${getCodeTemplate({useInputs})}”,
    //   功能描述中所表达的输入均来自inputs,所有的返回均使用outputs下函数处理,如果功能描述中没有强调数据来自输入,就不要使用inputs下的数据,请根据功能描述按需正确使用函数入参inputs和outputs编写基于函数模版A的Javascript代码,inputs以及outputs需要严格按照给定的JSON Schema定义来使用,不需要任何其它的解释或注释,以下是例子:
      
    //   inputs的JSON Schema定义为{"type":"object","additionalProperties":false,"properties":{"inputValue0":{"type":"number"}}},outputs含有以下几个输出方法,output0函数输出的值的JSON Schema定义为{"type":"number"},
    //   请回答：将输入的时间戳增加24小时
    //   ({outputs,inputs})=>{outputs.output0(inputs.inputValue0+24*60*60*1000)}
  
    //   inputs的JSON Schema定义为{"type":"object","additionalProperties":false,"properties":{"inputValue0":{"type":"number"}}},outputs含有以下几个输出方法,output0函数输出的值的JSON Schema定义为{"type":"number"},output1函数输出的值的JSON Schema定义为{"type":"number"},
    //   请回答：如果输入的数字大于1从输出项1输出否则从输出项2输出
    //   ({outputs,inputs})=>{if(inputs.inputValue0>1){outputs.output0(inputs.inputValue0)}else{outputs.output1(inputs.inputValue0)}}
  
    //   outputs含有以下几个输出方法,output0函数输出的值的JSON Schema定义为{"type":"number"},
    //   请回答：将时间戳增加24小时
    //   ({outputs})=>{outputs.output0(new Date().getTime()+24*60*60*1000)}
  
    //   inputs的JSON Schema定义为{"type":"object","additionalProperties":false,"properties":{"inputValue0":{"type":"array","items":{"type":"object","properties":{"score":{"type":"number"}}}}}},outputs含有以下几个输出方法,output0函数输出的值的JSON Schema定义为{"type":"array","items":{"type":"object","properties":{"score":{"type":"number"}}}},
    //   请回答：从列表中获取成绩大于等于60的学生
    //   ({outputs,inputs})=>{outputs.output0(inputs.inputValue0.filter(item=>item.score>=60))}
      
    //   ${inputsSchemaStr}${outputsSchemaStr}`,
    //   execute(props) {
    //     console.log('execute: ', props)
    //     const { data, newData } = props
    //     data.fns = newData.toString()
    //     console.log('data.fns: ', data.fns)
    //   }
    // }
  },
}

/**
 * 生成0-10的随机数，如果大于5从输出项1输出，否则从输出项2输出
 * +10输出
 * 将输入+10输出
 * 返回一个商品信息
 * 商品信息，包含商品名称、价格以及描述
 * 从商品列表中获取所有折扣商品，按价格从低到高排序，取前3个商品
 * 从今天上班的工人列表中找出工作时间最长的工人
 * 从今天上班的老师中找出年龄最大的5个
 * 返回商品信息
 * 如果输入的商品是折扣商品，输出折扣价格否则输出正常价格
 */
