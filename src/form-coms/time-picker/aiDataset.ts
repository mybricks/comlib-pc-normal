
import { defineDataSet } from "ai-dataset";
export default defineDataSet((utils) => {
  const result = {}

  const ts1 = utils.string.alpha(5)
  result['提示内容'] = [{
    "Q": `设置时间选择框的提示内容为${ts1}`,
    "A": {
      data: {
        placeholder: ts1
      }
    }
  }]

  result['禁用状态'] = [{
    "Q": `禁用时间选择框组件`,
    "A": {
      data: {
        disabled: true
      }
    }
  }, {
    "Q": `启用时间选择框组件`,
    "A": {
      data: {
        disabled: false
      }
    }
  }]

  result['输出数据处理'] = [...[
    { label: '时:分:秒', value: 'HH:mm:ss' },
    { label: '时:分', value: 'HH:mm' },
    { label: '时', value: 'HH' },
    { label: "时间戳", value: "timeStamp" },
    { label: '自定义', value: 'custom' },
  ].map((item) => {
    return  {
      Q: `将时间选择组件输出的数据设置成如下格式：${item.label}`,
      A: {
        data: {
          format: item.value
        }
      }
    }
  })
  ]

  return result
})
