
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
    "Q": "文本输入框如何设置内容为 @string",
    "A": {
      "content": "{0}",
    }
  }
  result['文本溢出/省略'] = {
    "Q": "将文本输入框的‘文本溢出/省略’ 设置为 @boolean",
    "A": {
      "isEllipsis": "{0}",
    }
  }
  result['最大显示行数'] = {
    "Q": "将文本输入框的最大显示行数设置为 @number",
    "A": {
      "isEllipsis": true,
      "ellipsis": { rows: '{0}' }
    }
  }

  return result
}