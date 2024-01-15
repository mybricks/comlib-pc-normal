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

export const getNewItem = (utils) => {
  const id = uuid();
  const random = utils.lorem.word({ length: { min: 0, max: 5 } });
  const title = `节点-${random}`;
  return {
    id,
    title,
    subTitle: '副标题',
    description: '描述',
    color: '#326bfb'
  };
};
export default defineDataSet((utils) => {
  const result = {};

  result['动态数据'] = utils.options.switch().map(item => (
    simpleTemplate('动态数据', item.label, { showLine: item.value, })))

  result['自定义节点内容'] = utils.options.switch().map(item => (
    simpleTemplate('自定义节点内容', item.label,
      {
        useContentSlot: item.value,
        ...(item.value ? { isDynamic: true } : {})
      }
    )))

  let num = utils.number.int({ min: 0, max: 10 })
  const timelineArr = new Array(num).fill(0).map(i => getNewItem(utils))

  result['添加时间轴节点'] = [
    {
      Q: `添加${num}时间轴节点`,
      A: {
        data: {
          timelines: timelineArr,
        }
      }
    }
  ]
  // TODO:更新单个节点内容
  return result;
});

