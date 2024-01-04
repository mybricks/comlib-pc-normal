
import { defineDataSet } from "ai-dataset";

const directionMap = {
  '水平': 'horizontal',
  '垂直': 'vertical'
}
/** 标签列表可选类型 */
const tagsTypeMap = {
  '默认': 'default',
  '成功': 'success',
  '进行中': 'processing',
  '警告': 'warning',
  '失败': 'error'
}
export default defineDataSet((utils) => {
  const result = {}

  result['方向'] = []
  for (let key in directionMap) {
    result['方向'].push({
      "Q": `将方向设置为${key}`,
      "A": {
        "data": {
          "direction": directionMap[key]
        }
      }
    })
  }

  result['类型'] = []
  for (let key in tagsTypeMap) {
    result['类型'].push({
      "Q": `将类型设置为${key}`,
      "A": {
        "data": {
          "type": tagsTypeMap[key],
          // TODO:,wf
          // "tags": { color: tagsTypeMap[key] }
        }
      }
    })
  }

  const size = utils.number.int({ min: 0, max: 100 })
  result['标签间距'] = [{
    "Q": `将间距设置为${size}`,
    "A": {
      "data": {
        "size": size
      }
    }
  }]

  result['可关闭'] = [true, false].map(item => ({
    "Q": `将可关闭设置为${item ? '开启' : '关闭'}`,
    "A": {
      "data": {
        "closeAble": item
      }
    }
  }))


  result['可新增'] = [true, false].map(item => ({
    "Q": `将可新增设置为${item ? '开启' : '关闭'}`,
    "A": {
      "data": {
        "appendAble": item
      }
    }
  }))

  result['显示新增按钮'] = [true, false].map(item => ({
    "Q": `将显示新增按钮设置为${item ? '开启' : '关闭'}`,
    "A": {
      "data": {
        "useAppendBtn": item,
        "appendAble": true
      }
    }
  }))

  result['可选择'] = [true, false].map(item => ({
    "Q": `将可选择属性设置为${item ? '开启' : '关闭'}`,
    "A": {
      "data": {
        "checkable": item
      }
    }
  }))

  result['动态数据'] = [true, false].map(item => ({
    "Q": `将动态数据设置为${item ? '开启' : '关闭'}`,
    "A": {
      "data": {
        "dynamic": item
      }
    }
  }))

  result['文本溢出/省略'] = [true, false].map(item => ({
    "Q": `将文本溢出/省略设置为${item ? '开启' : '关闭'}`,
    "A": {
      "data": {
        "isEllipsis": item,
      }
    }
  }))

  let maxWidth = utils.number.int({ min: 30 })
  result['最大显示宽度'] = [{
    "Q": `将最大显示宽度设置为${maxWidth}`,
    "A": {
      "data": {
        "isEllipsis": true,
        'ellipse': {
          "maxWidth": maxWidth
        }
      }
    }
  }]

  /** 标签项变更 */
  /** TODO:wf,确认A描述 */
  const content = utils.string.alpha(10)
  const index = utils.number.int({ max: 10 })
  // result['标签内容'] = {
  //   "Q": `将标签列表第${index}个标签的标签内容设置为${content}`,
  //   "A": {
  //     tags: {
  //       index: index,
  //       data: {
  //         "content": content
  //       }
  //     }
  //   }
  // }
  // result['标签项类型'] = {
  //   "Q": `将标签列表第${index}个标签的标签类型设置为${content}`,
  //   /** TODO:wf,确认A描述 */
  //   "A": {
  //     tags: {
  //       index: index,
  //       data: {
  //         "content": content
  //       }
  //     }
  //   }
  // }

  /** 标签项类型，title 和标签列表类型重复;更改标签项-类型-title */
  // result['标签项类型'] =[] 
  // for(let key in tagsTypeMap) {
  //   result['标签项类型'].push({
  //     "Q": `将第${index}个标签的标签类型设置为${key}`,
  //     "A": {
  //       tags: {
  //         index: index,
  //         data: {
  //           "color": tagsTypeMap[key]
  //         }
  //       }
  //     }
  //   })
  // }

  /**   临时注释icon */
  // const icon = utils.string.alpha(10)
  // result['图标'] = {
  //   "Q": `将第${index}个标签的图标设置为${icon}`,
  //   /** TODO:wf,确认A描述 */
  //   "A": {
  //     tags: {
  //       index: index,
  //       data: {
  //         "icon": icon
  //       }
  //     }
  //   }
  // } 
  // TODO:wf,标签项的前移，后移，删除
  return result
}
)
