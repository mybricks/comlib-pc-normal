const version = ANTD_VERSION === 4 ? "" : "antd5."

export default {
  prompts: {
    summary: `表单，支持收集、校验数据的表单，内部由表单项（schema=form-item的组件）组成。
核心功能包含：
- 数据管理：负责内部表单项的数据收集、校验、提交；
- 逻辑收集：仅管理数据，具体输入交互由内部“表单项”完成。
- 布局策略：基于可换行的24栅格布局。

何时使用：
- 中后台场景下，N行N列的label+文本，结合上下文和各类文本猜测是表单类型的，也要使用表单；

选型思路：
- 如果发现表单中有标题，使用布局嵌套文本和表单来实现；
- 优先使用多个独立表单而非一个大表单来搭建页面；
  比如下面的结构
  - 容器
    - 区域标题
    - 独立表单
  - 容器
    - 区域标题
    - 独立表单
- 对于只读模式的表单项，需要使用「自定义表单项」来替代实现。

重要约束(!IMPORTANT)：
禁止嵌套：表单不允许嵌套表单。

特别注意：使用此组件必须推荐其他schema=form-item的组件的表单项组件，用于满足特殊的表单项UI需求。
    `,
    usage: `表单，支持收集、校验数据的表单，内部由表单项（schema=form-item的组件）组成。
核心功能包含：
- 数据管理：负责内部表单项的数据收集、校验、提交；
- 逻辑收集：仅管理数据，具体输入交互由内部“表单项”完成。
- 布局策略：基于可换行的24栅格布局。

何时使用：
- 中后台场景下，N行N列的label+文本，结合上下文和各类文本猜测是表单类型的；

特别注意：使用此组件必须推荐其他schema=form-item的表单项组件。

slots插槽
  content: 表单的内容
  - 作用域插槽：插槽中仅允许放置schema=form-item的组件，内置标签和其他组件都不可使用；
  - 表单的插槽仅允许schema=form-item的表单项组件，如果当前表单项无法满足，可以使用「自定义表单项」。

选型思路：
- 如果发现表单中有标题，使用布局嵌套文本和表单来实现；
- 优先使用多个独立表单而非一个大表单来搭建页面
  比如下面的结构
  - 容器
    - 区域标题
    - 独立表单
  - 容器
    - 区域标题
    - 独立表单
- 对于只读模式的表单项，需要使用「自定义表单项」来替代实现。

重要约束(!IMPORTANT)：
禁止嵌套：表单不允许嵌套表单。

使用步骤：
- 确定类型：
  - 选择「表单/类型」（普通/查询）。
- 确定整体布局，表单项之间的布局(关键)：
  - 设定表单项标题位置：一个表单只能配置统一的上方或左侧。
  - 配置表单项宽度：表单通过24栅格来布局，每一个表单项配置合适的比例，超过比例会自动换行，确保每一行都有24栅格。
  - 配置标题冒号：通过配置「表单容器/标题/显示冒号」来显示和关闭冒号，默认是显示的。
  - 处理空缺布局：若某行需留白，可以使用「自定义表单项」填补剩余栅格。
- 添加schema=form-item的表单项：
  - 添加有两种情况：现有表单项可满足 和 现有表单项不可满足
    1. 现有表单项可满足，则添加表单项即可，同时注意表单项宽度配置100%，除非不需要占满；
    2. 现有表单项不可满足，则使用「自定义表单项」来包裹各类UI组件；
  - 任意表单项（包含「自定义表单项」）除了自身配置外，都可配置 :child(mybricks.normal-pc.form-container/form-item) 下的所有配置，此时path需要添加“:parent”前缀。
    例如：
      - configs:[{ "path": ":parent/表单项/标题", "value": "标题" }, { "path": ":parent/表单项/字段", "value": "key" }] 来配置和表单关联的字段和标题；
      - configs:[{ "path": ":parent/表单项/样式/宽度配置(共24格)", "value": 4 }] 来配置当前表单项占满24栅格的比例；
      - configs:[{ "path": ":parent/表单项/样式/必填样式", "value": true }] 来展示红色必填*号；
- 配置操作区：配置提交、重置等按钮列表，默认展示提交和取消两个按钮；
  - 确定是否展示操作区
    - 如果需要，配置自定义按钮列表和样式。
    - 如果不需要，配置关闭操作区。
- 配置样式：关注样式配置
  - 注意：表单容器默认没有内间距，只是表单项最下方包含一个24px的外间距；
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
        description: '必须配置，label文本和内容项的排列方式，可选值为top/left，top(上方，省空间，常用) 或 left(左侧)',
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
      '表单容器/标题/显示冒号',
      
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
        '表单项/字段',
        '表单项/标题提示',
        '表单项/提示语',
        '表单项/样式/宽度配置(共24格)',
        '表单项/样式/必填样式',
        '样式/标题/字体',
        '样式/提示语',
      ]
    }
  },
  requires: [`mybricks.normal-pc.${version}form-item-container`]
}