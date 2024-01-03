
import { defineDataSet } from "ai-dataset";
export default defineDataSet((utils)  => {
  const result = {}
  const content = utils.string.alpha(10)
  result['内容'] = {
    "Q": `将内容设置为${content}`,
    "A": {
      "content": `${content}`,
    }
  }
  result['文本溢出/省略'] = [true, false].map(item => ({
    "Q": `将文本溢出/省略设置为${item? '开启':'关闭'}`,
    "A": {
      "isEllipsis": item,
    }
  })) 
  const maxRow = utils.number.int()
  result['最大显示行数'] = {
    "Q": `将最大显示行数设置为${maxRow}`,
    "A": {
      "isEllipsis": true,
      "ellipsis": { rows: `${maxRow}` }
    }
  }

  return result
})
