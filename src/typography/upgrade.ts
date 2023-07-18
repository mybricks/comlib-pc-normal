import { Data } from "./constants";
import { isEmptyObject } from '../utils'

export default function ({
  data,
  input,
  output,
  setDeclaredStyle
}: UpgradeParams<Data>): boolean {
  data.items.forEach(item => {

    //1.0.0 -> 1.0.1
    const { style = {} } = item;
    const fontWeightMap = {
      normal: 400,
      bold: 700
    };
    if (typeof style.lineHeight === 'number') {
      style.lineHeight = parseInt(style.fontSize) * style.lineHeight + 'px';
    }
    if (typeof style.fontWeight === 'string') {
      style.fontWeight = fontWeightMap[style.fontWeight]
    }

  });

  //1.0.3 -> 1.0.4 style升级，文本排版的边框和内容文字的颜色
  if(!isEmptyObject(data.style)){
    setDeclaredStyle('.container', {...data.style});
    data.style = {}
  }
  data.items.forEach((item) => {
    if(!isEmptyObject(item.style)){
      setDeclaredStyle(`.${item.key}`, {...item.style});
      item.style = {}
    }
  })

  //1.0.4 -> 1.0.5 动态输入数据，单击获取子项内容
  if(typeof data.isUnity === 'undefined'){
    data.isUnity = false
  }
  const dataSchema = {
    "title": "文本数据",
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "content": {
          "title": "内容",
          "type": "string"
        },
        "key": {
          "title": "唯一标识",
          "type": "string"
        },
        "type": {
          "title": "类型",
          "type": "string"
        },
        "stylePadding":{
          "type":"array",
          "items": {
            "type": "number"
          }
        },
        "link": {
          "title": "链接",
          "type": "string"
        }
      }
    }
  }
  if (!input.get('setData')) {
    input.add('setData', '设置数据', dataSchema);
  }

  const clickSchema = {
    "type": "object",
    "properties": {
      "content": {
        "title": "内容",
        "type": "string"
      },
      "key": {
        "title": "唯一标识",
        "type": "string"
      },
      "type": {
        "title": "类型",
        "type": "string"
      },
      "link": {
        "title": "链接",
        "type": "string"
      }
    }
  }
  if (!output.get('click')) {
    output.add('click', '单击', clickSchema);
  }

  return true;
}