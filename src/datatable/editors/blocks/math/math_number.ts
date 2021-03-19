export default {
  name: 'xg.math_number',
  title: '数字',
  data: {},
  render(renderer) {
    renderer.setStyle('math_blocks')
    renderer.setOutput(true, 'Number')
    const numberInput = renderer.appendValueInput('number').appendField('数字').setCheck('Number')
    const newValueBlock = renderer.workspace.newBlock('math_number')

    newValueBlock.setShadow(true);
    newValueBlock.initSvg();
    newValueBlock.render();

    numberInput.connection.connect(newValueBlock.outputConnection)
  },
  to(type, block) {
    if (type === 'js') {
      const val = Number(Blockly.JavaScript.valueToCode(block, 'number', Blockly.JavaScript.ORDER_NONE) || 0)
      const order = val >= 0 ? Blockly.JavaScript.ORDER_ATOMIC : Blockly.JavaScript.ORDER_UNARY_NEGATION;

      return [val, order];
    }
  }
}
