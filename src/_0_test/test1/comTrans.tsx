
import { comsMap } from './const';
import { 
  uuid , 
  comsArrFun,
  basicComPropsTrans, 
  btnComPropsTrans, 
  formItemPropsTrans, 
  textComPropsTrans,
  collapsePropsTrans,
  tagComPropsTrans
} from './utils/basicUtils';
import { formItemTrans } from './utils/formTransUtils'
import { modelPropsTrans } from './utils/dialogTransUtils'
import { tablePropsTrans } from './utils/tableTransUtils'
import { cardTitleTrans, cardBodyTrans } from './utils/cardTransUtils'
import { stepsPropsTrans } from './utils/stepsTransUtils'
import { alertPropsTrans } from './utils/alertTransUtils'
import { gridPropsTrans } from './utils/gridTransUtils';
import { layoutPropsTrans } from './utils/gridTransUtils';
import { tabPropsTrans } from './utils/tabTransUtils';
import { drawerPropsTrans } from './utils/drawerTransUtils'
//1、表单
export const formTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    //后续改写各个组件的props的函数
    props: {
      items: {
        type: "array",
        value: formItemTrans(item.props, item.slots)
      },
      "column": item.props.formItemColumn,
      "layout": item.props.config.layout,
      "colon": item.props.config.colon,
      "size": item.props.config.size
    }
  }
}

//2、文本、链接、按钮、二维码
export const basicComTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props: basicComPropsTrans(item)
  }
}

//3、工具条->按钮组
export const toolbarTrans = (item) => {
  let btnList:any = []
  item.props.btnList.forEach(btn => {
    btnList.push({
      id: 'comp_' + item.id + uuid(),
      type: "@es/tianhe-basic-materials::Button",
      name: "按钮",
      props: btnComPropsTrans(btn)
    })
  });
  return btnList
}


//4、卡片
export const cardTrans = (item)=>{
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props: {
      ...basicComPropsTrans(item),
      title: cardTitleTrans(item),
      cardBody: cardBodyTrans(item)
    }
  }
}

//5、下拉框、文本框、文本域（基础表单项）....
export const itemTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props:  formItemPropsTrans(item)
  }
}

//6、自定义内容项 mybricks.normal-pc.form-item-container
//自定义表单项 mybricks.normal-pc.form-item-container
//转换成天河的容器组件 @es/tianhe-basic-materials::Container
export const containerTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    children: item.slots && comsArrFun(item.slots)
    // children: item.slots && item.slots.map(slot=> 
    //   //整个转换函数
    //   transMap[slot.type](slot)
    // )
  }
}

//7、文本排版，文本排版 -> 文本列表 
export const typographyTrans = (item) => {
  let textList:any = []
  item.props.items.forEach(text => {
    textList.push({
      id: 'comp_' + text.key + uuid(),
      type: "@es/tianhe-basic-materials::Text",
      name: "文本",
      props: textComPropsTrans(text)
    })
  });
  return textList
}

//8、折叠面板
export const collapseTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props: collapsePropsTrans(item)
  }
}

//9、对话框
export const dialogTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    //后续改写各个组件的props的函数
    props: modelPropsTrans(item)
    // props: {
    //   //title: item.props.title,
    //   ...basicComPropsTrans(item),
    //   title: !item.props.hideTitle ? item.props.hideTitle: '',
    //   modalContent: {
    //     type: "array",
    //     "value": modalTrans(item.props, item.slots)
    //   }
    // }
  }
}

//10、表格
export const tableTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props: tablePropsTrans(item)
  }
}

//11、链接
export const linkTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props: {
      ...basicComPropsTrans(item),
      "type": "link"
    }
  }
}

//12、单选框
export const radioTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props: {
      "radioOptions": {
        "type": "static",
        "value": {
          "valueType": "string",
          "value": item.props.staticOptions
        }
      },
    }
  }
}

//13、步骤条
export const stepsTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props: {
      ...stepsPropsTrans(item)
    }
  }
}


//14、警告提示
export const alertTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    ...alertPropsTrans(item)
  }
}

//15、栅格
export const gridTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    ...gridPropsTrans(item)
  }
}

//16、布局
export const layoutTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    ...layoutPropsTrans(item)
  }
}

//17、标签列表
export const tagListTrans = (item) => {
  let tagList:any = []
  item.props.tags.forEach(tag => {
    tagList.push({
      id: 'comp_' + tag.key + uuid(),
      type: "@es/tianhe-basic-materials::Tag",
      name: "标签",
      props: tagComPropsTrans(tag)
    })
  });
  return tagList
}

//18、动态表单项
export const formListTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props: {
      "name": "formList",
    },
    children: item.slots && comsArrFun(item.slots)
  }
}

//19、代码编辑器
export const codeEditorTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props: {
      "language": item.props.language,
      "readOnly": item.props.readOnly,
      "width": "500px",
      "height": "200px",
      "theme": "vs-dark",
    }
  }
}

//20、密码框
export const passwordTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props: {
      ...basicComPropsTrans(item),
      "mode": "password"
    }
  }
}

//21、搜索框
export const searchTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props: {
      ...basicComPropsTrans(item),
      "enterButtonEnabled": true
    }
  }
}

//22、日期范围选择框
export const rangePickerTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props: {
      ...basicComPropsTrans(item),
      "leftPlaceholder": item.props.config.placeholder[0],
      "rightPlaceholder": item.props.config.placeholder[1]
    }
  }
}

//23、富文本
export const richTextTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props: {
      ...basicComPropsTrans(item),
      "contentType": "html"
    }
  }
}

