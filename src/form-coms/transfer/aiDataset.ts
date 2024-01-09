
import { defineDataSet } from "ai-dataset";
export default defineDataSet((utils) => {
  const result = {}

  const ts1 = utils.string.alpha(5)
  result['数据源标题'] = [{
    "Q": `将穿梭框组件的数据源标题设置为${ts1}`,
    "A": {
      data: {
        titles: [ts1, '']
      }
    }
  }]

  const ts2 = utils.string.alpha(5)
  result['目标数据标题'] = [{
    "Q": `将穿梭框组件的目标数据标题设置为${ts2}`,
    "A": {
      data: {
        titles: ['', ts2]
      }
    }
  }]

  result['模式'] = [
    {
      label: '单向',
      value: true
    },
    {
      label: '双向',
      value: false
    }
  ].map((item) => {
    return {
      "Q": `将穿梭框组件的模式设置为${item.label}`,
      "A": {
        data: {
          oneWay: item.value
        }
      }
    }
  })

  result['可搜索'] = [{
    "Q": `开启穿梭框组件的搜索功能`,
    "A": {
      data: {
        showSearch: true
      }
    }
  }]

  result['分页'] = [{
    "Q": `开启穿梭框组件的分页功能`,
    "A": {
      data: {
        showPagination: true,
        pagination: {
          pageSize: 10
        }
      }
    }
  }]

  result['分页'] = [{
    "Q": `开启穿梭框组件的分页功能,并设置每页显示20条数据`,
    "A": {
      data: {
        showPagination: true,
        pagination: {
          pageSize: 20
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
