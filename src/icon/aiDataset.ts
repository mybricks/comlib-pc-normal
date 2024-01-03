
import { defineDataSet } from "ai-dataset";
export default defineDataSet((utils)  => { 
    const result = {}
    let text = utils.string.alpha(10)
    const icon = utils.string.alpha(12)
    result['选择图标'] = {
      "Q": `将图标icon设置为${icon}`,
      "A": {
        "icon": icon
      }
    }

    const color = utils.color.rgb()
    result['颜色'] = {
      "Q": `将颜色设置为${color}`,
      "A": {
        "color": color
      }
    }
    const size = utils.number.int({ min: 10})
    result['尺寸'] = {
      "Q": `将尺寸设置为${size}`,
      "A": {
        "size": size
      }
    }
    return result
  }
)
