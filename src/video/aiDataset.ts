
import { defineDataSet } from "ai-dataset";

const fitMap = {
  '保持比例': 'contain',
  '充满': 'fill'
}

export default defineDataSet((utils)  => { 
    const result = {}

    const url = utils.internet.url()

    result['视频链接'] = {
      "Q": `将视频链接设置为${url}`,
      "A": {
        "data": {
          "src": url,
        }
      }
    }
    result['自动播放'] =[true, false].map(item => ({
      "Q": `将自动播放设置为${item? '开启':'关闭'}`,
      "A": {
        "data": {
          "autoplay": item,
          "muted": item
        }
      }
    }))
    result['控制栏'] =[true, false].map(item => ({
      "Q": `将控制栏设置为${item? '开启':'关闭'}`,
      "A": {
        "data": {
          "controls": item,
        }
      }
    }))
    
    result['循环播放'] =[true, false].map(item => ({
      "Q": `将循环播放设置为${item? '开启':'关闭'}`,
      "A": {
        "data": {
          "loop": item,
        }
      }
    }))

    const poster = utils.image.url()
    result['封面'] = {
      "Q": `将封面设置为${poster}`,
      "A": {
        "data": {
          "src": poster,
        }
      }
    }

    result['比例'] = []
    for(let key in fitMap) {
      result['比例'].push({
        "Q": `将比例设置为${key}`,
        "A": {
          "data": {
            "fit": fitMap[key]
          }
        }
      })
    }
    return result
  }
)
