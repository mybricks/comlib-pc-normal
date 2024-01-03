
import { defineDataSet } from "ai-dataset";

/** 图标位置选项 */
const horOptionsMap = {
  "左对齐": "left",
  "居中对齐": "center",
  "右对齐": "right"
}


export default defineDataSet((utils)  => { 
    const result = {}

    const url = utils.internet.url()
    result['全局样式'] =[true, false].map(item => ({
      "Q": `${item? '开启':'关闭'}文字排版全局样式`,
      "A": {
        "isUnity": item,
      }
    }))
    let left = utils.number.int({ min: 0, max: 100 })
    let right = utils.number.int({ min: 0, max: 100 })
    result['间距'] = {
      "Q": `将文字排版的全局样式的间距设置为左${left}右${right}`,
      "A": {
        "url": `${url}`,
      }
    }
    result['水平对齐方式'] = []
    for(let key in horOptionsMap) {
      result['水平对齐方式'].push({
        "Q": `将文字排版的水平对齐方式设置为${key}`,
        "A": {
          "style": {
            textAlign: horOptionsMap[key]
          },
        }
      })
    }
    let rowKey = utils.string.alpha(5)
    result['动态数据唯一标识'] = {
      "Q": `将文字排版的动态数据唯一标识设置为${rowKey}`,
      "A": {
        "rowKey": rowKey,
      }
    }

  
    return result
  }
)
