
import { defineDataSet } from "ai-dataset";
import { Data, ShapeEnum, SizeEnum, TypeEnum } from './constants';

const sizeMap = {
  "大": SizeEnum.Large,
  "中等": SizeEnum.Middle,
  "小": SizeEnum.Small
}

const btnTypeMap = {
  '主按钮': TypeEnum.Primary,
  '次按钮': TypeEnum.Default,
  '虚线按钮': TypeEnum.Dashed,
  '链接按钮': TypeEnum.Link,
  '文字按钮': TypeEnum.Text
}

const shapeMap = {
  '默认': ShapeEnum.Default,
  '(椭)圆': ShapeEnum.Circle,
  '圆角矩形': ShapeEnum.Round
}
export default defineDataSet((utils)  => { 
  const result = {}
  let text = utils.string.alpha(10)

  result['文字标题'] = {
    "Q": `将文字标题设置为${text}`,
    "A": {
      "data": {
        "text": text,
        "asMapArea": false
      }
    }
  }

  result['作为热区使用'] =[true, false].map(item => ({
    "Q": `将作为热区使用设置为${item? '开启':'关闭'}`,
    "A": {
      "data": {
        "asMapArea": item,
      }
    }
  })) 

  result['尺寸'] =[] 
  for(let key in sizeMap) {
    result['尺寸'].push({
      "Q": `将尺寸设置为${key}`,
      "A": {
        "data": {
          "size": sizeMap[key]
        }
      }
    })
  }
  
  result['风格'] =[] 
  for(let key in btnTypeMap) {
    result['风格'].push({
      "Q": `将风格设置为${key}`,
      "A": {
        "data": {
          "allType": btnTypeMap[key]
        }
      }
    })
  }

  result['危险按钮'] =[true, false].map(item => ({
    "Q": `将危险按钮设置为${item? '开启':'关闭'}`,
    "A": {
      "data": {
        "danger": item,
      }
    }
  })) 

  result['形状'] =[] 
  for(let key in shapeMap) {
    result['形状'].push({
      "Q": `将按钮形状设置为${key}`,
      "A": {
        "data": {
          "allShape": shapeMap[key]
        }
      }
    })
  } 


  return result
})
