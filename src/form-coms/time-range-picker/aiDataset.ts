
import { defineDataSet } from "ai-dataset";
export default defineDataSet((utils) => {
  const result = {}

  const ts1 = utils.lorem.word({ length: { min: 0, max: 10 } })
  result['前置提示内容'] = [{
    "Q": `设置时间范围选择框的前置提示内容为“${ts1}”`,
    "A": {
      data: {
        placeholder: [ts1, '']
      }
    }
  }]

  const ts2 = utils.lorem.word({ length: { min: 0, max: 10 } })
  result['后置提示内容'] = [{
    "Q": `设置时间范围选择框的后置提示内容为“${ts2}”`,
    "A": {
      data: {
        placeholder: ['', ts2]
      }
    }
  }, {
    "Q": `设置时间范围选择框的前置提示内容为${ts1}, 后置内容为${ts2}`,
    "A": {
      data: {
        placeholder: [ts1, ts2]
      }
    }
  }]

  result['禁用状态'] = [{
    "Q": `禁用日期范围选择框组件`,
    "A": {
      data: {
        disabled: true
      }
    }
  }, {
    "Q": `启用日期范围选择框组件`,
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
    { label: '自定义', value: 'custom' }
  ].map((item) => {
    return  {
      Q: `将时间范围选择组件输出的数据设置成如下格式：${item.label}`,
      A: {
        data: {
          contentType: item.value
        }
      }
    }
  }),
  {
    "Q": `自定义日期选择了输出的数据，并设置成如下格式：时、分、秒`,
    "A": {
      data: {
        format: 'custom',
        customFormat: 'HH:mm:ss'
      }
    }
  }
]

  return result
})
