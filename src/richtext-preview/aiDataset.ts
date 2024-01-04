
import { defineDataSet } from "ai-dataset";

export default defineDataSet((utils) => {
  const result = {}
  let content = utils.string.alpha(20)
  result['内容'] = [{
    "Q": `将内容设置为${content}`,
    "A": {
      data: {
        "content": content,
      }
    }
  }]
  return result
})
