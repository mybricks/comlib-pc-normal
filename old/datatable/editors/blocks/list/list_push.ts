const DataTpt = {
  type: 'push'
}

export default {
  name: 'xg.list_push',
  title: '列表首尾添加数据',
  data: DataTpt,
  render(renderer, data) {
    renderer.setStyle('list_blocks');

    renderer.appendValueInput('ary')
      .setCheck('Array')
      .appendField('列表')
    renderer.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([
        ['尾部添加', 'push'],
        ['头部添加', 'unshift']
      ], (type: string) => {
        data.type = type
      }), 'type')
    renderer.appendValueInput('value')

    renderer.setPreviousStatement(true)
    renderer.setNextStatement(true)
  },
  to(type, block, data) {
    if (type === 'js') {
      const ary = Blockly.JavaScript.valueToCode(block, 'ary', Blockly.JavaScript.ORDER_ADDITION) || []
      const value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ADDITION) || undefined

      return `
        ${ary}.${data.type}(${value})
      `
    }
  }
}