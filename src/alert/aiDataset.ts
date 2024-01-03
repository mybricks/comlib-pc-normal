
import { defineDataSet } from "ai-dataset";

const typesMap = {
  '默认': 'info',
  '成功': 'success',
  '错误': 'error',
  '警告': 'warning'
}
export default defineDataSet((utils)  => {
  const result = {}
  const message = utils.string.alpha(10)
  result['标题'] = {
    "Q": `将标题设置为${message}`,
    "A": {
      "message": message,
    }
  }

  result['类型'] =[] 
  for(let key in typesMap) {
    result['类型'].push({
      "Q": `将类型设置为${key}`,
      "A": {
        "type": typesMap[key],
      }
    })
  }

  result['关闭按钮'] = [true, false].map(item => ({
    "Q": `将关闭按钮设置为${item? '开启':'关闭'}`,
    "A": {
      "closable": item
    }
  })) 
  result['顶部公告'] = [true, false].map(item => ({
    "Q": `将顶部公告设置为${item? '开启':'关闭'}`,
    "A": {
      "banner": item
    }
  })) 
  result['辅助图标'] = [true, false].map(item => ({
    "Q": `将辅助图标设置为${item? '开启':'关闭'}`,
    "A": {
      "showIcon": item
    }
  })) 
  result['辅助介绍'] = [true, false].map(item => ({
    "Q": `将辅助介绍设置为${item? '开启':'关闭'}`,
    "A": {
      "showInfo": item
    }
  })) 
  const content = utils.string.alpha(10)
  result['辅助介绍文案'] = {
    "Q": `将警告提示的辅助介绍文案设置为${content}`,
    "A": {
      "content": `${content}`,
    }
  }
  result['图标自定义'] = [true, false].map(item => ({
    "Q": `将警告提示的图标自定义设置为${item? '开启':'关闭'}`,
    "A": {
      "isChoose": item
    }
  })) 
  const icon = utils.string.alpha(10)
  result['选择图标'] = {
    "Q": `将警告提示的图标设置为${icon}`,
    "A": {
      "icon": `${icon}`,
      "isChoose": true,
      "showIcon": true
    }
  }

  result['选择图标'] = {
    "Q": `将警告提示的图标设置为${icon}`,
    "A": {
      "icon": `${icon}`,
      "isChoose": true,
      "showIcon": true
    }
  }
  result['选择图标'] = {
    "Q": `将警告提示的图标设置为${icon}`,
    "A": {
      "icon": `${icon}`,
      "isChoose": true,
      "showIcon": true
    }
  }
  result['固定宽度'] = [true, false].map(item => ({
    "Q": `将警告提示的固定宽度设置为${item? '开启':'关闭'}`,
    "A": {
      "openWidth": item,
    }
  })) 
  
  const width = utils.number.int({ min: 10 })
  result['固定宽度'].push({
    "Q": `将警告提示的固定宽度设置为${width}`,
    "A": {
      "openWidth": true,
      "width": width
    }
  })

  const percentWidth = utils.number.int({ min: 10 })
  result['百分比宽度'] = {
    "Q": `将警告提示的百分比宽度设置为${percentWidth}`,
    "A": {
      "openWidth": false,
      "percentWidth": percentWidth
    }
  }
  return result
})
