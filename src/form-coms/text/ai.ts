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
      
注意：由于无法配置高度，实现特殊样式时可以将当前组件包裹在容器中，用容器来实现样式。
  `
  },
  modifyTptJson: (component) => {
    let borderDomSelector, backgroundDomSelector, fontDomSelector, hoverBorderDomSelector;

    if (component.style.styleAry) {
      component.style.styleAry.forEach(item => {
        if (!item.css) {
          item.css = {}
        }
        if (item.selector === '.ant-input') {
          const { borderWidth, borderColor, borderStyle, borderRadius, backgroundColor, color, fontSize } = item.css
          borderDomSelector = {
            selector: '.ant-input-affix-wrapper',
            css: {}
          }
          borderDomSelector.css = {
            borderWidth,
            borderColor,
            borderStyle,
            borderRadius,
          }

          backgroundDomSelector = {
            selector: ['.ant-input-affix-wrapper', '.ant-input-affix-wrapper>input.ant-input'],
            css: {}
          }
          backgroundDomSelector.css = {
            backgroundColor
          }

          fontDomSelector = {
            selector: '.ant-input',
            css: {}
          }
          fontDomSelector.css = {
            color,
            fontSize
          }
        }

        if (item.selector === '.ant-input:hover') {
          const { borderWidth, borderColor, borderStyle, borderRadius } = item.css
          hoverBorderDomSelector = {
            selector: '.ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover',
            css: {}
          }
          hoverBorderDomSelector.css = {
            borderWidth,
            borderColor,
            borderStyle,
            borderRadius,
          }
        }
      })

      component.style.styleAry = [
        borderDomSelector,
        backgroundDomSelector,
        fontDomSelector,
        hoverBorderDomSelector
      ].filter(item => !!item && Object.keys(item?.css ?? {}).length > 0)
    }
  },
  editors: [
    '常规/提示内容',
    '常规/显示清除图标',
    '常规/禁用状态',
    '常规/显示字数',
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