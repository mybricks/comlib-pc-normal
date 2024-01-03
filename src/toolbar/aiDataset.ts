
import { defineDataSet } from "ai-dataset";
import { Data, ShapeEnum, SizeEnum, TypeEnum, AlignEnum } from './types';
import { getNewBtn } from "./utils";
import { sizeMap, shapeMap, btnTypeMap } from "src/button/constants";
const layoutMap = {
  "居左": AlignEnum.FlexStart,
  "居中": AlignEnum.Center,
  "居右": AlignEnum.FlexEnd
}

const spaceMap = {
  "水平": [4, 4], "垂直": [4, 4]
}

export default defineDataSet((utils)  => { 
    const result = {}
    result['对齐方式'] =[] 
    
    for(let key in layoutMap) {
      result['对齐方式'].push({
        "Q": `将对齐方式设置为${key}`,
        "A": {
          "layout": layoutMap[key]
        }
      })
    }
    result['间距'] = []
    const horSpace= utils.number.int({ min: 0, max: 300 })
    const verSpace= utils.number.int({ min: 0, max: 300 })
    // TODO:wf, 水平垂直一起改
    for(let key in spaceMap) {
      result['间距'].push({
        "Q": `将${spaceMap[key]}间距设置为${key}`,
        "A": {
          "spaceSize": [horSpace, verSpace],
        }
      })
    }

    result['尺寸'] =[] 
    for(let key in sizeMap) {
      result['尺寸'].push({
        "Q": `将尺寸设置为${key}`,
        "A": {
          "allSize": sizeMap[key]
        }
      })
    }
    
    result['风格'] =[] 
    for(let key in btnTypeMap) {
      result['风格'].push({
        "Q": `将按钮风格设置为${key}`,
        "A": {
          "allType": btnTypeMap[key]
        }
      })
    }

    result['危险按钮'] =[true, false].map(item => ({
      "Q": `将危险按钮设置为${item? '开启':'关闭'}`,
      "A": {
        "allDanger": item,
      }
    })) 

    result['形状'] =[] 
    for(let key in shapeMap) {
      result['形状'].push({
        "Q": `将按钮形状设置为${key}`,
        "A": {
          "allShape": shapeMap[key]
        }
      })
    }
    const maxNumber = utils.number.int({min: 0})
    
    result['最大显示数量'] = {
      "Q": `将最大显示数量设置为${maxNumber}`,
      "A": {
        "maxShowNumber": maxNumber,
      }
    }
    result['省略'] =[true, false].map(item => ({
      "Q": `将省略设置为${item? '开启':'关闭'}`,
      "A": {
        "useEllipses": item,
      }
    })) 

    /** 动态添加部分 */
    let num = utils.number.int({ max: 10 })
    let btnArr = new Array(num).fill(0).map(i => getNewBtn())
    result['添加按钮'] = {
      "Q": `添加${num}个按钮`,
      "A": {
        "btnList": btnArr,
      }
    }

    let num2 = utils.number.int({ max: 10 })
    let btnArr2 = new Array(num).fill(0).map(i => ({ ...getNewBtn(), text: `自定义插槽${utils.string.sample(5)}`, isSlot: true }))
    result['添加插槽'] = {
      "Q": `添加${num2}个插槽`,
      "A": {
        "btnList": btnArr2,
      }
    }

    /** 更改工具条内某个按钮的属性 */
    const index = utils.number.int({ max: 10})
    let btnText = utils.string.alpha(10)
    // 按钮名称text, 风格 type，尺寸 size
    result['名称'] = {
      "Q": `将第${index}个按钮的名称设置为${btnText}`,
      /** TODO:wf,确认A描述,以下几个同样的更改 */
      "A": {
        btnList: {
          index: index,
          data: {
            "text": btnText
          }
        }
      }
    }
    result['尺寸'] = []
    for(let key in sizeMap) {
      result['尺寸'].push({
        "Q": `将第${index}个按钮的尺寸设置为${key}`,
        "A": {
          btnList: {
            index: index,
            data: {
              "size": sizeMap[key]
            }
          }
        }
      })
    }
    result['风格'] = []
    for(let key in sizeMap) {
      result['风格'].push({
        "Q": `将第${index}个按钮的风格设置为${key}`,
        "A": {
          btnList: {
            index: index,
            data: {
              "size": sizeMap[key]
            }
          }
        }
      })
    }
    result['危险按钮'] = {
      "Q": `将第${index}个按钮设置为危险按钮`,
      "A": {
        btnList: {
          index: index,
          data: {
            "danger": true
          }
        }
      }
    }
    for(let key in shapeMap) {
      result['形状'].push({
        "Q": `将第${index}个按钮的形状设置为${key}`,
        "A": {
          btnList: {
            index: index,
            data: {
              "shape": shapeMap[key]
            }
          }
        }
      })
    }
    // TODO

    return result
  }
)