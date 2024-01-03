
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
  
  
    const mayBeBooleanEnumMap = {
      '开启': true,
      '打开': true,
      '开': true,
      true: true,
      '关闭': false,
      '关': false,
      false: false,
    }
    const content = utils.string.alpha(10)
    const url = utils.internet.url()
    const isChoose = utils.datatype.boolean()
    const icon = utils.string.alpha(10)
    result['内容'] = {
      "Q": `将链接文字内容为${content}`,
      "A": {
        "content": `${content}`,
      }
    }
    result['链接'] = {
      "Q": `将链接的地址/url设置为${url}`,
      "A": {
        "url": `${url}`,
      }
    }
    result['图标自定义'] = {
      "Q": `将链接的图标自定义设置为${isChoose}`,
      "A": {
        "isChoose": `${isChoose}`,
      }
    }
    result['选择图标'] = {
      "Q": `将链接的图标设置为${icon}`,
      "A": {
        "icon": `${icon}`,
      }
    }
  
    result['图标位置'] = []
    for(let key in iconPosOptionsMap) {
      result['图标位置'].push({
        "Q": `将链接的图标位置设置为${key}`,
        "A": {
          "location": `${iconPosOptionsMap[key]}`,
        }
      })
    }


    result['跳转方式'] = []
    for(let key in routeTypeOptionsMap) {
      result['图标位置'].push({
        "Q": `将链接的跳转方式设置为${key}`,
        "A": {
          "routeType": routeTypeOptionsMap[key],
        }
      })
    }
  
    return result
  }
)
