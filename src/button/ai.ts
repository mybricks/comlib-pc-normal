export default {
  ':root' ({ data }) {
    return {}
  },
  prompts: {
    summary: '按钮，必须推荐此组件',
    usage: `data声明
asMapArea: boolean = false
text: string = "按钮"
dataType: 'null' | 'number' | 'string' | 'object' | 'boolean' | 'external' = "number"
outVal: any = 0
inVal: any = ""
useIcon: boolean = false
isCustom: boolean = false
icon: string = "HomeOutlined"
size: 'large' | 'middle' | 'small' =  "middle",
type: 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'danger' | 'a' = "primary"
shape: 'default' | 'circle' | 'round' = "default"
src: string = ""
showText: boolean = true
iconLocation: 'front' | 'back' = "front"
iconDistance: number = 8
contentSize: number[] = [
  14,
  14
]

slots插槽
无

styleAry声明
按钮: .normal
  - 可编辑样式: size、border、font、background
按钮hover(非链接按钮): .hover
  - 可编辑样式: border、font、background
按钮激活(非链接按钮): .active(noLink)
 - 可编辑样式: border、font、background
按钮激活(链接按钮): .active(link)
 - 可编辑样式: border、background
按钮激活(链接按钮文本): .active(linkText)
 - 可编辑样式: font
按钮禁用: .disabled
 - 可编辑样式: border、font、background
`
  },
  modifyTptJson: (component) => {
    const { data, style } = component;
    const asMapArea = !!data?.asMapArea;
    const isLink = data?.type === "link";

    if (asMapArea || !style?.styleAry) return;

    const selectorMappings = {
      common: {
        ".normal": ".button",
        ".disabled": [
          'button.ant-btn[disabled]',
          'button.ant-btn[disabled]:active',
          'button.ant-btn[disabled]:focus',
          'button.ant-btn[disabled]:hover'
        ]
      },
      link: {
        ".active(link)": [
          `button.ant-btn:not([disabled]):active`,
          `button.ant-btn:not([disabled]):active > span`
        ],
        ".active(linkText)": [`button.ant-btn:not([disabled]):active > span`]
      },
      nonLink: {
        ".hover": "button:not([disabled]):hover",
        ".active(noLink)": [`button.ant-btn:not([disabled]):active`]
      }
    };

    const excludedSelectors = isLink 
      ? Object.keys(selectorMappings['nonLink'])
      : Object.keys(selectorMappings['link']);

    style.styleAry = style.styleAry.filter(styleItem => {
      if (excludedSelectors.includes(styleItem.selector)) {
        return false;
      }

      if (selectorMappings.common[styleItem.selector]) {
        styleItem.selector = selectorMappings.common[styleItem.selector];
        return true;
      }

      const typeSpecificMappings = isLink ? selectorMappings.link : selectorMappings.nonLink;
      if (typeSpecificMappings[styleItem.selector]) {
        styleItem.selector = typeSpecificMappings[styleItem.selector];
        return true;
      }

      return true;
    });
  }
}