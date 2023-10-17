import { Data, OutputIds, Schemas } from './constants';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
  /**
    * @description v1.0.3 增加列表项数据唯一标识
  */

  if (typeof data.rowKey === "undefined") {
    data.rowKey = "";
  };
  /**
    * @description v1.0.6 增加移动端列数控制
  */

  if (typeof data?.grid?.mobileColumn === "undefined") {
    if (typeof data?.grid === 'undefined') {
      data.grid = {} as any
    }
    data.grid.mobileColumn = 1;
  };

  /**
    * @description v1.0.7->1.0.8 增加换行情况下，排列方式，默认纵向
  */
 if(typeof data.layout === "undefined"){
    data.layout = "vertical"
 }

  /**
    * @description v1.0.11->1.0.12 已经是排序情况下，添加事件
  */
 if(data.canSort){
  output.add(OutputIds.SortComplete, '拖拽完成', Schemas.Array);
 }

  /**
    * @description v1.0.12->1.0.13 添加响应式布局，横向滚动时子项的宽度
  */
 if(typeof data.isResponsive === "undefined"){
    data.isResponsive = false
 }
 if(typeof data.bootstrap === "undefined"){
    data.bootstrap = [1,2,4,4,6,3]
 }
 if(typeof data.itemWidth === "undefined"){
    data.itemWidth = "100%"
 }
 if(typeof data.isCustomPoints === "undefined"){
    data.isCustomPoints = false
 }
 if(typeof data.customOptions === "undefined"){
    data.customOptions = [
      {
        point: 576,
        relation: "<",
        columns: 1
      },
      {
        point: 576,
        relation: "≥",
        columns: 2
      },
      {
        point: 768,
        relation: "≥",
        columns: 4
      },
      {
        point: 992,
        relation: "≥",
        columns: 4
      },
      {
        point: 1200,
        relation: "≥",
        columns: 6
      },
      {
        point: 1600,
        relation: "≥",
        columns: 3
      }
    ]
 }

  return true;
}