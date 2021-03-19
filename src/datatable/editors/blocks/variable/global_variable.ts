const DataTpt = {
  val: '',
  variable: 'envParam'
}

export default {
  name: 'xg.global_variable',
  title: '获取环境变量',
  data: DataTpt,
  render(renderer, data, {getCurVarAryOptions}) {
    renderer.setColour(30)
    renderer.setOutput(true, 'Object')
    const def = renderer.appendDummyInput('env')
      .appendField('获取环境变量')
    if (!renderer.isInFlyout) {
      def.appendField(new Blockly.FieldDropdown([
        ['环境参数', 'envParam'],
        ['当前环境', 'envType'],
        ['用户token', 'userToken']
      ], (env: string) => {
        data.variable = env
      }), 'method')
        .appendField(new Blockly.FieldTextInput(data.val, (val: string) => {
          data.val = val
        }), 'value')
    }

    function draw() {
      if (!renderer.isInFlyout) {
        const value = renderer.getInput('env')
        if (['envType','userToken'].includes(data.variable) && renderer.getField('value')) {
          value.removeField('value', false)
        } else if (!['envType','userToken'].includes(data.variable) && !renderer.getField('value')){
          value.appendField(new Blockly.FieldTextInput(data.val, (val: string) => {
            data.val = val
          }), 'value')
        }
      }
    }

    return draw
  },
  to(type, block, data, {logDebug, getEnvVarScript}) {
    if (type === 'js') {
      let resVal: any = ''
      
      if (data.variable === 'envParam') {
        resVal = getEnvVarScript(data.variable, data.val)
      } else if (data.variable === 'envType') {
        resVal = getEnvVarScript(data.variable)
      } else if (data.variable === 'userToken') {
        resVal = getEnvVarScript(data.variable)
      }
      // return [`${varName}${keyAry.join('')}`, Blockly.JavaScript.ORDER_ATOMIC]
      return [`${resVal}`, Blockly.JavaScript.ORDER_ATOMIC]
    }
  }
}