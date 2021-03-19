const DataTpt = {}

export default {
  name: 'xg.get_listitem',
  title: '获取列表指定位置数据',
  data: DataTpt,
  render(renderer) {
    renderer.setStyle('list_blocks');
    renderer.setInputsInline(true)
    renderer.setOutput(true, 'Any');

    renderer.appendValueInput('ary')
      .setCheck('Array')
      .appendField('获取列表')
    renderer.appendValueInput('index')
      .setCheck('Number')
      .appendField('中的第')
    renderer.appendDummyInput('emtpy')
      .appendField('项')
  },
  to(type, block) {
    if (type === 'js') {
      const ary = Blockly.JavaScript.valueToCode(block, 'ary', Blockly.JavaScript.ORDER_ADDITION) || []
      const index = Blockly.JavaScript.valueToCode(block, 'index', Blockly.JavaScript.ORDER_ADDITION)

      return [`${ary}[${index}]`, Blockly.JavaScript.ORDER_ATOMIC]
    }
  }
}