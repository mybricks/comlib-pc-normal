
export default function({Util}) {
  const result = {}

  const mayBeBooleanEnumMap = {
    '开启': true,
    '打开': true,
    '开': true,
    true: true,
    '关闭': false,
    '关': false,
    false: false,
  }
  result['内容'] = {
    "Q": "将链接文字内容为 @string",
    "A": {
      "content": "{0}",
    }
  }
  result['链接'] = {
    "Q": "将链接的地址/url设置为 @string",
    "A": {
      "url": "{0}",
    }
  }
  result['图标自定义'] = {
    "Q": "将链接的图标自定义设置为 @boolean",
    "A": {
      "isChoose": "{0}",
    }
  }
  result['选择图标'] = {
    "Q": "将链接的图标设置为 @string",
    "A": {
      "icon": "{0}",
    }
  }
  
  result['图标位置'] = {
    "Q": "将图标的位置设置为 @string",
    "A": {
      "location": "{0}",
    }
  }
  result['最大显示行数'] = {
    "Q": "将图标的最大显示行数设置为 @number",
    "A": {
      "isEllipsis": true,
      "ellipsis": { rows: '{0}' }
    }
  }

  return result
}