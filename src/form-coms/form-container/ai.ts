import merge from "lodash/merge";
import mergeWith from "lodash/mergeWith";
import { uuid } from '../../utils';

const version = ANTD_VERSION === 4 ? "" : "antd5."

const handleMerge = (preData, curData) => {
  mergeWith(preData, curData, (pre, cur, key) => {
    if (key === "btnList") {
      return merge(Array.from({ length: cur.length }, () => {
        return {
          name: "表单项",
          label: "表单项",
          widthOption: 'span',
          span: 24 / (curData.formItemColumn || preData.formItemColumn),
          colon: 'default',
          labelWidthType: 'default',
          hiddenLabel: false,
          visible: true,
          hidden: false
        }
      }), pre, cur)
    } else if (key === "actions") {
      pre.items = pre.items.slice(0, cur.items.length)
    }
    return undefined;
  })
}

export default {
  prompts: {
    summary: `表单容器，支持排版、收集、校验数据的表单容器，内部子组件必须且只能放置表单项（schema=form-item的组件）。
何时使用：仅在中后台场景的查询表单和提交表单中使用，对标antd的form组件，其他场景无需使用。
特别注意：使用此组件必须推荐其他schema=form-item的组件的表单项组件。
    `,
    usage: `表单容器，支持排版、收集、校验数据的表单容器，内部子组件必须且只能放置表单项（schema=form-item的组件）。
何时使用：仅在中后台场景的查询表单和提交表单中使用，对标antd的form组件，其他场景无需使用。
特别注意：使用此组件必须推荐其他schema=form-item的组件的表单项组件。

特别注意：
  - 使用此组件必须推荐其他schema=form-item的组件的表单项组件；
  - 表单的插槽仅允许schema=form-item的表单项组件，如果当前表单项无法满足，可以使用自定义表单项；

slots插槽
  content: 表单的内容
  - 作用域插槽：插槽中仅允许放置schema=form-item的组件。

使用流程
  - 1. 配置表单容器的各类属性，重点关注布局和样式相关配置，以及操作区配置；
  - 2. 添加各类schema=form-item的组件，对于每一个表单项：
      2.1 通过 configs:[{ "path": ":parent/表单项/标题", "value": "标题" }, { "path": ":parent/表单项/字段", "value": "字段" }] 来配置和表单关联的字段和标题；
      2.2 配置组件自身的属性；
 `,
    getNewDSL(dsl) {
      const { data, slots } = dsl;
      if (slots && data.items) {
        const { content: slotContent } = slots;

        data.items.forEach((item, index) => {
          const com = slotContent.comAry[index]
          if (com) {
            com.id = item.id
            com.name = item.comName
          }
        })
      }
      return dsl;
    },
    execute(dsl, context) {
      const { data } = context;
      handleMerge(data, dsl);
    },
  },
  modifyTptJson: (component) => {
    if (!component.data?.actions) {
      component.data.actions = {
        visible: false,
        align: "center",
        span: 24,
        widthOption: "flexFull",
        items: [
          {
            title: "提交",
            type: "primary",
            outputId: "onClickSubmit",
            key: "submit"
          },
          {
            title: "取消",
            outputId: "onClickCancel",
            key: "cancel"
          }
        ]
      }
    }

    component.slots?.content?.comAry?.forEach((com, index) => {
      let item = component.data.items[index]
  
      item.id = uuid();
      item.comName = uuid();
      item.visible = item.visible ?? true;
  
      if (!item.label) {
        item.label = com.data?.label ?? com.title
      }
  
      if (!item.name) {
        item.name = com.data?.name ?? com.data?.label
      }
  
      if (com) {
        com.id = item.id
        com.name = item.comName
      }
    })
  }
}