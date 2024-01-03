
import { defineDataSet } from "ai-dataset";
export default defineDataSet((utils)  => {
  const result = {}
  const content = utils.string.alpha(10)
  result['内容'] = {
    "Q": `文本输入框如何设置内容为${content}`,
    "A": {
      "content": `${content}`,
    }
  }
  let isEllipsis = utils.datatype.boolean()
  result['文本溢出/省略'] = {
    "Q": `将文本输入框的‘文本溢出/省略’ 设置为${isEllipsis}`,
    "A": {
      "isEllipsis": `${isEllipsis}`,
    }
  }
  const maxRow = utils.number.int()
  result['最大显示行数'] = {
    "Q": `将文本输入框的最大显示行数设置为${maxRow}`,
    "A": {
      "isEllipsis": true,
      "ellipsis": { rows: `${maxRow}` }
    }
  }

  return result
})
