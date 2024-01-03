
import { defineDataSet } from "ai-dataset";

const triggerMap = {
  '悬浮': 'hover',
  '点击': 'click',
  '聚焦': 'focus'
}

const placementMap = {
  '左上': 'leftTop',
  '上': 'top',
  '右上': 'rightTop',
  '左下': 'leftBottom',
  '下': 'bottom',
  '右下': 'rightBottom',
  '左': 'left',
  '右': 'right'
}
export default defineDataSet((utils)  => {
  const result = {}
  const title = utils.string.alpha(10)
  result['提示内容'] = {
    "Q": `将提示内容设置为${title}`,
    "A": {
      "title": title,
    }
  }

  result['触发方式'] =[] 
  for(let key in triggerMap) {
    result['触发方式'].push({
      "Q": `将触发方式设置为${key}`,
      "A": {
        "data": {
          "trigger": triggerMap[key],
        }
      }
    })
  }

  result['方向'] = []
  for(let key in placementMap) {
    result['方向'].push({
      "Q": `将方向设置为${key}`,
      "A": {
        "data": {
          "placement": placementMap[key],
        }
      }
    })
  }

  return result
})
