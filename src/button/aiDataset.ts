
import { defineDataSet } from "ai-dataset";
import { Data, ShapeEnum, SizeEnum, TypeEnum, AlignEnum } from './types';

const layoutMap = {
  "居左": AlignEnum.FlexStart,
  "居中": AlignEnum.Center,
  "居右": AlignEnum.FlexEnd
}

const spaceMap = {
  "水平": [4, 4], "垂直": [4, 4]
}
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
      "Q": `将按钮的文字标题设置为${text}`,
      "A": {
        "text": text,
        "asMapArea": false
      }
    }

    result['作为热区使用'] =[true, false].map(item => ({
      "Q": `将按钮的作为热区使用设置为${item? '开启':'关闭'}`,
      "A": {
        "asMapArea": item,
      }
    })) 
    result['对齐方式'] =[] 
    
    for(let key in layoutMap) {
      result['对齐方式'].push({
        "Q": `将按钮的对齐方式设置为${key}`,
        "A": {
          "layout": layoutMap[key]
        }
      })
    }

    result['尺寸'] =[] 
    for(let key in sizeMap) {
      result['尺寸'].push({
        "Q": `将按钮的尺寸设置为${key}`,
        "A": {
          "size": sizeMap[key]
        }
      })
    }
    
    result['风格'] =[] 
    for(let key in btnTypeMap) {
      result['风格'].push({
        "Q": `将按钮的风格设置为${key}`,
        "A": {
          "allType": btnTypeMap[key]
        }
      })
    }

    result['危险按钮'] =[true, false].map(item => ({
      "Q": `将按钮的危险按钮设置为${item? '开启':'关闭'}`,
      "A": {
        "danger": item,
      }
    })) 

    result['形状'] =[] 
    for(let key in shapeMap) {
      result['形状'].push({
        "Q": `将按钮的按钮形状设置为${key}`,
        "A": {
          "allShape": shapeMap[key]
        }
      })
    } 


    return result
  }
)
