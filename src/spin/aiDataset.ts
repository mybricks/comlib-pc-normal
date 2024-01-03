
import { defineDataSet } from "ai-dataset";

const sizeMap = {
  '大': 'large',
  '中': 'default',
  '小': 'small'
}
export default defineDataSet((utils)  => {
  const result = {}
  const tip = utils.string.alpha(10)
  result['描述文案'] = {
    "Q": `将描述文案设置为${tip}`,
    "A": {
      "data": {
        "tip": tip,
      }
    }
  }

  result['加载图标大小'] =[] 
  for(let key in sizeMap) {
    result['加载图标大小'].push({
      "Q": `将加载图标大小设置为${key}`,
      "A": {
        "data": {
          "size": sizeMap[key],
        }
      }
    })
  }

  return result
})
