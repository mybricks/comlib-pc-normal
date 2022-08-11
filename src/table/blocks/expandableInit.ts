export default {
  name: 'table.expandable_init',
  title: '行展开内容',
  root: true,
  data: {},
  render (renderer, data) {
    renderer.setColour('#fa6400')
    renderer.setInputsInline(true)
    renderer.appendDummyInput()
      .appendField(`行展开内容`)
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