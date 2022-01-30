import { uuid } from '../util'

const DataTpt = {
  type: 'val'
}

export default {
  name: 'xg.list_map',
  title: '列表转换',
  data: DataTpt,
  render(renderer, data, {getCurVarAryOptions}) {
    renderer.setStyle('list_blocks');

    renderer.appendValueInput('ary')
      .setCheck('Array')
      .appendField('将列表')

    renderer.appendValueInput('item')
      .appendField('中的每一项')

    renderer.appendValueInput('index')
      .appendField('当前项下标')

    renderer.appendValueInput('action').appendField('返回')
    // renderer.appendStatementInput('action').appendField('执行')

    renderer.appendValueInput('resultValName')
      .appendField('赋值给')

    // renderer.setInputsInline(true)
    renderer.setPreviousStatement(true)
    renderer.setNextStatement(true)
    return () => {
      if (data.type === 'val') {
        renderer.removeInput('action')
        renderer.appendValueInput('action').appendField('返回')
        renderer.appendValueInput('resultValName').appendField('赋值给')
      } else {
        renderer.removeInput('action')
        renderer.removeInput('resultValName')
        renderer.appendStatementInput('action').appendField('执行')
      }
    }
  },
  editors: [{
    title: '类型',
    type: 'Select',
    options: [
      {value: 'val', label: '赋值'},
      {value: 'fn', label: '执行方法'}
    ],
    value: {
      get({data}) {
        return data.type
      },
      set({data}, value) {
        data.type = value
      }
    }
  }],
  to(type, block, data, {logDebug}) {
    if (type === 'js') {
      const ary = Blockly.JavaScript.valueToCode(block, 'ary', Blockly.JavaScript.ORDER_ADDITION) || '[]'
      const item = Blockly.JavaScript.valueToCode(block, 'item', Blockly.JavaScript.ORDER_ADDITION) || uuid()
      const index = Blockly.JavaScript.valueToCode(block, 'index', Blockly.JavaScript.ORDER_ADDITION) || uuid()
      const res = Blockly.JavaScript.valueToCode(block, 'resultValName', Blockly.JavaScript.ORDER_ADDITION) || uuid()
      const action = (!data.type || data.type === 'val') ? 
        Blockly.JavaScript.valueToCode(block, 'action', Blockly.JavaScript.ORDER_ADDITION) : 
        Blockly.JavaScript.statementToCode(block, 'action', Blockly.JavaScript.ORDER_ADDITION)
      // const action = Blockly.JavaScript.statementToCode(block, 'action', Blockly.JavaScript.ORDER_ADDITION)

      // if (!data.type || data.type === 'val') {
      //   return `
      //     ${res} = ${ary}.map((blokly_list_map_item, blokly_list_map_index) => {
      //       ${item} = blokly_list_map_item
      //       ${index} = blokly_list_map_index
      //       return ${action.trim()}
      //     })
      //   `
      // } else {
      //   return `
      //     ${ary}.map((blokly_list_map_item, blokly_list_map_index) => {
      //       ${item} = blokly_list_map_item
      //       ${index} = blokly_list_map_index
      //       ${action}
      //     })
      //   `
      // }
      if (!data.type || data.type === 'val') {
        return `
          try {
            ${res} = ${ary}.map((blokly_list_map_item, blokly_list_map_index) => {
              try {
                ${item} = blokly_list_map_item
              } catch {}
              try {
                ${index} = blokly_list_map_index
              } catch {}
              return ${action.trim()}
            })
          } catch {}
        `
      } else {
        return `
          try {
            ${ary}.map((blokly_list_map_item, blokly_list_map_index) => {
              try {
                ${item} = blokly_list_map_item
              } catch {}
              try {
                ${index} = blokly_list_map_index
              } catch {}
              ${action}
            })
          } catch {}
        `
      }
    }
  }
}