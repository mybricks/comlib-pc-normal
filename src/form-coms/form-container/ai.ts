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
    summary: `表单容器，支持排版、收集、校验数据的表单容器，对标antd的Form组件，内部子组件必须且只能放置表单项（schema=form-item的组件）。
主要作用：约等于 antd的form组件，帮忙搞定：
1. 垂直/水平统一布局；
2. 左侧自动对齐的 label 样式，表单项之间的默认的分割线；
3. 数据收集、校验、提交按钮（可选）； 

何时使用：依赖默认布局 / label 样式；
- 期望统一水平/垂直布局、所有表单项 label 对齐、行距一致、且需要收集信息的情况；

特别注意：使用此组件必须推荐其他schema=form-item的组件的表单项组件。
同时推荐使用「自定义表单项」组件来满足特殊的表单项UI需求。
    `,
    usage: `表单容器，支持排版、收集、校验数据的表单容器，对标antd的Form组件，内部子组件必须且只能放置表单项（schema=form-item的组件）。
主要作用：约等于 antd的form组件，帮忙搞定：
1. 垂直/水平统一布局；
2. 左侧自动对齐的 label 样式，表单项之间的默认的分割线；
3. 数据收集、校验、提交按钮（可选）； 

何时使用：依赖默认布局 / label 样式；
- 期望统一水平/垂直布局、所有表单项 label 对齐、行距一致、且需要收集信息的情况；

特别注意：使用此组件必须推荐其他schema=form-item的组件的表单项组件。

slots插槽
  content: 表单的内容
  - 作用域插槽：插槽中仅允许放置schema=form-item的组件，内置标签和其他组件都不可使用；
  - 表单的插槽仅允许schema=form-item的表单项组件，如果当前表单项无法满足，可以使用自定义表单项。

使用流程：
  1. 配置「表单容器/类型」和「表单容器/表单项布局/类型」，选择合适的表单类型和布局类型；
    1.1 「表单容器/类型」，确认是普通表单还是查询表单；
    1.2 「表单容器/表单项布局/类型」，确认是水平还是垂直布局；
  2. 添加各类schema=form-item的组件，对于每一个表单项：
    2.1 通过 configs:[{ "path": ":parent/表单项/标题", "value": "标题" }, { "path": ":parent/表单项/字段", "value": "字段" }] 来配置和表单关联的字段和标题，当且仅当配置 :child(mybricks.normal-pc.form-container/form-item) 下的所有配置项 需要添加「:parent/」前缀；
    2.2 配置组件自身的属性；
  3. 配置布局相关信息，重点关注「表单项布局」和「表单项宽度配置」相关配置；
    3.1 如果要配置一行三列，可以配置「表单项布局/每行列数」为3，同时配置「表单项宽度配置(共24格)」为8；
    3.2 如果要配置一行两列，第二行三列，可以配置「表单项布局/每行列数」为3，同时将前两个表单项配置「表单项宽度配置(共24格)」为12，第三个表单项配置「表单项宽度配置(共24格)」为8；
  4. 关注操作区配置，各类操作按钮在此配置；
    
配置注意：
  - 对于表单项的标题，默认会添加冒号，不需要在标题处多配置；
  - 24栅格是会换行的，所以配置时务必仔细确认每一个表单项的占据宽度，避免超出24栅格导致换行；
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
  },
  editors: [
    '表单容器/类型',
    '表单容器/默认折叠表单项',
    '表单容器/表单项布局/类型',
    '表单容器/表单项布局/启用24栅格布局系统',
    '表单容器/表单项布局/每行列数',
    '表单容器/表单项布局/列间距',
    '表单容器/表单项布局/表单项宽度',
    '表单容器/表单项布局/尺寸',
    '表单容器/表单项布局/每行列数',
    '表单容器/标题/宽度类型',
    '表单容器/标题/标题宽度(px)',
    '表单容器/标题/标题宽度(栅格)',
    '表单容器/标题/标题超长配置',
    '表单容器/标题/显示冒号',
    '表单项/样式/宽度配置(共24格)',
    '表单项/样式/必填样式',
    '样式/标题/字体',
    '操作区/显示',
    '操作区/展开文案',
    '操作区/收起文案',
    '操作区/对齐方式',
    {
      title: '操作区/按钮列表',
      description: `通过数组来配置按钮列表
[
  {
    key: string # 唯一标识
    title: string # 标题
    type: 'default' | 'primary' | 'dashed' | 'text' | 'link' = 'default' # 按钮类型
    disabled: boolean
    icon?: string # 图标
    iconLocation?: ['front', 'back'] = 'front' # 图标位置
    iconDistance?: number = 8 # 图标与文字间距
  }
]
`,
      type: 'array',
      value: {
        set: ({ data, slot, output }, value) => {
          data.actions.items = value.map(t => {
            const { key, title } = t

            output.add(key, title, { type: 'any' })

            return {
              ...t,
              outputId: key,
              useIcon: !!t.icon,
              visible: true,
              useDynamicDisabled: false,
              useDynamicHidden: false,
              isDefault: false,
            }
          })
        }
      }
    },
    '样式/表单/背景色',
    '样式/默认/背景色',
    '样式/默认/内容',
    '样式/默认/字体',
  ],
}