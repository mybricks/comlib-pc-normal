
import { defineDataSet } from "ai-dataset";
export default defineDataSet((utils) => {
  const result = {}

  result['提示内容'] = [{
    "Q": `设置邮箱组件值为空时的提示内容为 请输入邮箱`,
    "A": {
      data: {
        config: {
          placeholder: '请输入邮箱'
        }
      }
    }
  }]

  result['显示清除图标'] = [{
    "Q": `开启邮箱组件单击清楚图标删除内容功能`,
    "A": {
      data: {
        config: {
          allowClear: true
        }
      }
    }
  }]

  result['前置标签'] = [{
    "Q": `设置邮箱组件的前置标签为 这是前置内容`,
    "A": {
      data: {
        config: {
          addonBefore: '这是前置内容'
        }
      }
    }
  }]

  result['后置标签'] = [{
    "Q": `设置邮箱组件的后置标签为 这是后置内容`,
    "A": {
      data: {
        config: {
          addonAfter: '这是后置内容'
        }
      }
    }
  }]

  result['禁用状态'] = [{
    "Q": `禁用邮箱组件`,
    "A": {
      data: {
        config: {
          disabled: true
        }
      }
    }
  }]

  result['显示字数'] = [{
    "Q": `开启邮箱组件的显示字数功能`,
    "A": {
      data: {
        config: {
          showCount: true
        }
      }
    }
  }]

  result['最大长度'] = [{
    "Q": `设置邮箱组件的最大输入长度为 10`,
    "A": {
      data: {
        config: {
          maxLength: 10
        }
      }
    }
  }]

  return result
})
