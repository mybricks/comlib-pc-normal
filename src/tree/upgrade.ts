import { InputIds, OutputIds } from "./constants";
import { Data, ValueType } from "./types";
import { refreshSchema } from "./utils";

export default function ({
  data,
  input,
  output
}: UpgradeParams<Data>): boolean {

  const treeDataSchema = {
    "title": "树组件数据",
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "title": {
          "title": "标题",
          "type": "string"
        },
        "key": {
          "title": "字段名",
          "type": "string"
        },
        "children": {
          "title": "子项",
          "type": "array",
          "items": {
            "type": "object"
          }
        }
      }
    }
  };

  /**
  * @description v1.0.6 节点操作项支持省略样式配置
  */
  if (!data.ellipsisActionBtnsConfig) {
    data.ellipsisActionBtnsConfig = {
      useEllipsis: false,
      maxToEllipsis: 3,
      trigger: [
        'click'
      ]
    };
  }
  //=========== v1.0.6 end ===============

  if (!input.get('setSelectedKeys')) {
    input.add('setSelectedKeys', '设置选中项', { type: 'array', items: { type: 'string' } });
  }

  if (!data.hasOwnProperty('removeConfirm')) {
    data.removeConfirm = "确定删除节点{title}吗（子节点也会被删除）？此操作不可恢复！";
  }

  if (!data.hasOwnProperty('editInline')) {
    data.editInline = true
  }

  /**
    * @description v1.0.10 节点支持图标配置
    */
  // if (!data.iconConfig) {
  //   data.iconConfig = {
  //     defaultSrc: false,
  //     size: [14, 14],
  //     gutter: 8
  //   };
  // }
  //=========== v1.0.10 end ===============

  /**
    * @description v1.0.11 操作项增加图标、动态显示表达式配置
    */
  data.actionBtns.forEach(btn => {
    if (!btn.iconConfig) {
      btn.iconConfig = {
        src: false,
        size: [14, 14],
        gutter: 8
      };
    }
  })
  //=========== v1.0.11 end ===============

  /**
    * @description v1.0.12 增加 过滤filter 输入项 和 过滤字段data.filterValue
    */
  if (!input.get('filter')) {
    input.add('filter', '过滤', {
      type: 'string'
    });
  }
  //=========== v1.0.12 end ===============

  /**
    * @description v1.0.17 增加 动态勾选、拖拽、字段配置、输出数据 配置项
    */
  if (data.draggable === undefined) {
    data.draggable = false;
  }
  if (data.allowDrop === undefined) {
    data.allowDrop = true;
  }
  if (data.useDropScope === undefined) {
    data.useDropScope = false;
  }
  if (!data.valueType) {
    data.valueType = ValueType.KEY_FIELD;
  }
  //=========== v1.0.17 end ===============

  /**
    * @description v1.0.18 节点支持动态图标配置
    */
  if (!data.icons && data.iconConfig?.defaultSrc) {
    const { defaultSrc: src, gutter, innerIcon, ...res } = data.iconConfig;
    data.icons = [
      {
        _id: 'default',
        title: '默认图标',
        src,
        gutter: [gutter],
        displayRule: 'default',
        innerIcon: 'FolderOpenOutlined',
        displayExpression: '',
        ...res,
      }
    ];
    data.iconConfig.defaultSrc = false;
  }
  //=========== v1.0.18 end ===============

  /**
    * @description v1.0.19 ref: 设置选中项触发事件输出
    */
  output.get('click').setTitle('节点选中事件');
  //=========== v1.0.19 end ===============

  /**
    * @description v1.0.22 feat: 支持 标题省略样式配置、操作项显示方式 配置项
    */
  if (!data.actionsShowWay) {
    data.actionsShowWay = 'default';
  }
  //=========== v1.0.22 end ===============

  /**
    * @description v1.0.23 feat: 支持 操作项样式，危险按钮开关
    */
  data.actionBtns.forEach((item) => {
    if (typeof item.danger === 'undefined') {
      if (item.type === 'danger') {
        item.danger = true
      } else {
        item.danger = false
      }
    }
  })
  //=========== v1.0.23 end ===============

  /**
   * @description v1.0.23->1.0.24 自定义空白文案和图片
   */
  if (data?.description === undefined) {
    data.description = "暂无数据";
  }
  if (data?.isImage === undefined) {
    data.isImage = false;
  }
  if (data?.image === undefined) {
    data.image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAApCAYAAACFki9MAAAEGWlDQ1BrQ0dDb2xvclNwYWNlR2VuZXJpY1JHQgAAOI2NVV1oHFUUPrtzZyMkzlNsNIV0qD8NJQ2TVjShtLp/3d02bpZJNtoi6GT27s6Yyc44M7v9oU9FUHwx6psUxL+3gCAo9Q/bPrQvlQol2tQgKD60+INQ6Ium65k7M5lpurHeZe58853vnnvuuWfvBei5qliWkRQBFpquLRcy4nOHj4g9K5CEh6AXBqFXUR0rXalMAjZPC3e1W99Dwntf2dXd/p+tt0YdFSBxH2Kz5qgLiI8B8KdVy3YBevqRHz/qWh72Yui3MUDEL3q44WPXw3M+fo1pZuQs4tOIBVVTaoiXEI/MxfhGDPsxsNZfoE1q66ro5aJim3XdoLFw72H+n23BaIXzbcOnz5mfPoTvYVz7KzUl5+FRxEuqkp9G/Ajia219thzg25abkRE/BpDc3pqvphHvRFys2weqvp+krbWKIX7nhDbzLOItiM8358pTwdirqpPFnMF2xLc1WvLyOwTAibpbmvHHcvttU57y5+XqNZrLe3lE/Pq8eUj2fXKfOe3pfOjzhJYtB/yll5SDFcSDiH+hRkH25+L+sdxKEAMZahrlSX8ukqMOWy/jXW2m6M9LDBc31B9LFuv6gVKg/0Szi3KAr1kGq1GMjU/aLbnq6/lRxc4XfJ98hTargX++DbMJBSiYMIe9Ck1YAxFkKEAG3xbYaKmDDgYyFK0UGYpfoWYXG+fAPPI6tJnNwb7ClP7IyF+D+bjOtCpkhz6CFrIa/I6sFtNl8auFXGMTP34sNwI/JhkgEtmDz14ySfaRcTIBInmKPE32kxyyE2Tv+thKbEVePDfW/byMM1Kmm0XdObS7oGD/MypMXFPXrCwOtoYjyyn7BV29/MZfsVzpLDdRtuIZnbpXzvlf+ev8MvYr/Gqk4H/kV/G3csdazLuyTMPsbFhzd1UabQbjFvDRmcWJxR3zcfHkVw9GfpbJmeev9F08WW8uDkaslwX6avlWGU6NRKz0g/SHtCy9J30o/ca9zX3Kfc19zn3BXQKRO8ud477hLnAfc1/G9mrzGlrfexZ5GLdn6ZZrrEohI2wVHhZywjbhUWEy8icMCGNCUdiBlq3r+xafL549HQ5jH+an+1y+LlYBifuxAvRN/lVVVOlwlCkdVm9NOL5BE4wkQ2SMlDZU97hX86EilU/lUmkQUztTE6mx1EEPh7OmdqBtAvv8HdWpbrJS6tJj3n0CWdM6busNzRV3S9KTYhqvNiqWmuroiKgYhshMjmhTh9ptWhsF7970j/SbMrsPE1suR5z7DMC+P/Hs+y7ijrQAlhyAgccjbhjPygfeBTjzhNqy28EdkUh8C+DU9+z2v/oyeH791OncxHOs5y2AtTc7nb/f73TWPkD/qwBnjX8BoJ98VQNcC+8AAAILaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPHRpZmY6Q29tcHJlc3Npb24+MTwvdGlmZjpDb21wcmVzc2lvbj4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6UGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbj4yPC90aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoPRSqTAAAETElEQVRoBe1ZzWsTQRTfTduQprUtIpbaS6k0aaGgB6WebNSrpYIfJz8iehO1HrzopVL/AAuCIIrVk+DBindNL4JejD31y9CD1kOFrKUfaWoSfy9sJIkzu7PZmXQjXRiyu++933vvNzNvZja6JvmamZkZ9vl8/blcrl4mtK7rv9Gme3p63srE9ckEm5ubu44gbyD5LHB1mQ2YmWw2OzI7O3tNZszSsJD8GFpUGiAHCCPsCkgY5Ygdv5YyApD4bfSOPxQKTTiOwKFBb2/vU5jsAgm3HJqqUUePnEMwL9Wg81Hh9xWIP83XqIJkfn7+CAL5UAVXTBcg/iPaYaZQ9Uskvg/Ov6n2Y4ePOH4kEol2Oz3pciSfQWWmSr+tFy23ICFdaRAVFUEkn0DR248lL1epY1l2tD8AVhgxfZWFaYkDtmMoPkctlbZBiHo0iNjeK3UNll/AyXmlTlyAI74LaM9dQPBNkfh9gN/ha3hDgtF5F7GOSY0GiV9FeywVVCEYxUoxi7iwreJg9CQK3iiKjegh5Hs4HH4i4typjplUp4gdVochtHt9fX2WcdsSAKfvAoHAMTQRvxqcptbX16e7u7sHhAwElICpY63/1NTU1I+OEAoklUppGxsbU9g6R6xcCB1ZGxsbtba2NiucYlmAjsMIeBwk3CwWVHq/sLDwEP4Ptba2CkMkk0kiwFa/on2AHSoIC2YymRN2eg7kx0VHoAPMvKoSAhoaGjTUjbDTYHj6wAr5/X6e2NV7JQRgCmjoMQObkyFX0cEYGGeB9RNz3y0U016oBjAtbV52dHTsWVpaeoRacBE9uNtGnSkGkUm0AWDtZSpIeKmMAIoNgXeiEJ1BFa8oVOp1KsAqL6UEUALBYFBl/K6xldQA11FVEUCEgKkqxiPVFUZgzA5QhAA7jJqW7xBQ090nIfidESCBxJqG4O4DVldXD6KKDhuGEa3VDJubmy+tra1hH5Z7g/s4K4+SDTZ2bV04xdERNork8+fflZUVra6uzslxmOWn6u/oOIwtuNbS0pL3DRIM3Ewgl3HsLhcLAeUJMBN/hqQjBUHh938hoJAP/YKMGIi4TET4kHwEvf6ZlTwp08kOBnRbUxfFTLGzLsqVcqZp7sMwoZ7nfu6h4Q9lFo6n31HM9fXcEqdRzmiviaKSOlCeFZ3G0um0trm5WS7y7DN9D9za2qJvEnYx6ro5BSbBBveDGw2n5eVljb7K0NceL1/U88hJa2+3/r8UOf1CHpHiIjgBEgZ5yREJ+Nrr+elAU5aO4MiFlwrVtCnoRakIlmiZq8EILGkZ5I4ILrKHBWaP0zL44J9lkBW3uRE6BcOI1chg2XrlHfU0Yo/hd1JoI2QVOBECOe0Ou0xSaOU4YGVTRdkXxGSYyS7Cb5yXcHlMJVOgXCjyTNMGel1YTokQIonm2N97ejYvIk9oWsGeClS8YGj+xmFvFO6xxtP9YvFwLtMXevwDlMbWTOnXc54AAAAASUVORK5CYII="
  }
  //=========== v1.0.24 end ===============

  /**
    * @description v1.0.25 feat: 支持 过滤字段、可滚动高度 配置
    */

  if (!data.filterNames) {
    data.filterNames = ['byTitle'];
  }

  //=========== v1.0.25 end ===============

  /**
    * @description v1.0.31 feat: 支持 动态配置拖拽 
    */
   const dragSchema = {
    type: 'object',
    properties: {
      draggable: {
        type: 'enum',
        items: [
          {
            type: 'boolean',
          },
          {
            type: 'string',
            value: 'custom',
          },
        ],
      },
      draggableScript: {
        type: 'string',
      },
      allowDrop: {
        type: 'enum',
        items: [
          {
            type: 'boolean',
          },
          {
            type: 'string',
            value: 'custom',
          },
        ],
      },
      allowDropScript: {
        type: 'string',
      },
      useDropScope: {
        type: 'enum',
        items: [
          {
            type: 'boolean',
            value: false,
          },
          {
            type: 'string',
            value: 'parent',
          },
        ],
      },
      dropScopeMessage: {
        type: 'string',
      },
    },
  };

  if (!input.get(InputIds.SetDragConfig)) {
    input.add(InputIds.SetDragConfig, '设置拖拽功能', dragSchema);
  }
  if (!output.get(OutputIds.OnDropDone)) {
    output.add(OutputIds.OnDropDone, '拖拽完成', {
      type: 'object',
    });
    refreshSchema({ data, input, output } as any);
  }

  //=========== v1.0.31 end ===============

  /**
    * @description v1.0.33 增加 展开深度openDepth 配置项、setOpenDepth设置展开深度 输入项
    */

  if (typeof data.openDepth !== "number") {
    data.openDepth = data.defaultExpandAll ? -1 : 0;
    data.defaultExpandAll = undefined;
  }
  if (!input.get(InputIds.SetOpenDepth)) {
    input.add(InputIds.SetOpenDepth, '设置展开深度', {
      type: 'number'
    });
  }

  //=========== v1.0.33 end ===============

  /**
    * @description v1.0.38 增加 setExpandedKeys设置展开节点 输入项
    */

  if (!input.get(InputIds.SetExpandedKeys)) {
    input.add(InputIds.SetExpandedKeys, '设置展开节点', { type: 'array', items: { type: 'string' } });
  }

  //=========== v1.0.38 end ===============

  /**
    * @description v1.0.40 静态数据配置重构, 增加搭建态占位模式
    */

  if (data.useStaticData === undefined) {
    data.useStaticData = true;
  }
  if (!data.staticData) {
    data.staticData = encodeURIComponent(JSON.stringify(data.treeData, null, 2));
    data.treeData = [];
  }

  //=========== v1.0.40 end ===============

  /**
   * @description v1.0.42 增加 getTreeData获取数据 输入项、onChange数据变化 returnTreeData数据输出 输出项
   */

  if (!output.get(OutputIds.OnChange)) {
    output.add(OutputIds.OnChange, '数据变化', treeDataSchema);
  }
  if (!input.get(InputIds.GetTreeData)) {
    input.add(InputIds.GetTreeData, '获取数据', {
      type: 'any'
    });
  }
  if (!output.get(OutputIds.ReturnTreeData)) {
    output.add(OutputIds.ReturnTreeData, '数据输出', treeDataSchema);
  }
  const getTreeDataPin = input.get(InputIds.GetTreeData)
  if (!getTreeDataPin.rels) {
    getTreeDataPin.setRels([OutputIds.ReturnTreeData]);
  }
  //=========== v1.0.42 end ===============

   /**
   * @description v1.0.45 -> v1.0.46 增加rels
   */
  //1、设置数据源
    const dataSchema = {
      title: "树组件数据",
      type: "array",
      items: {
        type: "object",
        properties: {
          title: {
            title: "标题",
            type: "string"
          },
          key: {
            title: "字段名",
            type: "string"
          },
          disableCheckbox: {
            title: "禁用勾选",
            type: "boolean"
          },
          children: {
            title: "子项",
            type: "array",
            items: {
              type: "object"
            }
          }
        }
      }
    }
    if (!output.get("setTreeDataDone")) {
      output.add("setTreeDataDone", "输入数据完成", dataSchema);
    }
    if (output.get("setTreeDataDone") &&
      input.get("treeData") &&
      !input.get("treeData")?.rels?.includes("setTreeDataDone")) {
      input.get("treeData").setRels(["setTreeDataDone"]);
    }

    //2、更新节点数据
    const nodeSchema = {
      type: "object",
      properties: {
        title: {
          type: "string"
        },
        children: {
          "title": "子项",
          "type": "array",
          "items": {
            "type": "object"
          }
        }
      }
    };
    if (!output.get("setNodeDataDone")) {
      output.add("setNodeDataDone", "更新节点数据完成", nodeSchema);
    }
    if (output.get("setNodeDataDone") &&
      input.get("nodeData") &&
      !input.get("nodeData")?.rels?.includes("setNodeDataDone")) {
      input.get("nodeData").setRels(["setNodeDataDone"]);
    }

    //3、搜索
    if (!output.get("searchValueDone")) {
      output.add("searchValueDone", "搜索完成", {type: 'string'});
    }
    if (output.get("searchValueDone") &&
      input.get("searchValue") &&
      !input.get("searchValue")?.rels?.includes("searchValueDone")) {
      input.get("searchValue").setRels(["searchValueDone"]);
    }
    //4、过滤
    if (!output.get("filterDone")) {
      output.add("filterDone", "过滤完成", {type: 'string'});
    }
    if (output.get("filterDone") &&
      input.get("filter") &&
      !input.get("filter")?.rels?.includes("filterDone")) {
      input.get("filter").setRels(["filterDone"]);
    }

    //5、设置选中节点
    const selectSchema = {
      type: "array",
      items: {
        type: "string"
      }
    };
    if (!output.get("setSelectedKeysDone")) {
      output.add("setSelectedKeysDone", "设置选中节点完成", selectSchema);
    }
    if (output.get("setSelectedKeysDone") &&
      input.get("setSelectedKeys") &&
      !input.get("setSelectedKeys")?.rels?.includes("setSelectedKeysDone")) {
      input.get("setSelectedKeys").setRels(["setSelectedKeysDone"]);
    }

    //6、展开节点
    if (!output.get("setExpandedKeysDone")) {
      output.add("setExpandedKeysDone", "设置展开节点完成", selectSchema);
    }
    if (output.get("setExpandedKeysDone") &&
      input.get("setExpandedKeys") &&
      !input.get("setExpandedKeys")?.rels?.includes("setExpandedKeysDone")) {
      input.get("setExpandedKeys").setRels(["setExpandedKeysDone"]);
    }

    //11、展开深度
    if (!output.get("setOpenDepthDone")) {
      output.add("setOpenDepthDone", "设置展开深度", {type: "number"});
    }
    if (output.get("setOpenDepthDone") &&
      input.get("setOpenDepth") &&
      !input.get("setOpenDepth")?.rels?.includes("setOpenDepthDone")) {
      input.get("setOpenDepth").setRels(["setOpenDepthDone"]);
    }

    //10、设置拖拽
    if (!output.get("setDragConfigDone")) {
      output.add("setDragConfigDone", "设置拖拽功能完成", dragSchema);
    }
    if (output.get("setDragConfigDone") &&
      input.get("setDragConfig") &&
      !input.get("setDragConfig")?.rels?.includes("setDragConfigDone")) {
      input.get("setDragConfig").setRels(["setDragConfigDone"]);
    }

    if(data.checkable){
      //7、设置勾选项
      if(!output.get("setCheckedKeysDone") && input.get(InputIds.SetCheckedKeys)){
        output.add({
          id: "setCheckedKeysDone",
          title: '设置勾选项完成',
          schema: {
            type: 'array',
            items: {
              title: '字段名',
              type: 'string'
            }
          }
        });
        input.get(InputIds.SetCheckedKeys).setRels(["setCheckedKeysDone"]);
      }
      //8、禁用勾选框
      if(!output.get("setDisableCheckboxDone") && input.get(InputIds.SetDisableCheckbox)){
        output.add({
          id: "setDisableCheckboxDone",
          title: '禁用勾选框完成',
          schema: {
            type: 'any'
          }
        });
        input.get(InputIds.SetDisableCheckbox).setRels(["setDisableCheckboxDone"]);
      }
      //9、启用勾选框
      if(!output.get("setEnableCheckboxDone") && input.get(InputIds.SetEnableCheckbox)){
        output.add({
          id: "setEnableCheckboxDone",
          title: '启用勾选框完成',
          schema: {
            type: 'any'
          }
        });
        input.get(InputIds.SetEnableCheckbox).setRels(["setEnableCheckboxDone"]);
      }
    }
    //12、提示文案
    if(data.addable && !output.get('addTipsDone') && input.get('addTips')){
      output.add('addTipsDone', '设置添加提示文案完成',{
        type: 'array',
        items: {
          type: 'string'
        }
      })
      input.get('addTips').setRels(['addTipsDone']);
    }
    

  //=========== v1.0.46 end ===============
  return true;
}