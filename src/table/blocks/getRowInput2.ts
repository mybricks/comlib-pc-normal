import { COLUMN_DATA_KEY } from '../constants'

export default {
  name: 'xg.get_row_input_2',
  title: '获取行数据',
  data: {
    key: 'record',
    dataIndex: ''
  },
  render(renderer, data, { curFn }) {
    const columns =  curFn.columns.map(column => {
      return [`${column.title} - ${column.dataIndex}`, column.dataIndex]
    })
    renderer.setColour('#fa6400')
    const def = renderer.appendDummyInput('val').appendField('获取')
    renderer.setOutput(true)

    def.appendField(new Blockly.FieldDropdown(
      [['行数据', 'record'], ['行数', 'index']],
      (key: string) => { data.key = key }), 'key')
    .appendField(new Blockly.FieldDropdown(
      columns,
      (dataIndex: string) => { data.dataIndex = dataIndex }), 'dataIndex')
    

    function draw() {
      if (!renderer.isInFlyout) {
        const value = renderer.getInput('val')
        if (data.key === 'record') {
          if (!renderer.getField('dataIndex')) {
            value.appendField(new Blockly.FieldDropdown(
              columns,
              (dataIndex: string) => { data.dataIndex = dataIndex }), 'dataIndex')
          }
         
        } else {
          value.removeField('dataIndex')
        }
      }
    }

    return draw
  },
  to(type, block, data) {
    if (type === 'js') {
      // let val = Blockly.JavaScript.valueToCode(block, 'val', Blockly.JavaScript.ORDER_NONE)
      // if (/^(?:'')/.test(val)) {
      //   val = ''
      // }
      let val = ''
      const key = data.key
      if (key === 'record' && data.dataIndex) {
        val = `${COLUMN_DATA_KEY}['record']['${data.dataIndex}']`
      } else {
        val = `${COLUMN_DATA_KEY}['index']`
      }
      // console.log(data, val)
      return [val, Blockly.JavaScript.ORDER_ATOMIC]
    }
  }
}
