export default {
  ':root'({ data }) {
    return {}
  },
  prompts: {
    summary: `单行文本输入框 Input
表单项组件，schema=form-item`,
    usage: `单行文本输入框 Input
表单项组件，schema=form-item

data数据模型
visible?: boolean = true
rules: []
validateTrigger: ['onBlur', 'onPressEnter']
config: {
  allowClear: boolean = true
  placeholder: string = '请输入内容' 
  disabled: boolean = false
  addonBefore?: string # 前置标签
  addonAfter?: string # 后置标签
  showCount?: boolean = false
  maxLength?: number = -1
  size?: ['middle', 'small', 'large'] = 'middle'
}

slots插槽
无

schema声明
form-item

layout声明
width: 默认为100%
height: 不可配置，默认为fit-content (约等于32px)

styleAry声明
输入框: .ant-input
  - 默认样式
    - borderWidth: 1px
    - borderColor: #D9D9D9
    - borderStyle: solid
    - borderRadius: 6px
    - backgroundColor: #FFFFFF
    - color: #000000
    - fontSize: 14px
  - 可配置样式: border, backgroundColor, color, fontSize

输入框: .ant-input:hover 
  - 默认样式
    - borderColor: #1677ff
  - 可配置样式: borderColor`
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
  }
}