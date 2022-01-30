const DataTpt = {}

export default {
  name: 'xg.traverse_object',
  title: '遍历对象返回数组',
  data: DataTpt,
  render(renderer, data) {
    renderer.setStyle('list_blocks')

    renderer.appendValueInput('ary')
      .setCheck('Object')
      .appendField('获取对象字段数组')

    // renderer.appendDummyInput().appendField('获取字段数组')

    renderer.setOutput(true, 'Array')
  },
  to(type, block, data) {
    if (type === 'js') {
      const ary = Blockly.JavaScript.valueToCode(block, 'ary', Blockly.JavaScript.ORDER_ADDITION) || []
      // const value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ADDITION) || undefined
      return [`
        Object.keys(${ary})
      `, Blockly.JavaScript.ORDER_ATOMIC]
    }
  }
}