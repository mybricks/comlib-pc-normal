export default function (output) {
  return [gen(output)]
}

function gen(output: { id, title }) {
  return {
    name: `xg.coms.mab.table.setDS`,
    title: '输出到表格',
    data: {},
    render(renderer, data, {curFn, getOutputAry}) {
      renderer.setColour(70)
      renderer.appendValueInput('rtn')
        .appendField(`设置`)

      renderer.appendDummyInput()
        .appendField(`为表格数据源`)

      renderer.setPreviousStatement(true)
      renderer.setNextStatement(true)

      renderer.inputsInline = true
    },
    to(type, block, data, {logDebug}) {
      if (type === 'js') {
        const rtn = Blockly.JavaScript.valueToCode(block, 'rtn', Blockly.JavaScript.ORDER_NONE)
        const outHostId = output.id
        return `
          ${logDebug}(${rtn})
 
          if(typeof ${outHostId} ==='function'){
            ${outHostId}(${rtn});
          }
        `
      }
    }
  }
}
