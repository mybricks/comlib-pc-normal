
import { defineDataSet } from "ai-dataset";
export default defineDataSet((utils) => {
  const result = {}

  result['显示标题'] = [{
    "Q": `显示提示内容的标题`,
    "A": {
      data: {
        hiddenLabel: false
      }
    }
  }]

  const ts1 = utils.string.alpha(5)
  result['标题'] = [{
    "Q": `设置提示内容的标题为${ts1}`,
    "A": {
      data: {
        hiddenLabel: false,
        label: ts1
      }
    }
  }]

  const ts2 = utils.string.alpha(5)
  result['字段'] = [{
    "Q": `设置提示内容的字段为${ts2}`,
    "A": {
      data: {
        hiddenLabel: false,
        value: ts2
      }
    }
  }]

  const ts3 = utils.string.alpha(5)
  result['标题提示'] = [{
    "Q": `设置提示内容标题背后的悬浮提示内容为${ts3}`,
    "A": {
      data: {
        hiddenLabel: false,
        tooltip: ts3
      }
    }
  }]

  const ts4 = utils.string.alpha(5)
  result['提示语'] = [{
    "Q": `设置提示内容下方的提示内容为${ts4}`,
    "A": {
      data: {
        hiddenLabel: false,
        description: ts4
      }
    }
  }]
  
  const ts5 = utils.string.alpha(5)
  result['提示内容'] = [{
    "Q": `将提示内容设置为${ts5}`,
    "A": {
      data: {
        config: {
          placeholder: ts5
        }
      }
    }
  }]

  result['显示清除图标'] = [{
    "Q": `开启自动完成组件的单击图标清除内容功能`,
    "A": {
      data: {
        config: {
          allowClear: true
        }
      }
    }
  }]

  result['禁用状态'] = [{
    "Q": `禁用自动完成组件`,
    "A": {
      data: {
        config: {
          disabled: true
        }
      }
    }
  }, {
    "Q": `启用自动完成组件`,
    "A": {
      data: {
        config: {
          disabled: false
        }
      }
    }
  }]

  result['筛选'] = [{
    "Q": `开启根据输入项内容进行筛选值`,
    "A": {
      data: {
        isFilter: true
      }
    }
  }]

  result['静态选项配置'] = [{
    "Q": `添加一个选项，label为选项1，value也是选项1`,
    "A": {
      data: {
        staticOptions: [
          {
            value: `选项1`,
            label: `选项1`
          }
        ],
      }
    }
  },
  {
    "Q": `添加两个选项，第一个选项是的label是选项1，value是选项1；第二个选项的lable是选项2，value是选项2`,
    "A": {
      data: {
        staticOptions: [
          {
            value: `选项1`,
            label: `选项1`
          },
          {
            value: `选项2`,
            label: `选项2`
          }
        ],

      }
    }
  }]

  return result
})
