// const DataTpt = {
//   keyAry: ['name']
// }
let oldAry: any[] = ['name']

export default {
  name: 'xg.def_object',
  title: '定义对象',
  data: {keyAry: ['name']},
  render(renderer, data) {
    renderer.setColour(30)
    renderer.appendDummyInput('title').appendField('对象')
    renderer.setOutput(true, 'Object')

    // function exit(key: string) {
    //   const inputList = renderer.inputList
    //   if (inputList) {
    //     return inputList.find((input: any) => {
    //       return input.name === key
    //     })
    //   }
    // }

    function draw(init = false) {
      const count: number = data.keyAry.filter((item: string) => {
        return item.length
      }).length
      if (count === 0) {
        if (renderer.getInput('title')) {
          renderer.removeInput('title')
        }
        renderer.appendDummyInput('title').appendField('空对象')
      } else if (count === 1 && oldAry.length === 0) {
        if (renderer.getInput('title')) {
          renderer.removeInput('title')
        }
        renderer.appendDummyInput('title').appendField('对象')
      }

      if (data.keyAry && data.keyAry.length) {
        data.keyAry.forEach((key: string, idx: number) => {
          if ((key !== '' && !oldAry.includes(key)) || init) {
            const valueInput = renderer.appendValueInput(key)
            // .appendField(new Blockly.FieldTextInput(key, (val: string) => {
              //   data.keyAry[idx] = val
              // }), `${key}key`)
              // .appendField(':')
              .appendField(key, key)
              .appendField(':')
            const newValueBlock = renderer.workspace.newBlock('var_unknow')

            newValueBlock.setShadow(true);
            newValueBlock.initSvg();
            newValueBlock.render();

            valueInput.connection.connect(newValueBlock.outputConnection)
          }
        })
        oldAry = data.keyAry
      } else {
        oldAry = []
      }
    }

    draw(true)

    return () => {
      const inputList = renderer.inputList
      if (inputList) {
        inputList.slice(1).forEach(item => {
          if (!data.keyAry.includes(item.name)) {
            renderer.removeInput(item.name)
          }
        })

        // oldAry.forEach((name: string) => {
        //   if (!data.keyAry.includes(name)) {
        //     if (renderer.getInput(name)) {
        //       renderer.removeInput(name)
        //     }
        //   }
        // })
      }

      draw()
    }
  },
  editors: [{
    title: '项',
    type: 'list',
    value: {
      get({data}: any) {
        oldAry = data.keyAry
        return data.keyAry
      },
      set({data}: any, val: string) {
        data.keyAry = val
      }
    }
  }],
  to(type, block, data) {
    if (type === 'js') {
      const rtn: any[] = []
      data.keyAry.forEach((key: string) => {
        if (key && key.length) {
          const name = block.getFieldValue(key)
          // const name = block.getFieldValue(`${key}key`)
          const val = Blockly.JavaScript.valueToCode(block, key, Blockly.JavaScript.ORDER_NONE) || "''"
          rtn.push(`${name}:${val}`)
        }
      })

      return [`
        {
          ${rtn.join(',')}
        }
      `, Blockly.JavaScript.ORDER_ATOMIC]
    }
  }
}
