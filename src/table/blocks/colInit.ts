export default {
  name: 'table.col_init',
  title: '列初始化',
  root: true,
  data: {},
  render (renderer, data) {
    renderer.setColour('#fa6400')
    renderer.setInputsInline(true)
    renderer.appendDummyInput()
      .appendField(`列初始化`)
    renderer.appendStatementInput('Body')
  },
  to (type, block, data, {curFn}) {
    if (type === 'js') {
      const body = Blockly.JavaScript.statementToCode(block, 'Body', Blockly.JavaScript.ORDER_NONE)
      return `
        ${body}
      `
    }
  }
}