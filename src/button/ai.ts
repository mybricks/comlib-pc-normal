export default {
  '@focus'({ data }) {
    return {
      data,
      prompts: `
      以下是一些例子（最终回答不需要带上“答：”字）：
      问：修改当前文案为ABC；
      答：{text: 'ABC'}
      问：输出 1；
      答：{dataType: 'number', outVal: 1}
      问：输出 mybricks；
      答：{dataType: 'string', outVal: 'mybricks'}
      问：颜色为红色；
      答：{style: {color: 'red'}}
      `
    }
  },
  '@update'({ data, newData, style }) {
    if (typeof newData.text === 'string') {
      data.text = newData.text
    }
    
    if (newData.style) {
      const { width, height, ...otherStyles } = newData.style
      data.style = Object.assign({}, data.style, otherStyles)
      if (width) {
        style.width = width
      }
      if (height) {
        style.height = height
      }

    }

    if (typeof newData.dataType === 'string') {
      data.dataType = newData.dataType
    }

    if (newData.outVal) {
      data.outVal = newData.outVal
    }
  }
}