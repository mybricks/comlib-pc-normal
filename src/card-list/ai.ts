export default {
  ':root' ({ data }) {
    return {
      prompts: `
      以下是一些例子：
      请回答：修改当前文案为ABC；
      {text: 'ABC'}
      请回答：输出 1；
      {dataType: 'number', outVal: 1}
      请回答：输出 mybricks；
      {dataType: 'string', outVal: 'mybricks'}
      请回答：颜色为红色；
      {style: {color: 'red'}}
      请回答：修改样式高度为100；
      {style: {height: '100px'}}
      `,
      execute({ data, newData, style }) {
console.log(newData,data,style)
        
        
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
  },
  // '@focus'({ data }) {
  //   return {
  //     data,
  //     prompts: `
  //     以下是一些例子（最终回答不需要带上“答：”字）：
  //     问：修改当前文案为ABC；
  //     答：{text: 'ABC'}
  //     问：输出 1；
  //     答：{dataType: 'number', outVal: 1}
  //     问：输出 mybricks；
  //     答：{dataType: 'string', outVal: 'mybricks'}
  //     问：颜色为红色；
  //     答：{style: {color: 'red'}}
  //     `
  //   }
  // },
  // '@update'({ data, newData, style }) {
  //   if (typeof newData.text === 'string') {
  //     data.text = newData.text
  //   }
    
  //   if (newData.style) {
  //     const { width, height, ...otherStyles } = newData.style
  //     data.style = Object.assign({}, data.style, otherStyles)
  //     if (width) {
  //       style.width = width
  //     }
  //     if (height) {
  //       style.height = height
  //     }

  //   }

  //   if (typeof newData.dataType === 'string') {
  //     data.dataType = newData.dataType
  //   }

  //   if (newData.outVal) {
  //     data.outVal = newData.outVal
  //   }
  // }
}