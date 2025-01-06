import { props } from "cypress/types/bluebird";

export const comsMap = {
  "mybricks.normal-pc.dialog": {
    type: "@es/tianhe-basic-materials::Modal",
    name: "弹窗",
    props: {
      "okText": "okText",
      "title": "title",
      "closable": "closable",
      "maskClosable": "closable",
      "cancelText": "cancelText",
      "useFooter": "enabled",
      "width": "width",
    }
  },

  "mybricks.basic-comlib.popup": {
    type: "@es/tianhe-basic-materials::Modal",
    name: "弹窗",
    props: {
      "okText": "okText",
      "title": "title",
      "closable": "closable",
      "maskClosable": "closable",
      "cancelText": "cancelText",
      "useFooter": "enabled",
      "width": "width"
    }
  },

  "mybricks.basic-comlib.drawer": {
    type: "@es/tianhe-basic-materials::Drawer",
    name: "抽屉",
    props: {
      "title": "title",
      "placement": "placement",
      "closable": "closable",
      "useFooter": "enabled",
      "width": "width",
      "height": "height",
    }
  },

  "mybricks.normal-pc.form-container": {
    type: "@es/tianhe-basic-materials::Form",
    name: "表单",
    props:{

    }
  },

  "mybricks.normal-pc.text": {
    type: "@es/tianhe-basic-materials::Text",
    name: "文本",
    props: {
      content: "label"
    }
  },

  "mybricks.normal-pc.card": {
    type: "@es/tianhe-basic-materials::Card",
    name: "卡片",
    props: {
      "bordered": "bordered",
      "size": "size"
    }
  },

  "mybricks.normal-pc.select": {
    type: "@es/tianhe-basic-materials::Select",
    name: "单项选择",
    props: {
      "disabled": "disabled",		//是否禁用
      "placeholder": "placeholder",	//提示内容
    }
  },

  "mybricks.normal-pc.form-text":{
    type: "@es/tianhe-basic-materials::Input",
    name: "输入框",
    props: {
      "disabled": "disabled",		//是否禁用
      "placeholder": "placeholder",	//提示内容
    }
  },

  "mybricks.normal-pc.typography":{
    type: "@es/tianhe-basic-materials::Text",
    name: "文本",
    props: {
      content: "label"
    }
  },

  "mybricks.normal-pc.radio": {
    type: "@es/tianhe-basic-materials::Radio",
    name: "文本",
    props: {
      value: "value"
    }
  },

  "mybricks.normal-pc.input-number": {
    type: "@es/tianhe-basic-materials::InputNumber",
    name: "数字输入框",
    props: {
      "disabled": "disabled",
      "placeholder": "placeholder",
      "precision": "precision",
      "step": "step",
      "size": "size"
    }
  },

  "mybricks.normal-pc.switch": {
    type: "@es/tianhe-basic-materials::Switch",
    name: "开关",
    props: {
      "disabled": "disabled",
      "size": "size",
      "checked": "checked"
    },
  },

  "mybricks.normal-pc.link":{
    type: "@es/tianhe-basic-materials::Text",
    name: "文本",
    props: {
      content: "label"
    }
  },

  "mybricks.normal-pc.collapse": {
    type: "@es/tianhe-basic-materials::Collapse",
    name: "折叠面板",
    props:{
      title: "headers"
    }
  },

  // "fangzhou.normal-pc.editable-pro-table": {
  //   type: "@es/tianhe-basic-materials::Table",
  //   name: "表格"
  // },

  "mybricks.normal-pc.custom-button": {
    type: "@es/tianhe-basic-materials::Button",
    name: "按钮",
    props: {
      "text": "label",
      "type": "type"
    }
  },

  "mybricks.normal-pc.toolbar": {
    type: "@es/tianhe-basic-materials::Button",
    name: "按钮",
    props: {
      "text": "label",
      "type": "type"
    }
  },

  "mybricks.normal-pc.form-item-container": {
    type: "@es/tianhe-basic-materials::Container",
    name: "容器",
    props: {
      
    }
  },

  "mybricks.normal-pc.custom-container":{
    type: "@es/tianhe-basic-materials::Container",
    name: "容器",
    props: {
      
    }
  },

  "mybricks.normal-pc.list-new": {
    type: "@es/tianhe-basic-materials::Container",
    name: "容器",
    props: {
      
    }
  },

  "mybricks.normal-pc.grid": {
    type: "@es/tianhe-basic-materials::Container",
    name: "容器",
    props: {}
  },

  "mybricks.basic-comlib.dragable-layout": {
    type: "@es/tianhe-basic-materials::Container",
    name: "容器",
    props: {}
  },

  
  "mybricks.basic-comlib.grid": {
    type: "@es/tianhe-basic-materials::Container",
    name: "容器",
    props: {}
  },

  "mybricks.normal-pc.input-textarea": {
    type: "@es/tianhe-basic-materials::Input",
    name: "输入框",
    props: {
      "placeholder": "placeholder",	//提示内容
      "disabled": "disabled",		//是否禁用
      "showCount": "showCount",
      "minRows": "minRows",	//最小行数
      "maxRows": 	"maxRows" //最大行数
    }
  },

  "mybricks.normal-pc.table": {
    type: "@es/tianhe-basic-materials::Table",
    name: "表格",
    props: {
      
    }
  },

  "mybricks.normal-pc.qr-code": {
    type: "@es/tianhe-basic-materials::QRCodeCom",
    name: "二维码",
    props: {
      "link": "value",
      "size": "size"
    }
  },

  "mybricks.normal-pc.steps": {
    type: "@es/tianhe-basic-materials::Steps",
    name: "步骤器",
    props: {
      current: "current"
    }
  },

  "mybricks.normal-pc.alert": {
    type: "@es/tianhe-basic-materials::Alert",
    name: "警告提示",
    props: {
      "type": "type",
      "closable": false,
      "showIcon": "showIcon",
      "icon": "HomeOutlined"
    }
  },

  "mybricks.normal-pc.single-image": {
    type: "@es/tianhe-basic-materials::Image",
    name: "图片",
    props:{
      src: "src"
    }
  },

  "mybricks.normal-pc.tagList": {
    type: "@es/tianhe-basic-materials::Tag",
    name: "标签",
    props:{
      content: "label",
      color: "color"
    }
  },
  
  "es-kpro-search-mailprefix": {
    "type": "@es/tianhe-basic-materials::SearchMailPrefix",
    "name": "用户搜索",
    props: {

    }
  },

  "mybricks.normal-pc.popover": {
    type: "@es/tianhe-basic-materials::Popover",
    name: "气泡卡片",
    props: {
      "placement": "placement",	//位置
  		"trigger": "trigger",	//触发方式
    },
  },

  "mybricks.normal-pc.checkbox": {
    type: "@es/tianhe-basic-materials::CheckboxGroup",
    name: "多选框组",
    props: {
      "disabled": "disabled",	//禁用
      "staticOptions": "SelectOptions",	//选项
     },
  },

  "mybricks.normal-pc.json-view": {
    type: "@es/tianhe-basic-materials::JsonTree",
    name: "JsonTree",
    props: {}
  },

  "mybricks.normal-pc.form-list": {
    type: "@es/tianhe-basic-materials::Container",
    name: "容器",
    props: {
      
    }
  },

  "mybricks.normal-pc.code-editor": {
    type: "@es/tianhe-basic-materials::codeEditor",
    name: "代码编辑器",
    props: {
      "language": "language",	//语言
      "readOnly": "readOnly"	//只读
    },
  },

  "mybricks.normal-pc.password": {
    type: "@es/tianhe-basic-materials::Input",
    name: "输入框",
    props: {
      "size": "size", 	//尺寸
      "placeholder": "placeholder"
    }
  },

  "mybricks.normal-pc.slider": {
    type: "@es/tianhe-basic-materials::Slider",
    name: "滑动输入条",
    props: {
    "config": {
        "disabled": "disabled",		//禁用
        "min": "min",		//最小值
        "max": "max"		//最大值
      },
    }
 },

  "mybricks.normal-pc.search": {
    type: "@es/tianhe-basic-materials::Input",
    name: "输入框",
    props: {
    "config": {
        "disabled": "disabled",		//禁用
        "placeholder": "placeholder",	//提示内容
        "size": "size"	//尺寸
      },
    }
 },

 "mybricks.normal-pc.auto-complete": {
    type: "@es/tianhe-basic-materials::AutoComplete",
    name: "自动完成",
    props: {
    "config": {
        "allowClear": "allowClear",		//显示清楚按钮
        "placeholder": "placeholder",	//提示文案
        "disabled": "disabled"	//禁用
      },
    }
  },

  "mybricks.normal-pc.time-picker": {
    type: "@es/tianhe-basic-materials::TimePicker",
    name: "时间选择器",
    props: {
    "placeholder": "placeholder",
    }
  },

  "mybricks.normal-pc.date-picker": {
    type: "@es/tianhe-basic-materials::DatePicker",
    name: "日期选择器",
    props: {
      "disabled": "disabled",		//禁用
      "placeholder": "placeholder",	//提示内容
      "picker": "picker"	//选择器类型
    }
  },

  "mybricks.normal-pc.iframe": {
    type: "@es/tianhe-basic-materials::Iframe",
    name: "iframe",
    props: {
      "url": "src",
      "id": "id"
    }
  },

  "mybricks.normal-pc.range-picker": {
    type: "@es/tianhe-basic-materials::RangePicker",
    name: "日期范围选择器",
    props: {
      "disabled": "disabled",		//禁用
      "picker": "picker",			//日期类型
      "allowClear": "allowClear",		//是否允许清除
      "size": "size"		//尺寸
    }
  },

  "mybricks.normal-pc.richtext-preview": {
    type: "@es/tianhe-basic-materials::Text",
    name: "文本",
    props: {
      "content": "label"
    }
  },

  "mybricks.normal-pc.form-detail": {
    type: "@es/tianhe-basic-materials::Descriptions",
    name: "描述列表",
    props: {
      "title": "title",	//标题
      "layout": "layout",		//布局
      "column": "column",		//每行列数
      "items": "dataSource"	 //子项 (天河中使用的是dataSource字段循环)
    }
  },

  "mybricks.normal-pc.tabs": {
    type: "@es/tianhe-basic-materials::Tabs",
    name: "标签页",
    props: {
      "tabPosition": "top",
    }
  },
 
  "mybricks.normal-pc.breadcrumb": {
    type: "@es/tianhe-basic-materials::Breadcrumb",
    name: "面包屑",
    props: {
      "separator": "separator"
    }
  },

  "mybricks.normal-pc.paginator": {
    type: "@es/tianhe-basic-materials::Pagination",
    name: "分页器",
    props: {
      "current": "current",
      "pageSize": "defaultPageSize",
      "total": "total",
      "disabled": "disabled",
      "showSizeChanger": "showSizeChanger",
      "showQuickJumper": "showQuickJumper",
      "hideOnSinglePage": "hideOnSinglePage"
    }
  },
  
  //方舟组件库
  "fangzhou.normal-pc.alert": {
    type: "@es/tianhe-basic-materials::Alert",
    name: "警告提示",
    props: {
      "type": "type",
      "closable": false,
      "showIcon": "showIcon",
      "icon": "HomeOutlined"
    }
  },

  "fangzhou.normal-pc.breadcrumb": {
    type: "@es/tianhe-basic-materials::Breadcrumb",
    name: "面包屑",
    props: {
      "separator": "separator"
    }
  },

  "fangzhou.normal-pc.card": {
    type: "@es/tianhe-basic-materials::Card",
    name: "卡片",
    props: {
      "bordered": "bordered",
      "size": "size"
    }
  },

  "fangzhou.normal-pc.code-editor": {
    type: "@es/tianhe-basic-materials::codeEditor",
    name: "代码编辑器",
    props: {
      "language": "language",	//语言
      "readOnly": "readOnly"	//只读
    },
  },

  "fangzhou.normal-pc.custom-button": {
    type: "@es/tianhe-basic-materials::Button",
    name: "按钮",
    props: {
      "text": "label"
    }
  },

  "fangzhou.normal-pc.custom-container": {
    type: "@es/tianhe-basic-materials::Container",
    name: "容器",
    props: {
      
    }
  },

  "fangzhou.normal-pc.dialog": {
    type: "@es/tianhe-basic-materials::Modal",
    name: "弹窗",
    props: {
      "okText": "okText",
      "title": "title",
      "closable": "closable",
      "maskClosable": "closable",
      "cancelText": "cancelText",
      "useFooter": "enabled",
      "width": "width",
    }
  },

  
  "fangzhou.normal-pc.drawer": {
      type: "@es/tianhe-basic-materials::Drawer",
      name: "抽屉",
      props: {
        "title": "title",
        "position": "placement",
        "showFull": "closable",
        "useFooter": "enabled",
        "width": "width",
        "height": "height",
      }
    },
}