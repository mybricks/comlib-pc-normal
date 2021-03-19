const DataTpt = {
  val: ''
}

export default {
  name: 'xg.text',
  title: '字符',
  data: DataTpt,
  render(renderer, data) {
    renderer.setStyle('text_blocks')
    renderer.setOutput(true, 'String')
    renderer.appendDummyInput()
      .appendField('字符')
      .appendField(new Blockly.FieldTextInput(data.val, (val: string) => {
        data.val = val
      }), 'valve')

    // const numberInput = renderer
    //   .appendValueInput('string')
    //   .appendField('字符')
    //   .setCheck('String')

    // const newValueBlock = renderer.workspace.newBlock('text')

    // newValueBlock.setShadow(true);
    // newValueBlock.initSvg();
    // newValueBlock.render();

    // numberInput.connection.connect(newValueBlock.outputConnection)
  },
  to(type, block, data) {
    if (type === 'js') {

      return [`'${data.val}'`, Blockly.JavaScript.ORDER_ATOMIC]
    }
  }
}
