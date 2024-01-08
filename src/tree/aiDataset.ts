import { defineDataSet } from "ai-dataset";
import { unitConversion } from "src/utils";
import {
  ValueType
} from './types';
const valueTypeMap = {
  '标识字段': ValueType.KEY_FIELD,
  '节点数据': ValueType.TREE_NODE
}

const checkableMap = {
  '不开启': false,
  '全部节点': true,
  '自定义节点': 'custom'
}

const dropScopeMap = {
  "任意": false,
  "当前父节点": "parent"
}
const filterOptions = [
  { label: '标题', value: 'byTitle' },
  { label: '值', value: 'byKey' }
]

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

  result['显示连线'] = utils.options.switch().map(item => (
    simpleTemplate('显示连线', item.label, { showLine: item.value, })))

  const scrollHeight = utils.number.int({ min: 0, max: 100 }) + 'px'
  result['可滚动高度'] = [simpleTemplate('可滚动高度', scrollHeight, {
    scrollHeight: unitConversion(scrollHeight)
  })]

  const titleFieldName = utils.lorem.word(6)
  result['标题字段'] = [
    {
      Q: `将标题字段设置为${titleFieldName}`,
      A: {
        data: {
          titleFieldName,
        }
      }
    }
  ]

  const keyFieldName = utils.lorem.word(6)
  result['标识字段'] = [simpleTemplate('标识字段', keyFieldName, { keyFieldName })]
  const childrenFieldName = utils.lorem.word(6)
  result['子节点字段'] = [simpleTemplate('子节点字段', childrenFieldName, { childrenFieldName })]


  result['输出数据'] = []
  for (let key in valueTypeMap) {
    result['输出数据'].push(
      simpleTemplate('输出数据', key, {
        valueType: valueTypeMap[key]
      })
    )
  }

  result['标题超出省略'] = utils.options.switch().map(item => (
    simpleTemplate('标题超出省略', item.label, { titleEllipsis: item.value, })
  ))

  const openDepth = utils.number.int({ min: -1, max: 20 })
  result['默认展开深度'] = [simpleTemplate('默认展开深度', openDepth, { openDepth })]

  result['自定义空状态图片'] = utils.options.switch().map(item => (simpleTemplate('自定义空状态图片', item.label, { isImage: item.value, })))

  const image = utils.image.url()
  result['图片地址'] = [simpleTemplate('图片地址', image, { image })]
  const description = utils.lorem.word(6)
  result['空状态文案'] = [simpleTemplate('空状态文案', description, { description })]

  result['使用静态数据源'] = utils.options.switch().map(item => (simpleTemplate('使用静态数据源', item.label, { useStaticData: item.value, })))

  // result['树组件的默认数据'] = []

  let randomCount = utils.number.int({ min: 1, max: 2 })
  let selectedOptions = utils.options.multipleSelect(filterOptions, randomCount)
  console.log('selectedOPtions', selectedOptions)
  result['过滤功能'] = simpleTemplate('过滤字段', selectedOptions.map(i => i.label).join(','), {
    filterNames: selectedOptions.map(i => i.value)
  })

  result['勾选功能'] = []
  for (let key in checkableMap) {
    result['勾选功能'].push(
      simpleTemplate('勾选功能', key, { checkable: checkableMap[key] }))
  }

  result['拖拽功能'] = []
  for (let key in checkableMap) {
    result['拖拽功能'].push(
      simpleTemplate('拖拽功能', key, { checkable: checkableMap[key] }))
  }

  result['支持放置'] = []
  for (let key in checkableMap) {
    result['支持放置'].push(
      simpleTemplate('支持放置', key, { checkable: checkableMap[key] }))
  }

  result['放置范围限制'] = []
  for (let key in dropScopeMap) {
    result['放置范围限制'].push(
      simpleTemplate('放置范围限制', key, { useDropScope: dropScopeMap[key] }))
  }

  result['禁用勾选框'] = utils.options.switch().map(i => simpleTemplate('禁用勾选框', i.label, {
    disableCheckbox: i.value
  }))

  result['父子节点勾选联动'] = []

  result['父子节点勾选联动'].push(...utils.options.switch().map(i => simpleTemplate('全部节点下的父子节点勾选联动', i.label, {
    disableCheckbox: i.value,
    checkable: true
  })))

  result['父子节点勾选联动'].push(...utils.options.switch().map(i => simpleTemplate('自定义节点下的父子节点勾选联动', i.label, {
    disableCheckbox: i.value,
    checkable: 'custom'
  })))
  return result;
});

