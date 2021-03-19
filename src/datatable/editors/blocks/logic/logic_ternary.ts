export default {
  name: 'xg.logic_ternary',
  title: '三元运算',
  data: {},
  render(renderer) {
    renderer.setStyle('logic_blocks')
    renderer.setOutput(true)
    renderer.setInputsInline(true)

    renderer.appendValueInput('IF').setCheck('Boolean').appendField('如果')
    renderer.appendValueInput('THEN').appendField('则')
    renderer.appendValueInput('ELSE').appendField('否则')


    // const numberInput = renderer.appendValueInput('number').appendField('数字').setCheck('Number')
    // const newValueBlock = renderer.workspace.newBlock('math_number')

    // newValueBlock.setShadow(true);
    // newValueBlock.initSvg();
    // newValueBlock.render();

    // numberInput.connection.connect(newValueBlock.outputConnection)
  },
  to(type, block) {
    if (type === 'js') {
      const value_if = Blockly.JavaScript.valueToCode(block, 'IF', Blockly.JavaScript.ORDER_CONDITIONAL) || 'false'
      const value_then = Blockly.JavaScript.valueToCode(block, 'THEN', Blockly.JavaScript.ORDER_CONDITIONAL) || 'null'
      const value_else = Blockly.JavaScript.valueToCode(block, 'ELSE', Blockly.JavaScript.ORDER_CONDITIONAL) || 'null'
      const code = value_if + ' ? ' + value_then + ' : ' + value_else
      return [code, Blockly.JavaScript.ORDER_CONDITIONAL]
    }
  }
}
