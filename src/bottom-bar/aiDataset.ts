
import { defineDataSet } from 'ai-dataset';
import { unitConversion } from 'src/utils';

const layoutMap = {
  '居左': 'flex-start',
  '居中': 'center',
  '居右': 'flex-end'
}
export default defineDataSet((utils) => {
  const result = {}
  result['对齐方式'] = []
  for (let key in layoutMap) {
    result['对齐方式'].push({
      Q: `将对齐方式设置为${key}`,
      A: {
        data: {
          layout: layoutMap[key]
        }
      }
    })
  }
  const height = utils.number.int({ min: 64, max: 200 })
  result['高度'] = [{
    Q: `将高度设置为${height}`,
    A: {
      data: {
        height,
      },
      style: {
        height
      }
    }
  }]

  const width = utils.number.int({ min: 64, max: 200 })
  result['宽度'] = [{
    Q: `将宽度设置为${width}`,
    A: {
      data: {
        width: unitConversion(String(width))
      }
    }
  }]

  const parentId = utils.string.alpha(4)
  result['自定义挂载父节点'] = [{
    Q: `将自定义挂载父节点设置为${parentId}`,
    A: {
      data: {
        parentId,
      }
    }
  }]
  /** TODO:增加按钮、修改按钮内容 */
  result['添加按钮'] = []

  return result
})
