
import { defineDataSet } from "ai-dataset";

const statusMap = {
  '成功': 'success',
  '错误': 'error',
  '信息': 'info',
  '警告': 'warning'
}

export default defineDataSet((utils)  => {
  const result = {}
  const message = utils.string.alpha(10)
  const url = utils.internet.url()
  const title = utils.string.alpha(10)
  result['标题'] = {
    "Q": `将标题设置为${title}`,
    "A": {
      "data": {
        "title": title,
      }
    }
  }

  const subtitle = utils.string.alpha(10)
  result['副标题'] = {
    "Q": `将副标题设置为${subtitle}`,
    "A": {
      "data": {
        "subtitle": subtitle,
      }
    }
  }

  result['状态'] =[] 
  for(let key in statusMap) {
    result['状态'].push({
      "Q": `将状态设置为${key}`,
      "A": {
        "data": {
          "status": statusMap[key],
        }
      }
    })
  }

  return result
})
