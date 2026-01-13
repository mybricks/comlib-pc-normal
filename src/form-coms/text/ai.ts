export default {
  ':root'({ data }) {
    return {}
  },
  prompts: {
    summary: `单行文本输入框 Input
表单项组件，schema=form-item`,
    usage: `单行文本输入框 Input
表单项组件，schema=form-item

slots插槽
无

schema声明
form-item

layout声明
width: 为100%
height: 不可配置，为fit-content (height=32px)，不能配置其他高度

styleAry声明
输入框:
  - 默认样式
    - borderWidth: 1px
    - borderColor: #D9D9D9
    - borderStyle: solid
    - borderRadius: 6px
    - backgroundColor: #FFFFFF
    - color: #000000
    - fontSize: 14px
    - 可配置样式: border, backgroundColor, color, fontSize
  - Hover和Focus
    - borderColor: #1677ff
    - 可配置样式: borderColor
      
注意：
- 前置标签和后置标签仅支持文本配置，配置后展示一个灰色前后缀；
- 由于无法配置高度，实现特殊样式时可以将当前组件包裹在容器中，用容器来实现样式。
  `
  },
  editors: [
    '常规/提示内容',
    '常规/显示清除图标',
    '常规/禁用状态',
    '常规/显示字数',
    '常规/前置标签',
    '常规/后置标签',
    '样式/尺寸',
    '样式/边框',
    '样式/背景色',
    '样式/文本内容',
    '样式/提示内容',
    '样式/清除按钮',
    '样式/Hover/边框',
    '样式/Hover/清除按钮',
    '样式/Focus/边框',
  ],
}