({Util}) => {
  const result = {}
  // 显示标题
  result['显示标题'] = {
    Q: '如何显示标题？',
    A: {
      showTitle: true,
    },
  }
  // 标题内容
  const title = Util.random.word()
  result['标题内容'] = {
    Q: `修改标题内容为${title}`,
    A: {
      showTitle: true,
      title: title
    },
  }
  // 开启卡片右上角操作
  result['开启卡片右上角操作'] = {
    Q: `如何开启右上角操作？`,
    A: {
      useExtra: true
    },
  }
  // 操作组
  result['操作组'] = {
    Q: `如何开启操作组？`,
    A: {
      isAction: true,
      items: [],
    },
  }
  // 操作项配置
  result['操作项配置'] = [
    {
      Q: `如何添加操作项？`,
      A: {
        isAction: true,
        items: [
          {
            name: `操作项1`,
            key: Util.uuid()
          }
        ],
      },
    }
  ]

  return result
}