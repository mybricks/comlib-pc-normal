export default {
  name: 'xg.debugger',
  title: 'debugger',
  data: {},
  render(renderer) {
    renderer.setColour(120)
    renderer.appendDummyInput()
      .appendField('debugger')

    renderer.setPreviousStatement(true)
    renderer.setNextStatement(true)
  },
  to(type, block) {
    if (type === 'js') {
      return `
        debugger
      `
    }
  }
}
