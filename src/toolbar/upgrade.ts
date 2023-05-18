import { Data } from './types';

export default function ({ 
  data,
  output
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

  //1.0.0->1.0.1
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

  //1.0.5->1.0.6, 增加动态设置loading开关
  data.btnList.forEach((item)=>{
    if(typeof item.loading === 'undefined'){
      item.loading = false
    }
    if(typeof item.useDynamicLoading === 'undefined'){
      item.useDynamicLoading = false
    }
  })

  /**
   * @description v1.0.5 , fix setSchema问题
  */
  const click = output.get('btn0');
  const dbClick = output.get('doubleClick_btn0');
  data.btnList.forEach((item)=>{
    if(typeof item.dataType === 'number'){
      click.setSchema({
        type: 'number'
      });
      dbClick.setSchema({
        type: 'number'
      });
    }
  })
  
  return true;
}