
import { defineDataSet } from "ai-dataset";
export default defineDataSet((utils)  => {
  const result = {}
  const width = utils.number.int({ min: 0, max: 1000})
  result['弹窗宽度'] = {
    "Q": `将弹窗宽度设置为${width}`,
    "A": {
      "data": {
        "width": `${width}px`,
      }
    }
  }
  const documentTitle = utils.string.alpha(10)
  result['保存文件名'] = {
    "Q": `将保存文件名设置为${documentTitle}`,
    "A": {
      "data": {
        "documentTitle": `${documentTitle}`,
      }
    }
  }
  result['打印完成后关闭窗口'] = utils.options.switch().map(item => ({
    "Q": `将打印完成后关闭窗口设置为${item.label}`,
    "A": {
      "data": {
        "closeScene": item.value,
      }
    }
  })) 
  result['显示底部操作区'] = utils.options.switch().map(item => ({
    "Q": `将显示底部操作区设置为${item.label}`,
    "A": {
      "data": {
        "useFooter": item.value,
      }
    }
  })) 

  result['顶部操作区插槽'] = utils.options.switch().map(item => ({
    "Q": `将顶部操作区插槽设置为${item.label}`,
    "A": {
      "data": {
        "useTop": item.value,
      }
    }
  })) 

  result['显示关闭按钮'] = utils.options.switch().map(item => ({
    "Q": `将显示关闭按钮设置为${item.label}`,
    "A": {
      "data": {
        "closable": item.value,
      }
    }
  })) 

  return result
})
