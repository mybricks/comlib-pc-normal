const version = ANTD_VERSION === 4 ? "" : "antd5."

export default {
  prompts: {
    summary: `表单容器，支持排版、收集、校验数据的表单容器，对标antd的Form组件，内部子组件必须且只能放置表单项（schema=form-item的组件）。
主要作用：约等于 antd的form组件，帮忙搞定：
1. 垂直/水平统一布局；
2. 左侧自动对齐的 label 样式，表单项之间的默认的分割线；
3. 数据收集、校验、提交按钮（可选）；
4. 支持编辑/只读模式切换，默认为编辑模式；

何时使用：
- 期望统一水平/垂直布局、所有表单项 label 对齐、行距一致、且需要收集信息的情况；
- 中后台场景下，N行N列的label+文本，结合上下文和各类文本猜测是表单类型的，也要使用表单；

重要约束(!IMPORTANT)：
拆分原则：被标题、卡片分割的长表单，必须拆分为多个独立表单，禁止包含在一个表单容器中。
样式限制：表单容器不负责卡片、外层标题等装饰样式，所以外层必须套一层布局来实现间距等装饰样式。
禁止嵌套：表单容器不允许嵌套表单容器。

特别注意：使用此组件必须推荐其他schema=form-item的组件的表单项组件，同时必须推荐「自定义表单项」「自定义内容项」组件，用于满足特殊的表单项UI需求。
    `,
    usage: `表单容器，支持排版、收集、校验数据的表单容器，对标antd的Form组件，内部子组件必须且只能放置表单项（schema=form-item的组件）。
主要作用：约等于 antd的form组件，核心功能包含：
- 数据管理：负责内部表单项的数据收集、校验、提交；
- 容器性质：仅管理数据和布局，具体输入交互由内部“表单项”完成。
- 布局策略：基于Row/Col的24栅格布局。推荐优先配置容器级的“通用布局”，特殊个例单独调整。
- 状态管理：支持编辑/只读模式切换。

何时使用：
- 需要通过表单容器放置多个表单项收集信息的情况；
- 中后台场景下，N行N列的label+文本，结合上下文和各类文本猜测是表单类型的；

特别注意：使用此组件必须推荐其他schema=form-item的表单项组件。

slots插槽
  content: 表单的内容
  - 作用域插槽：插槽中仅允许放置schema=form-item的组件，内置标签和其他组件都不可使用；
  - 表单的插槽仅允许schema=form-item的表单项组件，如果当前表单项无法满足，可以使用「自定义表单项」「自定义内容项」。

重要约束(!IMPORTANT)：
- 拆分原则：被标题、卡片分割的长表单，禁止包含在一个大表单容器中，必须拆分为多个独立表单。
样式限制：表单容器不负责卡片、外层标题等装饰样式，所以外层必须套一层布局来实现间距等装饰样式。
- 禁止嵌套：表单容器不允许嵌套表单容器。
- 插槽规则：插槽中仅允许放置schema=form-item的组件。

使用步骤：
- 确定类型：
  - 选择「表单容器/类型」（普通/查询）。
  - 选择「渲染模式」（编辑/只读）。
- 确定布局(关键)：
  - 设定布局类型：Vertical(垂直，省空间，常用) 或 Horizontal(水平)。
  - 计算栅格：扫描表单设计，找出列数最多的一行（例如3列）。
  - 配置通用布局：将「每行列数」设为最大列数（如3），系统自动计算每列宽度，同时配置列间距。
  - 配置表单项宽度：对于宽度不一样的表单项，单独修改其「宽度配置」（如设为24则占满一行），此时表单项不遵循通用布局。
  - 处理空缺布局：若某行需留白，使用「自定义内容项」填补剩余栅格。
- 添加schema=form-item的表单项：
  - 任意表单项（包含「自定义内容项」和「自定义表单项」）除了自身配置外，都可配置 :child(mybricks.normal-pc.form-container/form-item) 下的所有配置，此时path需要添加“:parent”前缀。
    例如：
      - configs:[{ "path": ":parent/表单项/标题", "value": "标题" }, { "path": ":parent/表单项/字段", "value": "key" }] 来配置和表单关联的字段和标题；
      - configs:[{ "path": ":parent/表单项/样式/宽度配置(共24格)", "value": 16 }] 来配置当前表单项占满24栅格的比例；
      - configs:[{ "path": ":parent/表单项/样式/标题冒号", "value": false }] 来关闭冒号；
  - 表单容器默认配置打开冒号，此时注意「标题」不要添加冒号；
  - 必填红色星号可通过配置开启/关闭。
- 配置操作区：
   配置提交、重置等按钮，支持自定义按钮列表和样式。
 `,
  },
  editors: [
    '表单容器/类型',
    '表单容器/默认折叠表单项',
    '表单容器/表单项布局/类型',
    {
      title: "表单容器/渲染模式",
      description: '可以选择 edit / readonly',
      type: 'select',
      value: {
        set: ({ data, slot, output }, value) => {
          data.isEditable = value === 'edit'
        }
      }
    },
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
    
    '表单项/显示标题',
    '表单项/标题',
    '表单项/标题提示',
    '表单项/提示语',
    '表单项/样式/宽度模式',
    '表单项/样式/宽度配置(共24格)',
    '表单项/样式/标题冒号',
    '表单项/样式/必填样式',
    '样式/标题/字体',
    '样式/提示语',
    
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
    {
      title: '样式/操作区/按钮样式',
      description: `字体、字号、颜色、粗细、背景、边框、圆角，由于按钮是一个数组，所以返回的style属性应该加一个index属性，代表是第几个元素，例如第一个则是 { "index": 0, "color": "#fff" }`,
      type: 'style',
      value: {
        set: ({ data, slot, output, style }, value) => {
          if (value.index !== undefined) {
            const targetBtn = data.actions.items[value.index];
            if (targetBtn.key) {
              const { index, ...newStyle } = value
              style.setCSS([`button[data-form-actions-item="${targetBtn.key}"]`,`button[data-form-item-type="${targetBtn.key}}"]`], newStyle)
            }
          }
        }
      }
    }
  ],
  requires: [`mybricks.normal-pc.${version}form-item-container`, `mybricks.normal-pc.${version}form-addition-container`]
}