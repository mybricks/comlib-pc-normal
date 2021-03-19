const DataTpt = {}

export default {
  name: 'xg.delete_object_value',
  title: '删除对象值',
  data: DataTpt,
  render(renderer) {
    renderer.setColour(30)
    renderer.setInputsInline(true)

    renderer.appendValueInput('obj')
      .setCheck('Object')
      .appendField('删除对象')
    renderer.appendValueInput('key')
      .appendField('的属性')

    renderer.setPreviousStatement(true)
    renderer.setNextStatement(true)
  },
  to(type, block) {
    if (type === 'js') {
      const obj = Blockly.JavaScript.valueToCode(block, 'obj', Blockly.JavaScript.ORDER_ADDITION) || {}
      const key = Blockly.JavaScript.valueToCode(block, 'key', Blockly.JavaScript.ORDER_ADDITION)

      // return [`delete ${obj}[${key}]`, Blockly.JavaScript.ORDER_ATOMIC]
      return `
        try {
          delete ${obj}[${key}]
        } catch {}
      `
    }
  }
}
