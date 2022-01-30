const DataTpt = {
  type: 'Array'
}

export default {
  name: 'xg.logic_includes',
  title: '包含',
  data: DataTpt,
  render(renderer, data) {
    renderer.setStyle('logic_blocks')
    renderer.setOutput(true, 'Boolean')
    renderer.setInputsInline(true)

    renderer.appendValueInput('judged').setCheck(['Array', 'String']).appendField('列表或文字')
    renderer.appendValueInput('val').appendField('中包含')
  },
  to(type, block) {
    if (type === 'js') {
      const judged = Blockly.JavaScript.valueToCode(block, 'judged', Blockly.JavaScript.ORDER_NONE) || '[]'
      const val = Blockly.JavaScript.valueToCode(block, 'val', Blockly.JavaScript.ORDER_NONE) || '[]'

      return [`${judged}.includes(${val})`, Blockly.JavaScript.ORDER_ATOMIC]
    }
  }
}
