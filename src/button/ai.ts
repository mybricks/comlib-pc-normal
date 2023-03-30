export default {
  '@focus'({data}) {
    return {
      data,
      prompts: `
      以下是一些例子：
      Q：修改当前文案为ABC;
      A:{text: 'ABC'}
      `
    }
  },
  '@update'({data, newData}) {
    if (typeof newData.text === 'string') {
      data.text = newData.text
    }
    if(newData.style){
      data.style = Object.assign({},data.style,newData.style)
    }
  }
}