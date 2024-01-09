
import { defineDataSet } from "ai-dataset";
export default defineDataSet((utils) => {
  const result = {}

  result['禁用状态'] = [{
    "Q": `禁用开关组件`,
    "A": {
      data: {
        config: {
          disabled: true
        }
      }
    }
  }, {
    "Q": `启用日期范围选择框组件`,
    "A": {
      data: {
        config: {
          disabled: false
        }
      }
    }
  }]

  result['默认值'] = [{
    "Q": `将开关组件默认值设置为开`,
    "A": {
      data: {
        config: {
          checked: true
        }
      }
    }
  }]


  const ts1 = utils.string.alpha(5)
  result['文案'] = [{
    "Q": `将开关组件开启时文案设置为${ts1}`,
    "A": {
      data: {
        config: {
          checkedChildren: ts1
        }
      }
    }
  },{
    "Q": `将开关组件关闭时文案设置为${ts1}`,
    "A": {
      data: {
        config: {
          unCheckedChildren: ts1
        }
      }
    }
  }]

  return result
})
