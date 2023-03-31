export default {
  '@focus'({ data }) {
    return {
      data,
      prompts: `
      以下是一些例子：
      Q：修改当前文案为ABC;
      A：{text: 'ABC'}
      Q：输出 1
      A：{dataType: 'number', outVal: 1}
      Q：输出 mybricks
      A：{dataType: 'string', outVal: 'mybricks'}
      `
    }
  },
  '@update'({ data, newData }) {
    if (typeof newData.text === 'string') {
      data.text = newData.text
    }

    if (newData.style) {
      data.style = Object.assign({}, data.style, newData.style)
    }

    if (typeof newData.dataType === 'string') {
      data.dataType = newData.dataType
    }

    if (newData.outVal) {
      data.outVal = newData.outVal
    }
  }
}