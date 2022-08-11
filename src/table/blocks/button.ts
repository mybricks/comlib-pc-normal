import { uuid } from '../../utils'
import { BLOCKS_KEY } from '../constants'

export default {
  name: 'xg.button',
  title: '按钮',
  data: {
    outputId: '',
    key: '',
    type: '',
    size: '',
    title: '按钮',
    disabled: false,
    danger: false
  },
  render(renderer, data, { curFn }) {
    renderer.setColour('#fa6400')

    if (!data.outputId && curFn.scratchOutputIds && curFn.scratchOutputIds.length > 0) {
      data.outputId = curFn.scratchOutputIds[0]
    }

    renderer.appendDummyInput().appendField('显示通用按钮')

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
      title: '尺寸',
      type: 'Select',
      options: [
        { label: '大', value: 'large' },
        { label: '中', value: 'default' },
        { label: '小', value: 'small' }
      ],
      value: {
        get ({ data }) {
          return data.size || 'default'
        },
        set ({ data }, value) {
          data.size = value
        }
      }
    },
    {
      title: '类型',
      type: 'Select',
      options: [
        { label: '主按钮', value: 'primary' },
        { label: '次按钮', value: '' },
        { label: '虚线按钮', value: 'dashed' },
        { label: '文本按钮', value: 'text' },
        { label: '链接按钮', value: 'link' }
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
    {
      title: '禁用',
      type: 'Switch',
      value: {
        get ({ data }) {
          return data.disabled
        },
        set ({ data }, value) {
          data.disabled = value
        }
      }
    },
    {
      title: '危险按钮',
      type: 'Switch',
      value: {
        get ({ data }) {
          return data.danger
        },
        set ({ data }, value) {
          data.danger = value
        }
      }
    }
  ],
  to(type, block, data, { curFn }) {
    if (type === 'js') {
      const title = Blockly.JavaScript.valueToCode(block, 'title', Blockly.JavaScript.ORDER_NONE) || "'按钮'"

      return `${BLOCKS_KEY}.push({
        customType: 'button',
        title: ${title},
        type: '${data.type}',
        outputId: '${data.outputId}',
        key: '${uuid()}',
        size: '${data.size}',
        disabled: ${data.disabled},
        danger: ${data.danger}
      });`
    }
  }
}
