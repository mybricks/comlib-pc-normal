export default {
  name: 'xg.fetch',
  title: '请求接口',
  data: {
    reqMethod: 'GET',
    reqPath: null,
    params: '',
    headers: {},
    fetchFn: null,
    responseFn: null,
    responseValidate: null
  },
  render(renderer, data, {getCurVarAry}: any) {
    renderer.setInputsInline(true)
    renderer.setColour(120)
    const def = renderer.appendDummyInput()
      .appendField('请求接口')
    if (!renderer.isInFlyout) {
      def.appendField(', 结果存储在')
        .appendField(new Blockly.FieldVariable('response'), 'varName')
    }

    renderer.appendStatementInput('success').appendField('执行')
    //this.appendStatementInput('error').appendField('失败')
    renderer.setPreviousStatement(true)
    renderer.setNextStatement(true)
  },
  /**
   * 编辑器
   */
  editors: [
    {
      title: '请求方法',
      type: 'radio',
      options: [
        {value: 'GET', label: 'GET'},
        {value: 'POST', label: 'POST'}
      ],
      value: {
        get({data}) {
          return data.reqMethod || 'GET'
        }, set({data}, t) {
          data.reqMethod = t
        }
      }
    },
    {
      title: '地址',
      type: 'textarea',
      value: {
        get({data}) {
          return data.reqPath
        }, set({data}, t) {
          data.reqPath = t
        }
      }
    },
    {
      title: '参数(JSON)',
      type: 'textarea',
      value: {
        get({data}: any) {
          return data.params
        },
        set({data}: any, val: string) {
          if (val.trim() !== '') {
            try {
              JSON.parse(val)
              data.params = val
            } catch (ex) {
              throw ex
            }
          }else{
            data.params = ''
          }
        }
      }
    },
  ],
  to(type, block, data, {logDebug, getEnvVarScript}) {
    if (type === 'js') {
      const varName = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('varName'), Blockly.Variables.NAME_TYPE);
      if (varName) {
        const successCode = Blockly.JavaScript.statementToCode(block, 'success')
        const params: any = data.params && JSON.parse(data.params) || {}

        const res: any = []
        Object.keys(params).forEach(item => {
          let value = params[item]
          if (value.match(/^\{.+\}$/gi)) {
            let bool = value.match(/\((.*)\)/gi) ? true : false
            let varName = value.substring(1, value.length - 1)
            let varNameKey = varName.match(/\((.+?)\)/gi)
            varName = varName.replace(/\(.*\)/gi, '')

            let varVal = varName

            if (varNameKey) {
              varNameKey = varNameKey[0].substring(1, varNameKey[0].length - 1)
              varVal = getEnvVarScript(varName, varNameKey)
            } else if (bool) {
              varVal = getEnvVarScript(varName, item)
            }

            res.push(`'${item}':${varVal}`)
          } else {
            res.push(`'${item}':'${value}'`)
          }
        })
        const reqMethod = data.reqMethod
        const reqPath = data.reqPath

        return `
              var params = {${res.join(',')}}
              var headers = {
                'Content-Type': 'application/json',
                //'token': _envVars_.getUserToken()
              }
              
              ${logDebug}(params)
              ${logDebug}(headers)
              
              fetch('${reqPath}',{
                url: '${reqPath}',
                method: '${reqMethod}',
                data: params,
                headers: headers,
              })
              .then(res => res.json())
              .then(function (json) {
                ${varName}=json;
                ${successCode}
              }).catch(function (error) {
                console.error(error)
                throw error
              })
              `
      }
      return ``
    }
  }
}