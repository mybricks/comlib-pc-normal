
import { defineDataSet } from "ai-dataset";
export default defineDataSet((utils) => {
  const result = {}

  result['范围'] = [{
    "Q": `设置滑动输入条范围的最小值为10，最大值为100`,
    "A": {
      data: {
        config: {
          min: 10,
          max: 100
        }
      }
    }
  }]

  result['展示单位'] = [{
    "Q": `设置滑动输入条滑动时展示的单位为 px`,
    "A": {
      data: {
        formatter: 'px'
      }
    }
  }]

  result['输入功能'] = [{
    "Q": `开启滑动输入条的输入功能`,
    "A": {
      data: {
        useInput: true
      }
    }
  }]

  result['滑动条宽度'] = [{
    "Q": `设置滑动输入条的宽度为12个栅格宽度`,
    "A": {
      data: {
        useInput: true,
        sliderSpan: 12
      }
    }
  }]

  result['数字输入框宽度'] = [{
    "Q": `设置滑动输入条的数字输入框宽度为4个栅格宽度`,
    "A": {
      data: {
        useInput: true,
        inputSpan: 12
      }
    }
  }]

  result['禁用状态'] = [{
    "Q": `禁用滑动输入条`,
    "A": {
      data: {
        config: {
          disabled: true
        }
      }
    }
  }]

  return result
})
