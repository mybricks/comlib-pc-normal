import { uuid } from '../../utils'
import { BLOCKS_KEY } from '../constants'

export default {
  name: 'xg.table_tag',
  title: '标签',
  data: {
    outputId: '',
    key: '',
    color: '',
    // visible: false,
    title: '标签'
  },
  render(renderer, data, { curFn }) {
    renderer.setColour('#2db7f5')

    if (!data.outputId && curFn.scratchOutputIds && curFn.scratchOutputIds.length > 0) {
      data.outputId = curFn.scratchOutputIds[0]
    }

    renderer.appendDummyInput().appendField('显示通用标签')

    // renderer.appendValueInput('title').setCheck('String').appendField('名称')
    const def = renderer.appendValueInput('title').setCheck('String').appendField('名称')

    const newValueBlock = renderer.workspace.newBlock('var_unknow')

    newValueBlock.setShadow(true);
    newValueBlock.initSvg();
    newValueBlock.render();

    def.connection.connect(newValueBlock.outputConnection)

    renderer.setPreviousStatement(true)
    renderer.setNextStatement(true)
  },
  editors: [
    // {
    //   title: '输出端口',
    //   type: 'Select',
    //   options ({ curFn }) {
    //     let idOptions = curFn.scratchOutputIds.map(id => {
    //       const pin = curFn.output.get(id)
    //       return { label: pin ? pin.title : id , value: id }
    //     })
    //     idOptions.unshift({ label: '无输出' , value: '' });

    //     idOptions = idOptions.length <= 0 ? [{ label: '无输出', value: ''}] : idOptions

    //     return idOptions
    //   },
    //   value: {
    //     get ({ data, curFn }) {
    //       return data.outputId
    //     },
    //     set ({ data }, value) {
    //       data.outputId = value
    //     }
    //   }
    // },
    {
      title: '预设颜色',
      type: 'Select',
      options: [
        { label: 'magenta', value: 'magenta' },
        { label: 'red', value: 'red' },
        { label: 'volcano', value: 'volcano' },
        { label: 'orange', value: 'orange' },
        { label: 'gold', value: 'gold' },
        { label: 'lime', value: 'lime' },
        { label: 'green', value: 'green' },
        { label: 'cyan', value: 'cyan' },
        { label: 'blue', value: 'blue' },
        { label: 'geekblue', value: 'geekblue' },
        { label: 'purple', value: 'purple' },
      ],
      value: {
        get ({ data }) {
          return data.color
        },
        set ({ data }, value) {
          data.color = value
        }
      }
    },
    // {
    //   title: '隐藏',
    //   type: 'Switch',
    //   value: {
    //     get ({ data }) {
    //       return data.visible
    //     },
    //     set ({ data }, value) {
    //       data.visible = value
    //     }
    //   }
    // },
  ],
  to(type, block, data, { curFn }) {
    if (type === 'js') {
      const title = Blockly.JavaScript.valueToCode(block, 'title', Blockly.JavaScript.ORDER_NONE) || "'标签'"

      return `${BLOCKS_KEY}.push({
        customType: 'tag',
        title: ${title},
        outputId: '${data.outputId}',
        key: '${uuid()}',
        color: '${data.color}'
      });`
    }
  }
}
