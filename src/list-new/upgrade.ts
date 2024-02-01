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

  /**
    * @description v1.0.13->1.0.14 添加crud、上移、下移
  */
  //1、添加一项
  const itemSchema = {
    type: "object",
    properties: {
      index: {
        type: "number"
      },
      value: {
        type: "any"
      }
    }
  };
  if (!output.get('addItemDone')) {
    output.add('addItemDone', '添加一项完成', itemSchema);
  }
  if (!input.get('addItem')) {
    input.add('addItem', '添加一项', itemSchema);
    input.get('addItem').setRels(['addItemDone']);
  }
  //2、删除一项
  if (!output.get('removeItemDone')) {
    output.add('removeItemDone', '删除一项完成', {type: 'number'});
  }
  if (!input.get('removeItem')) {
    input.add('removeItem', '删除一项', {type: 'number'});
    input.get('removeItem').setRels(['removeItemDone']);
  }
  //3、改动一项
  if (!output.get('changeItemDone')) {
    output.add('changeItemDone', '修改一项(根据index)', itemSchema);
  }
  if (!input.get('changeItem')) {
    input.add('changeItem', '修改一项(根据index)完成', itemSchema);
    input.get('changeItem').setRels(['changeItemDone']);
  }
  //4、上移
  if (!output.get('moveUpDone')) {
    output.add('moveUpDone', '上移完成', {type: 'number'});
  }
  if (!input.get('moveUp')) {
    input.add('moveUp', '上移', {type: 'number'});
    input.get('moveUp').setRels(['moveUpDone']);
  }
  //5、下移
  if (!output.get('moveDownDone')) {
    output.add('moveDownDone', '下移完成', {type: 'number'});
  }
  if (!input.get('moveDown')) {
    input.add('moveDown', '下移', {type: 'number'});
    input.get('moveDown').setRels(['moveDownDone']);
  }

  //1.0.14 -> 1.0.15 新增设置数据源完成、loading完成
  const dataSchema = {
    title: "列表数据",
    type: "array",
    items: {
      title: "列项数据",
      type: "any"
    }
  };

  if (!output.get("setDataSourceDone")) {
    output.add("setDataSourceDone", '设置数据源完成', dataSchema);
  }
  if (output.get("setDataSourceDone") &&
    input.get("dataSource") &&
    !input.get("dataSource")?.rels?.includes("setDataSourceDone")) {
    input.get("dataSource").setRels(["setDataSourceDone"]);
  }

  if(data.useLoading && !output.get("setLoadingDone") && input.get("loading")){
    output.add("setLoadingDone", '设置loading完成', { type: 'boolean' });
    input.get("loading").setRels(["setLoadingDone"]);
  }

  return true;
}