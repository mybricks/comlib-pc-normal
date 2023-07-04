import { Data } from './constants';
import { getFilterSelector } from '../utils/cssSelector'

export default function ({ 
  id,
  data,
  slot,
  setDeclaredStyle
}: UpgradeParams<Data>): boolean {
  //1.0.2 ->1.0.3，去除 { "id": "extra", "title": "卡片操作容器" }
  //如果不开启卡片右上角操作，且有“extra”插槽时，去除这个插槽
  if(!data.useExtra && slot.get('extra')){
    slot.remove('extra');
  }
  //1.0.2 ->1.0.3，增加点击输出
  if(data.outputContent === ""){
    data.outputContent = 0;
  };
  if(typeof data.dataType === "undefined"){
    data.dataType = "number";
  };

  //1.0.8 -> 1.0.9 增加卡片边框
  if(typeof data.borderStyle === "undefined"){
    data.borderStyle = {
      "borderRadius": "2px 2px 2px 2px",
      "borderColor": "#F0F0F0 #F0F0F0 #F0F0F0 #F0F0F0",
      "borderWidth": "1px 1px 1px 1px",
      "borderStyle": "solid solid solid solid"
    };
  };

  //1.0.9 -> 1.0.10 增加卡片内边距、标题字体、操作项配置、style改造
  if(typeof data.padding === "undefined" ){
    data.padding = "24px"
  }
  if(typeof data.isAction === "undefined" ){
    data.isAction = false
  }
  if(typeof data.items === "undefined"){
    data.items = [
      {
        "key": "key1",
        "name": "操作项1"
      }
    ]
  }

  //兼容之前卡片边框的颜色
  if(data.bordered){
    setDeclaredStyle(`.card > .ant-card${getFilterSelector(id)}`, data.borderStyle);
  }
  
  return true;
}