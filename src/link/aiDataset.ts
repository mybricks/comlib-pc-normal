
import { defineDataSet } from "ai-dataset";

/** 图标位置选项 */
const iconPosOptionsMap = {
  '位于文字前': 'front',
  '位于文字后': 'back'
}

/** 跳转方式选项 */
const routeTypeOptionsMap = {
  '路由跳转': 'push',
  '重定向': 'redirect',
  '新标签页': 'openTab',
  '返回': 'back',
  '前进': 'forward',
  '自定义': 'customEvent'
} 

export default defineDataSet((utils)  => { 
    const result = {}

    const content = utils.string.alpha(10)
    const url = utils.internet.url()
    const icon = utils.string.alpha(10)
    result['内容'] = {
      "Q": `将文字内容为${content}`,
      "A": {
        "content": `${content}`,
      }
    }
    result['链接'] = {
      "Q": `将地址/url设置为${url}`,
      "A": {
        "url": `${url}`,
      }
    }
    result['图标自定义'] = [true, false].map(item => ({
      "Q": `将图标自定义设置为${item? '开启':'关闭'}`,
      "A": {
        "isChoose": item,
      }
    })) 
    /**   临时注释icon */ 
    // result['选择图标'] = {
    //   "Q": `将图标设置为${icon}`,
    //   "A": {
    //     "icon": `${icon}`,
    //   }
    // }
  
    result['图标位置'] = []
    for(let key in iconPosOptionsMap) {
      result['图标位置'].push({
        "Q": `将图标位置设置为${key}`,
        "A": {
          "location": `${iconPosOptionsMap[key]}`,
        }
      })
    }


    result['跳转方式'] = []
    for(let key in routeTypeOptionsMap) {
      result['图标位置'].push({
        "Q": `将跳转方式设置为${key}`,
        "A": {
          "routeType": routeTypeOptionsMap[key],
        }
      })
    }
  
    return result
  }
)
