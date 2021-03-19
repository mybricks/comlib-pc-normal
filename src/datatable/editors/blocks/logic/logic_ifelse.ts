import { uuid } from '../util'
const DataTpt = {
  logicAry: []
}
let logicMap: any = {}
let logicUuid: any = []

export default {
  name: 'xg.logic_ifelse',
  title: '逻辑判断',
  data: DataTpt,
  render(renderer, data) {
    renderer.setStyle('logic_blocks')
    renderer.appendValueInput("iftxt")
      .setCheck('Boolean')
      .appendField("如果")
    renderer.appendStatementInput('iffn').appendField('执行')
    renderer.setInputsInline(false)
    renderer.setPreviousStatement(true, null)
    renderer.setNextStatement(true, null)

    function draw() {
      let stop = false

      if (data.logicAry) {
        data.logicAry.forEach((key: string, idx: number) => {
          if (stop) return
          const id = logicUuid[idx]
          const i = logicMap[id]

          if (key === 'elseif') {
            const valueInput = renderer.appendValueInput(`${key}${idx}txt`)
              .setCheck("Boolean")
              .appendField("否则如果")
            const statementInput = renderer.appendStatementInput(`${key}${idx}fn`).appendField('执行')

            if (i && i.length) {
              valueInput.connection.connect(i[0])
              statementInput.connection.connect(i[1])
            }
          }
          if (key === 'else') {
            const statementInput = renderer.appendStatementInput(`${key}${idx}fn`).appendField('否则')

            if (i && i.length) {
              statementInput.connection.concat(i)
            }

            stop = true
          }
        })
      }
    }

    draw()

    return () => {
      logicMap = {}
      logicUuid = []
      const inputList = renderer.inputList
      if (inputList) {
        data.logicAry.forEach((key, idx) => {
          let id = uuid()
          logicUuid.push(id)
          if (key === 'elseif') {
            logicMap[id] = []
            if (renderer.getInput(`${key}${idx}txt`)) {
              logicMap[id][0] = renderer.getInput(`${key}${idx}txt`).connection.targetConnection
            }
            if (renderer.getInput(`${key}${idx}fn`)) {
              logicMap[id][1] = renderer.getInput(`${key}${idx}fn`).connection.targetConnection
            }
          }
          if (key === 'else') {
            if (renderer.getInput(`${key}${idx}fn`)) {
              logicMap[id] && (logicMap[id][0] = renderer.getInput(`${key}${idx}fn`).connection.targetConnection)
            }
          }
        })
        const names = inputList.map((input, idx) => {
          if (idx > 1) {
            return input.name
          }
        }).filter(name => name)
        names.forEach(name => {
          renderer.removeInput(name)
        })
      }

      draw()
    }
  },
  /**
   * 编辑器
   */
  editors: [{
    title: '后续逻辑',
    type: 'list',
    options: {
      type: 'select',
      group: [{
        label: '否则如果',
        value: 'elseif'
      }, {
        label: '否则',
        value: 'else'
      }]
    },
    value: {
      get({data}: any) {
        return data.logicAry
      },
      set({data}: any, val: any) {
        data.logicAry = val
      }
    }
  }],
  to(type, block, data, {logDebug}) {
    if (type === 'js') {
      let str = ''
      const ifTxtCode = Blockly.JavaScript.valueToCode(block, 'iftxt', Blockly.JavaScript.ORDER_ADDITION)
      const ifFnCode = Blockly.JavaScript.statementToCode(block, 'iffn', Blockly.JavaScript.ORDER_ADDITION)

      if (ifTxtCode) {
        str += `if (${ifTxtCode}) {
          ${ifFnCode ? ifFnCode : ''}
        }`
      }

      data.logicAry.forEach((key: string, idx: number) => {
        const fnCode = Blockly.JavaScript.statementToCode(block, `${key}${idx}fn`, Blockly.JavaScript.ORDER_ADDITION) || ''
        if (key === 'elseif') {
          const txtCode = Blockly.JavaScript.valueToCode(block, `${key}${idx}txt`, Blockly.JavaScript.ORDER_ADDITION)

          if (txtCode) {
            str += `else if (${txtCode}) {
              ${fnCode}
            }`
          }


        } else {
          if (fnCode && fnCode.length && str && str.length) {
            str += `else {
              ${fnCode}
            }`
          }
        }
      }, [])

      return str
    }
  }
}
