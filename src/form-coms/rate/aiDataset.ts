
import { defineDataSet } from "ai-dataset";
export default defineDataSet((utils) => {
  const result = {}

  result['评分总数'] = [{
    "Q": `设置评分组件的评分总数为 10`,
    "A": {
      data: {
        config: {
          count: 10
        }
      }
    }
  }]

  result['默认值'] = [{
    "Q": `设置评分组件默认值为 5`,
    "A": {
      data: {
        config: {
          defaultValue: 5
        }
      }
    }
  }]

  result['只读状态'] = [{
    "Q": `设置评分组件为只读状态`,
    "A": {
      data: {
        config: {
          disabled: true
        }
      }
    }
  }]

  result['其它字符'] = [{
    "Q": `开启评分组件的其它字符功能`,
    "A": {
      data: {
        isChoose: true
      }
    }
  }]

  result['其它字符类型'] = [
    {
      label: '文字',
      value: 'font'
    },
    {
      label: '图标',
      value: 'icon'
    }
  ].map((item) => {
    return {
      "Q": `设置评分组件其它字符类型为 ${item.label}`,
      "A": {
        data: {
          isChoose: true,
          choose: item.value
        }
      }
    }
  })

  result['文字'] = [{
    "Q": `设置评分组件的文案为 好评`,
    "A": {
      data: {
        config: {
          isChoose: true,
          choose: 'font',
          font: '好评'
        }
      }
    }
  }]

  result['颜色'] = [{
    "Q": `设置评分组件的颜色为 红色`,
    "A": {
      data: {
        color: 'red'
      }
    }
  }]

  return result
})
