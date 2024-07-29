import { Data } from './types';
import { uuid } from '../utils';
import { InputIds } from './constants';

export default function ({ 
  data,
  output,
  input,
  setDeclaredStyle,
  getDeclaredStyle,
  removeDeclaredStyle,
  id,
  slot
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
      setDeclaredStyle(`.{id} li[data-menu-item="${item.key}"]`, {color: item.iconColor});
      item.iconColor = ''
    }
  })

  //1.0.15->1.0.16 下拉菜单 动态选项 isDynamic
  if(typeof data.isDynamic === "undefined"){
    data.isDynamic = false;
  };

  const hasSlot = !!slot.get("item");
  !hasSlot && slot.add({id: "item", title: "选项", type: "scope"});
  slot
    .get("item")
    .inputs.add("itemData", "当前项", {
      type: 'any'
    })
  
  slot
    .get("item")
    .inputs.add("index", "当前项序号", {
      type: 'number'
  })

  //1.0.16->1.0.17 fix下拉菜单 动态选项 
  if(typeof data.dynamicOptions === "undefined"){
    data.dynamicOptions = [];
  };

  /**
  * @description v1.0.24 -> v1.0.25
  */
  const onChangeSchema = {
    "type": "object",
    "properties": {
      "label": {
        "type": "string",
        "description": "点击项标签"
      },
      "link": {
        "type": "string",
        "description": "点击项链接"
      },
      "key": {
        "type": "string",
        "description": "点击项唯一标识"
      }
    }
  }
  const oldSchema = output.get("onChange").schema;
  if(oldSchema !== onChangeSchema){
    output.get("onChange").setSchema(onChangeSchema);
  }
  //=========== v1.0.25 end ===============

  /**
  * @description v1.0.25 -> v1.0.26
  */
  const preContentStyle = getDeclaredStyle(`.ant-dropdown-trigger`);
  const preActionStyle = getDeclaredStyle(`.anticon-down`);

  const preContentHoverStyle = getDeclaredStyle(`.ant-dropdown-trigger:hover`);
  const preActionHoverStyle = getDeclaredStyle(`.ant-dropdown-trigger:hover .anticon-down`);


  if (preContentStyle) {
    let contentCss = { ...preContentStyle.css };
    removeDeclaredStyle(`.ant-dropdown-trigger`);
    setDeclaredStyle('.{id} .ant-dropdown-trigger', contentCss, true);
  }
    
  if (preActionStyle) {
    let actionCss = { ...preActionStyle.css };
    removeDeclaredStyle(`.anticon-down`);
    setDeclaredStyle('.{id} .anticon-down', actionCss, true);
  }

  if (preContentHoverStyle) {
    let contentHoverCss = { ...preContentHoverStyle.css };
    removeDeclaredStyle(`.ant-dropdown-trigger:hover`);
    setDeclaredStyle('.{id} .ant-dropdown-trigger:hover', contentHoverCss, true);
  }

  if (preActionHoverStyle) {
    let actionHoverCss = { ...preActionHoverStyle.css };
    removeDeclaredStyle(`.ant-dropdown-trigger:hover .anticon-down`);
    setDeclaredStyle('.{id} .ant-dropdown-trigger:hover .anticon-down', actionHoverCss, true);
  }

  //=========== v1.0.26 end ===============

  if (!input.get(InputIds.DynamicallyModifySubitems)) {
    input.add({
      id: 'dynamicallyModifySubitems',
      title: '设置子项属性',
      desc: '动态设置子项属性',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            key: {
              type: 'string',
              description: '唯一标识 必需'
            },
            label: {
              type: 'string',
              description: '标签'
            },
            link: {
              type: 'string',
              description: '链接'
            },
            disabled: {
              type: 'boolean',
              description: '是否禁用'
            }
          }
        }
      }
    });
  }

  /**
   * @description v1.0.29 新增禁止冒泡开关
  */

  if(typeof data.eventBubble === 'undefined') {
    data.eventBubble = false
  }

  //=========== v1.0.29 end ===============
  
  return true;
}