//24、上传
export const uploadTrans = (item) =>{
  if(['picture', 'text'].includes(item.props.config.listType)){
    return {
      id: 'comp_' + item.id + uuid(),
      type:  "@es/tianhe-pro-materials::ProFormUpload",
      name: "上传",
      props: {}
    }
  }else{
    return{
      id: 'comp_' + item.id + uuid(),
      type: "@es/tianhe-pro-materials::UploaderMaterial",
      name: "素材中心上传",
      props: {
        "buttonType": "smallBox",
        "label": item.props.config.buttonText,
      }
    }
  }
}

//25、标签页
export const tabTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props: {
      ...tabPropsTrans(item)
    }
  }
}

//26、描述列表
export const formDetailTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props: {
      ...basicComPropsTrans(item),
     title: item.props.showTitle ? item.props.title : ''
    }
  }
}

//27、布局
export const basicGridTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    ...gridPropsTrans(item)
  }
}

//28、抽屉
export const drawerTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props: drawerPropsTrans(item)
  }
}

//29、面包屑
export const breadcrumbTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props: {
      ...basicComPropsTrans(item),
      items: item.props.children.map((item) => {
        return {
          title: item.label
        }
      })
    }
  }
}

//30、分页器
export const paginationTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props: {
      ...basicComPropsTrans(item),
      "showTitle": item.props.text ? true : false,
      "pageSizeOptions": {
        "type": "static",
        "value": {
          "valueType": "string",
          "value": item.props.pageSizeOptions
        }
      },
    }
  }
}

//31、文本框
export const inputTrans = (item) => {
  return {
    id: 'comp_' + item.id + uuid(),
    type: comsMap[item.type].type,
    name: comsMap[item.type].name,
    props:  {
      ...formItemPropsTrans(item),
      "mode": "single"
    }
  }
}

export const transMap = {
  "mybricks.normal-pc.dialog": dialogTrans,
  "mybricks.basic-comlib.popup": dialogTrans,
  "mybricks.normal-pc.form-container": formTrans,
  "mybricks.normal-pc.text": basicComTrans,
  "mybricks.normal-pc.card": cardTrans,
  "mybricks.normal-pc.select": itemTrans,
  "mybricks.normal-pc.form-text": inputTrans,
  "mybricks.normal-pc.typography": typographyTrans,
  "mybricks.normal-pc.link": linkTrans,
  "mybricks.normal-pc.collapse": collapseTrans,
  "mybricks.normal-pc.custom-button": basicComTrans,
  "mybricks.normal-pc.toolbar": toolbarTrans,
  "mybricks.normal-pc.form-item-container": containerTrans,
  "mybricks.normal-pc.custom-container": containerTrans,
  "mybricks.normal-pc.list-new": containerTrans,
  "mybricks.normal-pc.input-textarea": itemTrans,
  "mybricks.normal-pc.input-number": itemTrans,
  "mybricks.normal-pc.switch": itemTrans,
  "mybricks.normal-pc.table": tableTrans,
  "mybricks.normal-pc.qr-code": basicComTrans,
  "mybricks.normal-pc.radio": radioTrans,
  "mybricks.normal-pc.steps": stepsTrans,
  "mybricks.normal-pc.alert": alertTrans,
  "mybricks.normal-pc.single-image": basicComTrans,
  "mybricks.normal-pc.grid": gridTrans,
  "mybricks.basic-comlib.dragable-layout": layoutTrans,
  "mybricks.basic-comlib.grid": basicGridTrans,
  "mybricks.normal-pc.tagList": tagListTrans,
  "es-kpro-search-mailprefix": basicComTrans,
  "mybricks.normal-pc.popover": basicComTrans,
  "mybricks.normal-pc.checkbox": itemTrans,
  "mybricks.normal-pc.json-view": basicComTrans,
  //单独使用form-list
  "mybricks.normal-pc.form-list": containerTrans,
  "mybricks.normal-pc.code-editor": codeEditorTrans,
  "mybricks.normal-pc.password": passwordTrans,
  "mybricks.normal-pc.slider": itemTrans,
  "mybricks.normal-pc.search": searchTrans,
  "mybricks.normal-pc.auto-complete": itemTrans,
  "mybricks.normal-pc.time-picker": itemTrans,
  "mybricks.normal-pc.date-picker": itemTrans,
  "mybricks.normal-pc.iframe": basicComTrans,
  "mybricks.normal-pc.range-picker": rangePickerTrans,
  "mybricks.normal-pc.upload": uploadTrans,
  "mybricks.normal-pc.form-detail": formDetailTrans,
  "mybricks.normal-pc.tabs": tabTrans,
  "mybricks.basic-comlib.drawer": drawerTrans,
  "mybricks.normal-pc.breadcrumb": breadcrumbTrans,
  "mybricks.normal-pc.paginator": paginationTrans,
  //方舟组件库
  "fangzhou.normal-pc.alert": alertTrans,
  "fangzhou.normal-pc.breadcrumb": breadcrumbTrans,
  "fangzhou.normal-pc.card": cardTrans,
  "fangzhou.normal-pc.code-editor": codeEditorTrans,
  "fangzhou.normal-pc.custom-button": basicComTrans,
  "fangzhou.normal-pc.custom-container": containerTrans,
  "fangzhou.normal-pc.dialog": dialogTrans,
  //抽屉底部内容兼容，目前天河无法自定义内容
  "fangzhou.normal-pc.drawer": drawerTrans
}