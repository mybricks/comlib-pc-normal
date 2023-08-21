import { Data } from './types';
import { uuid } from '../utils';

export default function ({ 
  data,
  output,
  setDeclaredStyle,
  id
}: UpgradeParams<Data>): boolean {
  //1.0.0 ->1.0.1，增加提示内容
  if(typeof data.content === "undefined"){
    data.content = "下拉菜单";
  };
  
  //1.0.2->1.0.3 添加触发方式，输出值schema
  if(typeof data.trigger === "undefined"){
    data.trigger = "hover";
  };
  const outputSchema = {
    "type": "object",
    "properties": {
      "label": {
        "type": "string"
      },
      "link": {
        "type": "string"
      }
    }
  }
  output.get("onChange").setSchema(outputSchema);

  data.options.map((item)=>{
    if(item.value){
      item.link = item.value
    }
    if(!item.useIcon){
      item.useIcon = false
    }
    if(!item.icon){
      item.icon = "HomeOutlined"
    }
    if(!item.iconColor){
      item.iconColor = "rgba(0, 0, 0, 0.85)"
    }
  })

  //1.0.6->1.0.7 添加唯一标识
  const newOutputSchema = {
    "type": "object",
    "properties": {
      "label": {
        "type": "string"
      },
      "link": {
        "type": "string"
      },
      "key": {
        "type": "string"
      }
    }
  }
  output.get("onChange").setSchema(newOutputSchema);
  
  data.options.map((item)=>{
    if(!item.key){
      item.key = uuid()
    }
  })

  //1.0.7->1.0.8 样式处理及增加isChildCustom
  if(typeof data.isChildCustom === "undefined"){
    data.isChildCustom = false;
  };
  data.options.map((item)=>{
    if(item.iconColor!==''){
      setDeclaredStyle(`.${id} li[data-menu-item="${item.key}"]`, {color: item.iconColor});
      item.iconColor = ''
    }
  })
  return true;
}