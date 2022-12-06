import { Data } from './types';

export default function ({ 
  data
}: UpgradeParams<Data>): boolean {
  //1.0.2 ->1.0.3，去除 { "id": "extra", "title": "卡片操作容器" }
  data.btnList.forEach((item) => {
    if(typeof item.dataType === "undefined"){
      item.dataType = "number";
    };
    if(typeof item.outVal === "undefined"){
      item.outVal = 0;
    };
    if(typeof item.inVal === "undefined"){
      item.outVal = "";
    }
  })

  //外网1.0.0->1.0.1
  //内网1.0.3->1.0.4, isCustom，自定义; src, 图片上传地址; contentSize, 图片尺寸
  data.btnList.forEach(function(item){
    if(typeof item.isCustom === 'undefined'){
      item.isCustom = false;
    }
    if(typeof item.src === 'undefined'){
      item.src = ""
    }
    if(typeof item.contentSize === 'undefined'){
      item.contentSize = [14, 14];
    }
  })
  return true;
}