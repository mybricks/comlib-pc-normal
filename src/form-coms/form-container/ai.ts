const version = ANTD_VERSION === 4 ? "" : "antd5."

export default {
  prompts: {
    summary: `表单容器，支持排版、收集、校验数据的表单容器，内部子组件必须且只能放置表单项（schema=form-item的组件）。
主要作用
1. 垂直/水平统一布局；
2. 左侧自动对齐的 label 样式，表单项之间的默认的分割线；
3. 数据收集、校验、提交按钮（可选）；

何时使用：
- 需要通过表单容器收集信息的情况；
- 中后台场景下，N行N列的label+文本，结合上下文和各类文本猜测是表单类型的，也要使用表单；

使用多个表单容器还是一个表单容器？
任何情况下，先考虑使用多个容器嵌套多个表单的方式来实现，比如拆分了多个卡片+标题等等，都必须使用多个表单容器，而非一个大型表单。

对于只读模式：当前表单包括表单项暂时不支持只读模式，只读模式的表单项（比如文本输入等）选择使用「自定义表单项」来实现。

重要约束(!IMPORTANT)：
表单以及表单内容不可用于实现标题、边框、卡片间距，这些内容应该有基础组件在外层实现，实现后包裹表单，表单只用于渲染表单项；
样式限制：表单容器不负责卡片、外层标题等装饰样式，所以外层必须套一层布局来实现间距等装饰样式。
禁止嵌套：表单容器不允许嵌套表单容器。

特别注意：使用此组件必须推荐其他schema=form-item的组件的表单项组件，用于满足特殊的表单项UI需求。
    `,
    usage: `表单容器，支持排版、收集、校验数据的表单容器，内部子组件必须且只能放置表单项（schema=form-item的组件）。
核心功能包含：
- 数据管理：负责内部表单项的数据收集、校验、提交；
- 容器性质：仅管理数据和布局，具体输入交互由内部“表单项”完成。
- 布局策略：基于可换行的24栅格布局。

何时使用：
- 需要通过表单容器收集信息的情况；
- 中后台场景下，N行N列的label+文本，结合上下文和各类文本猜测是表单类型的；

特别注意：使用此组件必须推荐其他schema=form-item的表单项组件。

slots插槽
  content: 表单的内容
  - 作用域插槽：插槽中仅允许放置schema=form-item的组件，内置标签和其他组件都不可使用；
  - 表单的插槽仅允许schema=form-item的表单项组件，如果当前表单项无法满足，可以使用「自定义表单项」。

使用多个表单容器还是一个表单容器？
任何情况下，先考虑使用多个容器嵌套多个表单的方式来实现，比如拆分了多个卡片+标题等等，都必须使用多个表单容器，而非一个大型表单。

对于只读模式：当前表单包括表单项暂时不支持只读模式，只读模式的表单项（比如文本输入等）选择使用「自定义表单项」来实现。

重要约束(!IMPORTANT)：
- 表单以及表单内容不可用于实现标题、边框、卡片间距，这些内容应该有基础组件在外层实现，实现后包裹表单，表单只用于渲染表单项；
- 禁止嵌套：表单容器不允许嵌套表单容器。
- 插槽规则：插槽中仅允许放置schema=form-item的组件。

使用步骤：
- 确定类型：
  - 选择「表单容器/类型」（普通/查询）。
- 确定整体布局，表单项之间的布局(关键)：
  - 设定表单项标题位置：一个表单只能配置统一的上方或左侧。
  - 配置表单项宽度：表单容器通过24栅格来布局，每一个表单项配置合适的比例，超过比例会自动换行，确保每一行都有24栅格。
  - 处理空缺布局：若某行需留白，可以使用「自定义内容项」填补剩余栅格。
- 添加schema=form-item的表单项：
  - 添加有两种情况：现有表单项可满足 和 现有表单项不可满足
    1. 现有表单项可满足，则添加表单项即可；
    2. 现有表单项不可满足，则使用「自定义表单项」「自定义内容项」来包裹各类UI组件；
  - 任意表单项（包含「自定义内容项」和「自定义表单项」）除了自身配置外，都可配置 :child(mybricks.normal-pc.form-container/form-item) 下的所有配置，此时path需要添加“:parent”前缀。
    例如：
      - configs:[{ "path": ":parent/表单项/标题", "value": "标题" }, { "path": ":parent/表单项/字段", "value": "key" }] 来配置和表单关联的字段和标题；
      - configs:[{ "path": ":parent/表单项/样式/宽度配置(共24格)", "value": 4 }] 来配置当前表单项占满24栅格的比例；
      - configs:[{ "path": ":parent/表单项/样式/标题冒号", "value": false }] 来展示或关闭冒号；
  - 关于冒号：冒号可以通过「标题冒号」来开启，不要直接在标题添加冒号；
  - 关于必填样式：必填红色星号可通过配置「必填样式」开启/关闭，不要直接在标题添加*号；
- 配置操作区：
   配置提交、重置等按钮，支持自定义按钮列表和样式。
 `,
  },
//   editors: [
//     '表单容器/类型',
//     '表单容器/默认折叠表单项',
//     // '表单容器/表单项布局/类型',
//     {
//       title: '表单容器/表单项间距',
//       type: 'number',
//       description: '必须配置，每列表单项之间的距离，仅影响列间距',
//       value: {
//         set: ({ data, slot, output }, value) => {
//           if (typeof value === 'number') {
//             data.columnGap = value
//           } else {
//             data.columnGap = value[0];
//           }
//         }
//       }
//     },
//     {
//       title: '表单容器/表单项排列',
//       type: 'select',
//       description: '必须配置，label文本和内容项的排列方式，可选值为column/row，column(垂直，省空间，常用) 或 row(水平)，默认为column',
//       value: {
//         set: ({ data, slot, output }, value) => {
//           data.config.layout = (value === 'row' ? 'horizontal' : 'vertical')
//         }
//       }
//     },
//     {
//       title: "表单容器/渲染模式",
//       description: '可以选择 edit / readonly',
//       type: 'select',
//       value: {
//         set: ({ data, slot, output }, value) => {
//           data.isEditable = value === 'edit'
//         }
//       }
//     },
//     // '表单容器/表单项布局/启用24栅格布局系统',
//     // '表单容器/表单项布局/每行列数',
//     // '表单容器/表单项布局/列间距',
//     // '表单容器/表单项布局/表单项宽度',
//     // '表单容器/表单项布局/尺寸',
//     // '表单容器/表单项布局/每行列数',
//     // '表单容器/标题/宽度类型',
//     // '表单容器/标题/标题宽度(px)',
//     // '表单容器/标题/标题宽度(栅格)',
//     '表单容器/标题/标题超长配置',
//     // '表单容器/标题/显示冒号',
    
//     '表单项/显示标题',
//     '表单项/标题',
//     '表单项/标题提示',
//     '表单项/提示语',
//     // '表单项/样式/宽度模式',
//     '表单项/样式/宽度配置(共24格)',
//     '表单项/样式/标题冒号',
//     '表单项/样式/必填样式',
//     '样式/标题/字体',
//     '样式/提示语',
    
//     '操作区/显示',
//     '操作区/展开文案',
//     '操作区/收起文案',
//     '操作区/对齐方式',
//     {
//       title: '操作区/按钮列表',
//       description: `通过数组来配置按钮列表
// [
//   {
//     key: string # 唯一标识
//     title: string # 标题
//     type: 'default' | 'primary' | 'dashed' | 'text' | 'link' = 'default' # 按钮类型
//     disabled: boolean
//     icon?: string # 图标
//     iconLocation?: ['front', 'back'] = 'front' # 图标位置
//     iconDistance?: number = 8 # 图标与文字间距
//   }
// ]
// `,
//       type: 'array',
//       value: {
//         set: ({ data, slot, output }, value) => {
//           data.actions.items = value.map(t => {
//             const { key, title } = t

//             output.add(key, title, { type: 'any' })

//             return {
//               ...t,
//               outputId: key,
//               useIcon: !!t.icon,
//               visible: true,
//               useDynamicDisabled: false,
//               useDynamicHidden: false,
//               isDefault: false,
//             }
//           })
//         }
//       }
//     },
//     '样式/表单/背景色',
//     '样式/默认/背景色',
//     '样式/默认/内容',
//     '样式/默认/字体',
//     {
//       title: '样式/操作区/按钮样式',
//       description: `字体、字号、颜色、粗细、背景、边框、圆角，由于按钮是一个数组，所以返回的style属性应该加一个index属性，代表是第几个元素，例如第一个则是 { "index": 0, "color": "#fff" }`,
//       type: 'style',
//       value: {
//         set: ({ data, slot, output, style }, value) => {
//           if (value.index !== undefined) {
//             const targetBtn = data.actions.items[value.index];
//             if (targetBtn.key) {
//               const { index, ...newStyle } = value
//               style.setCSS([`button[data-form-actions-item="${targetBtn.key}"]`,`button[data-form-item-type="${targetBtn.key}}"]`], newStyle)
//             }
//           }
//         }
//       }
//     }
//   ],
  editors: {
    ':root': [
      '表单容器/类型',
      '表单容器/默认折叠表单项',
      // '表单容器/表单项布局/类型',
      {
        title: '表单容器/表单项间距',
        type: 'number',
        description: '必须配置，每列表单项之间的距离，仅影响列间距',
        value: {
          set: ({ data, slot, output }, value) => {
            if (typeof value === 'number') {
              data.columnGap = value
            } else {
              data.columnGap = value[0];
            }
          }
        }
      },
      {
        title: '表单容器/表单项/标题位置',
        type: 'select',
        description: '必须配置，label文本和内容项的排列方式，可选值为top/left，top(上方，省空间，常用) 或 left(左侧)，默认为top',
        value: {
          set: ({ data, slot, output }, value) => {
            data.config.layout = (value === 'left' ? 'horizontal' : 'vertical')
          }
        }
      },
      // {
      //   title: "表单容器/渲染模式",
      //   description: '可以选择 edit / readonly',
      //   type: 'select',
      //   value: {
      //     set: ({ data, slot, output }, value) => {
      //       data.isEditable = value === 'edit'
      //     }
      //   }
      // },
      // '表单容器/表单项布局/启用24栅格布局系统',
      // '表单容器/表单项布局/每行列数',
      // '表单容器/表单项布局/列间距',
      // '表单容器/表单项布局/表单项宽度',
      // '表单容器/表单项布局/尺寸',
      // '表单容器/表单项布局/每行列数',
      // '表单容器/标题/宽度类型',
      // '表单容器/标题/标题宽度(px)',
      // '表单容器/标题/标题宽度(栅格)',
      '表单容器/标题/标题超长配置',
      // '表单容器/标题/显示冒号',
      
      '表单项/显示标题',
      '表单项/标题',
      '表单项/标题提示',
      '表单项/提示语',
      // '表单项/样式/宽度模式',
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
    ':child(mybricks.normal-pc.form-container/form-item)': {
      get title() {
        return ':child(form-item) 也就是表单容器的某一个表单项'
      },
      configs: [
        '表单项/显示标题',
        '表单项/标题',
        '表单项/标题提示',
        '表单项/提示语',
        '表单项/样式/宽度配置(共24格)',
        '表单项/样式/标题冒号',
        '表单项/样式/必填样式',
        '样式/标题/字体',
        '样式/提示语',
      ]
    }
  },
  requires: [`mybricks.normal-pc.${version}form-item-container`, `mybricks.normal-pc.${version}form-addition-container`]
}