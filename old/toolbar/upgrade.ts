export default function ({data, slot, input, output}):boolean {
  // const allOutput = output.get()
  // console.log(allOutput)
  if (typeof data.tools === 'undefined') {
    data.tools = data.btns.map(item => {
      return {...item, showText: true, margin: [0, 0], icon: '', dataType: 'null'}
    })
    data.layout = 'flex-start'
  }

  return true
}