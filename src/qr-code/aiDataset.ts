
import { defineDataSet } from "ai-dataset";

export default defineDataSet((utils)  => {
  const result = {}
  const message = utils.string.alpha(10)
  const url = utils.internet.url()
  result['链接'] = {
    "Q": `将链接设置为${url}`,
    "A": {
      "data": {
        "link": url,
      }
    }
  }

  result['支持Logo'] = [true, false].map(item => ({
    "Q": `将支持logo设置为${item? '开启':'关闭'}`,
    "A": {
      "data": {
        "hasIcon": item
      }
    }
  })) 

  result['Logo'] = []
  const iconUrl = utils.image.url({ width: 34, height: 34 })
  result['Logo'].push({
    "Q": `将Logo图片地址设置为${iconUrl}`,
    "A": {
      "data": {
        "icon": {
          "url": iconUrl
        },
        "hasIcon": true
      }
    }
  }) 
  const widthPer = utils.number.int({ min: 0, max: 100 })
  const heightPer = utils.number.int({ min: 0, max: 100 })
  result['Logo'].push({
    "Q": `将Logo图片尺寸设置为${iconUrl}`,
    "A": {
      "data": {
        "icon": {
          width: widthPer,
          height: heightPer
        },
        "hasIcon": true
      }
    }
  }) 

  return result
})
