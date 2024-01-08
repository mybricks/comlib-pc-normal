import { defineDataSet } from "ai-dataset";
import { unitConversion } from "src/utils";
import { uuid } from '../utils';
export const simpleTemplate = (label, value, data) => {
  return {
    Q: `将${label}设置为${value}`,
    A: {
      data
    }
  }
}
const  dataSourceTypeMap = {
  '静态配置': 'default',
  '动态输入(数组)': 'array',
  '动态输入(对象)': 'object'
}

const modeTypeMap = {
  '按月展示': 'month',
  '按年展示': 'year'
}

export default defineDataSet((utils) => {
  const result = {};

  result['默认展示模式'] = []
  for (let key in modeTypeMap) {
    result['默认展示模式'].push(
      simpleTemplate('默认展示模式', key, { mode: modeTypeMap[key] }))
  }

  result['年/月模式切换'] = utils.options.switch().map(item => (
    simpleTemplate('年/月模式切换', item.label, { useModeSwitch: item.value, })))

  result['月份切换'] = utils.options.switch().map(item => (
    simpleTemplate('月份切换', item.label, { useMonthSelect: item.value, })))

  result['年份切换'] = utils.options.switch().map(item => (
    simpleTemplate('年份切换', item.label, { useYearSelect: item.value, })))

  return result;
});

