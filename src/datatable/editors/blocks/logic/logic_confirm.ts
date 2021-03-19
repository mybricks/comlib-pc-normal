export default {
  name: 'xg.logic_confirm',
  title: '确认提示',
  data: {},
  render(renderer) {
    renderer.setStyle('logic_blocks')
    renderer.setOutput(true, 'Boolean')

    const confirm = renderer.appendValueInput("msg")
      .appendField("确认进行下一步提示，文案")

    const newValueBlock = renderer.workspace.newBlock('text')

    newValueBlock.setShadow(true);
    newValueBlock.initSvg();
    newValueBlock.render();

    confirm.connection.connect(newValueBlock.outputConnection)
  },
  to(type, block) {
    if (type === 'js') {
      // const val = Number(Blockly.JavaScript.valueToCode(block, 'number', Blockly.JavaScript.ORDER_NONE) || 0)
      // const order = val >= 0 ? Blockly.JavaScript.ORDER_ATOMIC : Blockly.JavaScript.ORDER_UNARY_NEGATION;
      const msg = Blockly.JavaScript.valueToCode(block, 'msg', Blockly.JavaScript.ORDER_NONE)
      console.log(msg, 'msg')

      return [`window.confirm(${msg})`, Blockly.JavaScript.ORDER_ATOMIC]
    }
  }
}
