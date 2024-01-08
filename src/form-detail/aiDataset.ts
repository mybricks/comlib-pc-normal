import { defineDataSet } from "ai-dataset";
import { unitConversion } from "src/utils";
import { uuid } from '../utils';
import { Data, Item, InputIds, TypeEnum } from './constants';

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

  result['显示冒号'] = utils.options.switch().map(item => (
    simpleTemplate('显示冒号', item.label, { colon: item.value, })))

  result['显示标题'] = utils.options.switch().map(item => (
    simpleTemplate('显示标题', item.label, { showTitle: item.value, })))

  let title = utils.lorem.word(10)
  result['标题'] = [simpleTemplate('标题', title, { title, showTitle: true })]

  result['右上角操作区'] = utils.options.switch().map(item => (
    simpleTemplate('右上角操作区', item.label,
      {
        showExtra: item.value,
      }
    )))
  const column = utils.number.int({ min: 1, max: 12 })
  result['列数'] = [simpleTemplate('列数', column, { column })]

  const mobileColumn = utils.number.int({ min: 1, max: 12 })
  result['移动端列数'] = [simpleTemplate('移动端列数', mobileColumn, { mobileColumn })]

  let num = utils.number.int({ min: 1, max: 10 })
  const itemArr = new Array(num).fill(0).map(i => createItem())

  result['增加描述项'] = [
    {
      Q: `添加${num}个描述项`,
      A: {
        data: {
          items: itemArr,
        }
      }
    }
  ]
  return result;
});


function createItem() {
  const id = uuid()
  return {
    id,
    label: `描述项${id.slice(0, 8)}`,
    key: id,
    showLabel: true,
    value: `field${id.slice(0, 8)}`,
    span: 1,
    type: TypeEnum.Text,
    direction: 'horizontal',
    useSuffix: false,
    suffixBtnText: '查看更多',
    schema: {
      type: 'string'
    },
    labelDesc: ''
  }
}