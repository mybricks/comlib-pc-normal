
import { defineDataSet } from "ai-dataset";
export default defineDataSet((utils) => {
  const result = {}

  const ts1 = utils.lorem.word({ length: { min: 0, max: 10 } })
  result['前置提示内容'] = [{
    "Q": `设置日期范围选择框的前置提示内容为“${ts1}”`,
    "A": {
      data: {
        config: {
          placeholder: [ts1, '']
        },
      }
    }
  }]

  const ts2 = utils.lorem.word({ length: { min: 0, max: 10 } })
  result['后置提示内容'] = [{
    "Q": `设置日期范围选择框的后置提示内容为“${ts2}”`,
    "A": {
      data: {
        config: {
          placeholder: ['', ts2]
        },
      }
    }
  }, {
    "Q": `设置日期范围选择框的前置提示内容为${ts1}, 后置内容为${ts2}`,
    "A": {
      data: {
        config: {
          placeholder: [ts1, ts2]
        },
      }
    }
  }]

  result['时间选择'] = [{
    "Q": `开启日期选择框组件的时间选择功能`,
    "A": {
      data: {
        showTime: true
      }
    }
  }]

  result['禁用状态'] = [{
    "Q": `禁用日期范围选择框组件`,
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

  result['日期选择类型'] = [
    { label: '日期', value: 'date' },
    { label: '周', value: 'week' },
    { label: '月份', value: 'month' },
    { label: '季度', value: 'quarter' },
    { label: '年份', value: 'year' }
  ].map((item) => {
    return {
      Q: `设置日期范围选择框的日期选择类型为${item.label}`,
      A: {
        data: {
          config: {
            picker: item.value
          }
        }
      }
    }
  })

  result['预设时间范围快捷选择'] = [{
    "Q": `开启预设时间范围快捷选择功能`,
    "A": {
      data: {
        useRanges: true
      }
    }
  }]

  result['输出数据处理'] = [...[
    { label: '年-月-日 时:分:秒', value: 'Y-MM-DD HH:mm:ss' },
    { label: '年-月-日 时:分', value: 'Y-MM-DD HH:mm' },
    { label: '年-月-日', value: 'Y-MM-DD' },
    { label: '年-月', value: 'Y-MM' },
    { label: '年', value: 'Y' },
    { label: '时间戳', value: 'timeStamp' },
    { label: '自定义', value: 'custom' }
  ].map((item) => {
    return  {
      Q: `将日期范围选择组件输出的数据设置成如下格式：${item.label}`,
      A: {
        data: {
          contentType: item.value
        }
      }
    }
  }),
  {
    "Q": `自定义日期选择了输出的数据，并设置成如下格式：年、月、日、时、分、秒、周`,
    "A": {
      data: {
        contentType: 'custom',
        formatter: 'YYYY-MM-DD HH:mm:ss dd'
      }
    }
  }
]

  return result
})
