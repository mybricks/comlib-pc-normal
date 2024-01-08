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
const dataSourceTypeMap = {
  '静态配置': 'default',
  '动态输入(数组)': 'array',
  '动态输入(对象)': 'object'
}


export default defineDataSet((utils) => {
  const result = {};

  result['数据源'] = []
  for (let key in dataSourceTypeMap) {
    result['数据源'].push(
      simpleTemplate('数据源', key, { type: dataSourceTypeMap[key] }))
  }

  let collapsedDepth = utils.number.int({ min: -1, max: 20 })
  result['默认展开深度'] = [simpleTemplate('默认展开深度', collapsedDepth, { collapsed: collapsedDepth })]

  let collapseStringsAfterLength = utils.number.int({ min: 0, max: 100 })
  result['字符串长度限制'] = [simpleTemplate('字符串长度限制', collapseStringsAfterLength, { collapseStringsAfterLength })]

  result['大小标记'] = utils.options.switch().map(item => (
    simpleTemplate('大小标记', item.label, { displayObjectSize: item.value, })))

  result['单击节点复制'] = utils.options.switch().map(item => (
    simpleTemplate('自定义进度值', item.label,
      {
        enableClipboard: item.value,
      }
    )))

  result['复制节点数据键值对'] = utils.options.switch().map(item => (
    simpleTemplate('复制节点数据键值对', item.label,
      {
        copyValueWithLabel: item.value,
        ...(item.value ? { enaleClipboard: true } : {})
      }
    )))

  const json = {
    image: utils.image.url(),
    companyName: utils.company.name(),
    extra: utils.company.buzzAdjective,
  }
  result['默认JSON数据'] = [simpleTemplate('默认JSON数据', json, {
    json,
    dataSourceType: 'default'
  })]
  return result;
});

