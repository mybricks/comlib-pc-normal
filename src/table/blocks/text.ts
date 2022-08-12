import { uuid } from '../../utils'
import { BLOCKS_KEY } from '../constants'

export default {
  name: 'xg.table_text',
  title: '文本',
  data: {
    color: '',
    outputId: ''
  },
  render(renderer, data, { curFn }) {
    renderer.setColour('#434343')

    renderer.appendDummyInput().appendField('显示文本')

    const def = renderer.appendValueInput('content').setCheck('String').appendField('内容')
    const newValueBlock = renderer.workspace.newBlock('var_unknow')

    newValueBlock.setShadow(true);
    newValueBlock.initSvg();
    newValueBlock.render();

    def.connection.connect(newValueBlock.outputConnection)

    renderer.setPreviousStatement(true)
    renderer.setNextStatement(true)
  },
  editors: [
    {
      title: '输出端口',
      type: 'Select',
      options ({ curFn }) {
        let idOptions = curFn.scratchOutputIds.map(id => {
          const pin = curFn.output.get(id)
          return { label: pin ? pin.title : id , value: id }
        })

        idOptions = idOptions.length <= 0 ? [{ label: '请先添加输出项', value: ''}] : idOptions

        return idOptions
      },
      value: {
        get ({ data, curFn }) {
          return data.outputId
        },
        set ({ data }, value) {
          data.outputId = value
        }
      }
    },
    {
      title: '颜色',
      type: 'Color',
      value: {
        get ({ data }) {
          return data.color
        },
        set ({ data }, value) {
          data.color = value
        }
      }
    }
  ],
  to(type, block, data, { curFn }) {
    if (type === 'js') {
      const content = Blockly.JavaScript.valueToCode(block, 'content', Blockly.JavaScript.ORDER_NONE) || "''"

      return `${BLOCKS_KEY}.push({
        customType: 'text',
        content: ${content},
        color: '${data.color}',
        key: '${uuid()}',
        outputId: '${data.outputId}'
      });`
    }
  }
}
