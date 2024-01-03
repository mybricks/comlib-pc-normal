
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
    let content = utils.string.alpha(20)
    result['对齐方式'] =[] 
    
    for(let key in layoutMap) {
      result['对齐方式'].push({
        "Q": `将工具条的对齐方式设置为${key}`,
        "A": {
          "layout": layoutMap[key]
        }
      })
    }
    result['间距'] = []
    const horSpace= utils.number.int({min: 0})
    const verSpace= utils.number.int({min: 0})
    for(let key in spaceMap) {
      result['间距'].push({
        "Q": `将工具条的${spaceMap[key]}间距设置为${key}`,
        "A": {
          "spaceSize": [horSpace, verSpace],
        }
      })
    }

    result['尺寸'] =[] 
    for(let key in sizeMap) {
      result['尺寸'].push({
        "Q": `将工具条的尺寸设置为${key}`,
        "A": {
          "allSize": sizeMap[key]
        }
      })
    }
    
    result['风格'] =[] 
    for(let key in btnTypeMap) {
      result['风格'].push({
        "Q": `将工具条的按钮风格设置为${key}`,
        "A": {
          "allType": btnTypeMap[key]
        }
      })
    }

    result['危险按钮'] =[true, false].map(item => ({
      "Q": `将工具条的危险按钮设置为${item? '开启':'关闭'}`,
      "A": {
        "allDanger": item,
      }
    })) 

    result['形状'] =[] 
    for(let key in shapeMap) {
      result['形状'].push({
        "Q": `将工具条的按钮形状设置为${key}`,
        "A": {
          "allShape": shapeMap[key]
        }
      })
    }
    const maxNumber = utils.number.int({min: 0})
    
    result['最大显示数量'] = {
      "Q": `将工具条的最大显示数量设置为${maxNumber}`,
      "A": {
        "maxShowNumber": maxNumber,
      }
    }
    result['省略'] =[true, false].map(item => ({
      "Q": `将工具条的省略配置设置为${item? '开启':'关闭'}`,
      "A": {
        "useEllipses": item,
      }
    })) 

    return result
  }
)
