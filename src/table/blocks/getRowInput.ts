export default {
  name: 'xg.get_row_input',
  title: '获取行数据',
  data: {},
  render (renderer, data) {
    if (renderer.isInFlyout) {
      renderer.renderIsInProgress_ = true
    } else {
      renderer.setColour('#fa6400')
      const def = renderer.appendValueInput('val').setCheck('Object').appendField('获取输入')
      def.appendField(new Blockly.FieldDropdown(
        [['行数据', 'record'], ['行数', 'index']],
        (key: string) => { data.key = key }), 'key')
      renderer.setOutput(true)
    }
  },
  to (type, block, data) {
    if (type === 'js') {
      let val = Blockly.JavaScript.valueToCode(block, 'val', Blockly.JavaScript.ORDER_NONE)
      if (/^(?:'')/.test(val)) {
        val = ''
      }
      const key = data.key
      return [val ? `${val}['${key}']` : '', Blockly.JavaScript.ORDER_ATOMIC]
    }
  }
}
