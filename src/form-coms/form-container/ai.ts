import { uuid } from '../../utils';

const version = ANTD_VERSION === 4 ? "" : "antd5."

export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '表单容器',
    usage: `data数据模型
layoutType: ['Form', 'QueryFilter'] # 表单容器的快捷样式布局，Form适合常见的垂直提交收集信息场景，QueryFilter适合查询表单
config: {
colon?: boolean = true
disabled?: boolean = false
layout: ['horizontal', 'vertical']
size?: ['middle', 'small', 'large']
}
items: { # 子组件列表，每一个item对应插槽里的一个子组件
label: string
name: sting # 映射的字段
span: number
hidden: boolean
hiddenLabel: boolean
}[]
enable24Grid?: boolean = false
span?: number = 8
labelCol?: number = 4
labelWidthType: ['span']
actions?: { # 表单自带的操作按钮组，默认带提交和取消两个按钮，有修改则需要声明这个字段
visible?: boolean = true # 是否展示这个按钮组
align?: ['left', 'center', 'right']
items: {
  key: string # 唯一key
  type?: ['primary']
  title: sting # 内容
}[]
}[]

slots插槽
content: 表单的内容
  - 作用域插槽：form-item，插槽中仅允许放置schema=form-item的组件，内置标签和其他组件都不可使用。

styleAry声明
表单: .ant-form

使用案例
\`\`\`dsl file="page.dsl"
<mybricks.normal-pc.${version}form-container
title="水平布局 + 提交取消按钮的查询表单"
layout={{ width: '100%', height: 'fit-content' }}
data={{
  layoutType: 'QueryFilter',
  config: {
    colon: true,
    layout: 'horizontal'
  },
  items: [
    { id: "name", label: "学生姓名", name: "name", span: 8, hidden: false, hiddenLabel: false }
  ],
  enable24Grid: true,
  span: 8,
  labelCol: 4,
  labelWidthType: "span"
}}
>
<slots.content title="表单项内容" layout={{ width: '100%' }}>
  <mybricks.normal-pc.${version}form-text
    title="学生姓名"
    layout={{ width: '100%' }}
    data={{
      visible: true,
      rules: [],
      validateTrigger: ["onBlur"],
      config: {
        allowClear: true,
        placeholder: "请输入学生姓名",
        disabled: false,
        showCount: false,
        maxLength: -1,
        size: "middle"
      },
      isEditable: true
    }}
  />
</slots.content>
</mybricks.normal-pc.${version}form-container>
\`\`\`

\`\`\`dsl file="page.dsl"
<mybricks.normal-pc.${version}form-container
title="垂直布局 + 提交取消居中按钮的保存表单"
layout={{ width: '100%', height: 'fit-content' }}
data={{
  layoutType: 'Form',
  config: {
    colon: true,
    layout: 'vertical'
  },
  items: [
    { id: "name", label: "学生姓名", name: "name", span: 8, hidden: false, hiddenLabel: false }
  ],
  enable24Grid: true,
  span: 8,
  labelCol: 4,
  wrapperCol: 24,
  labelWidthType: "span",
  actions: {
    visible: true,
    align: "center",
    span: 24,
    widthOption: "flexFull",
    items: [
      {
        title: "保存",
        type: "primary",
        outputId: "onClickSubmit",
        key: "submit"
      }
    ]
  }
}}
>
<slots.content title="表单项内容" layout={{ width: '100%' }}>
  <mybricks.normal-pc.${version}form-text
    title="学生姓名"
    layout={{ width: '100%' }}
    data={{
      visible: true,
      rules: [],
      validateTrigger: ["onBlur"],
      config: {
        allowClear: true,
        placeholder: "请输入学生姓名",
        disabled: false,
        showCount: false,
        maxLength: -1,
        size: "middle"
      },
      isEditable: true
    }}
  />
</slots.content>
</mybricks.normal-pc.${version}form-container>
\`\`\``
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

    component.data.items.forEach((item, index) => {
      item.id = uuid();
      item.comName = uuid();

      const com = component.slots?.content?.comAry?.[index];
      if (com) {
        com.id = item.id
        com.name = item.comName
      }
    })
  }
}