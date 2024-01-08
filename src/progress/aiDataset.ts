import { defineDataSet } from "ai-dataset";
import { unitConversion } from "src/utils";
import { uuid } from '../utils';

const typeMap = {
  '进度条': 'line',
  '进度圈': 'circle',
  '仪表盘': 'dashboard'
}

const sizeMap = {
  '正常': 'default',
  '迷你': 'small',
}

const statusMap = {
  '成功': 'success',
  '失败': 'exception',
  '正常': 'normal',
  '激活': 'active'
}

export const simpleTemplate = (label, value, data) => {
  return {
    Q: `将${label}设置为${value}`,
    A: {
      data
    }
  }
}

export default defineDataSet((utils) => {
  const result = {};

  let percent = utils.number.int({ min: 1, max: 100 })
  result['默认进度'] = [simpleTemplate('默认进度', percent, { percent })]

  result['显示进度值'] = utils.options.switch().map(item => (
    simpleTemplate('显示进度值', item.label, { isShow: item.value, })))

  result['自定义进度值'] = utils.options.switch().map(item => (
    simpleTemplate('自定义进度值', item.label,
      {
        isFormat: item.value,
        ...(item.value ? { isShow: true } : {})
      }
    )))

  result['类型'] = []
  for (let key in typeMap) {
    result['类型'].push(
      simpleTemplate('类型', key, { type: typeMap[key] }))
  }

  result['尺寸'] = []
  for (let key in sizeMap) {
    result['尺寸'].push(
      simpleTemplate('尺寸', key, { size: typeMap[key] }))
  }

  const formatFunction = utils.string.alpha(10)
  result['自定义进度值表达式'] = [simpleTemplate('自定义进度值表达式', formatFunction, {
    formatFunction,
    isShow: true,
    isFormat: true
  })]
  const circleSize = utils.number.int({ min: 1, max: 300 })
  result['尺寸'].push(simpleTemplate('尺寸', circleSize, { circleSize }))

  let strokeWidth = utils.number.int({ min: 1, max: 100 })
  result['进度条线宽度'] = [simpleTemplate('进度条线宽度', strokeWidth, { strokeWidth })]

  result['步骤进度条'] = utils.options.switch().map(item => (
    simpleTemplate('步骤进度条', item.label,
      {
        isSteps: item.value,
        ...(item.value ? { type: 'line' } : {})
      }
    )))
  const steps = utils.number.int({ min: 1, max: 100 })
  result['总步骤数'] = [simpleTemplate('总步骤数', steps, {
    steps,
    type: 'line',
    isSteps: true
  })]

  result['状态'] = []
  for (let key in statusMap) {
    result['状态'].push(
      simpleTemplate('状态', key, { size: statusMap[key] }))
  }

  result['自定义颜色'] = utils.options.switch().map(item => (
    simpleTemplate('自定义颜色', item.label,
      {
        isColor: item.value,
      }
    )))
  const strokeColor = utils.color.rgb()
  result['完成分段颜色'] = [simpleTemplate('完成分段颜色', strokeColor, {
    strokeColor,
    isColor: true
  })]

  const trailColor = utils.color.rgb()
  result['未完成分段颜色'] = [simpleTemplate('完成分段颜色', trailColor, {
    trailColor,
    isColor: true
  })]
  return result;
});

