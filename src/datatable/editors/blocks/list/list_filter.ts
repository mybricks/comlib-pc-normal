const DataTpt = {}

export default {
  name: 'xg.list_filter',
  title: '列表过滤',
  data: DataTpt,
  render(renderer, data, {getCurVarAryOptions}) {
    renderer.setStyle('list_blocks');

    renderer.appendValueInput('ary')
      .setCheck('Array')
      .appendField('过滤列表')
    renderer.appendValueInput('item')
      .appendField('中的每一项')
    renderer.appendValueInput('judge')
      .setCheck('Boolean')
      .appendField('过滤条件')
    renderer.appendValueInput('resultValName')
      .appendField('赋值给')

    renderer.setPreviousStatement(true)
    renderer.setNextStatement(true)
    return () => {

    }
  },
  to(type, block, data, {logDebug}) {
    if (type === 'js') {
      const ary = Blockly.JavaScript.valueToCode(block, 'ary', Blockly.JavaScript.ORDER_ADDITION) || []
      const item = Blockly.JavaScript.valueToCode(block, 'item', Blockly.JavaScript.ORDER_ADDITION)
      const judge = Blockly.JavaScript.valueToCode(block, 'judge', Blockly.JavaScript.ORDER_ADDITION)
      const res = Blockly.JavaScript.valueToCode(block, 'resultValName', Blockly.JavaScript.ORDER_ADDITION)

      return `
        ${res} = ${ary}.filter(listfilteritem => {
          ${item} = listfilteritem
          return ${judge}
        })
      `
    }
  }
}