import { uuid } from '../../utils'
import { BLOCKS_KEY } from '../constants'

export default {
  name: 'xg.table_arrow',
  title: '趋势箭头',
  data: {
    key: '',
    type: 'rise'
  },
  render(renderer, data, { curFn }) {
    renderer.setColour('#2db7f5')

    if (!data.outputId && curFn.scratchOutputIds && curFn.scratchOutputIds.length > 0) {
      data.outputId = curFn.scratchOutputIds[0]
    }

    renderer.appendDummyInput().appendField('显示趋势箭头')

    renderer.setPreviousStatement(true)
    renderer.setNextStatement(true)
  },
  editors: [
    {
      title: '类型',
      type: 'Select',
      options: [
        { label: '上升', value: 'rise' },
        { label: '下降', value: 'fall' }
      ],
      value: {
        get ({ data }) {
          return data.type
        },
        set ({ data }, value) {
          data.type = value
        }
      }
    },
  ],
  to(type, block, data, { curFn }) {
    if (type === 'js') {
      // const title = Blockly.JavaScript.valueToCode(block, 'title', Blockly.JavaScript.ORDER_NONE) || "'标签'"

      return `${BLOCKS_KEY}.push({
        customType: 'arrow',
        key: '${uuid()}',
        type: '${data.type}'
      });`
    }
  }
}
