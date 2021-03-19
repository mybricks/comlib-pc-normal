export default {
  '[data-btns-type=submit]': {
    title: '提交按钮',
    items: [
      {
        title: '标题',
        type: 'text',
        value: {
          get({data}) {
            return data.buttons.submit.title
          }, set({data}, val) {
            data.buttons.submit.title = val
          }
        }
      },
      {
        title: '事件',
        sameAs: 'shortcut',
        items: [
          {
            title: '提交数据',
            type: 'button',
            value: {
              set({diagram}) {
                diagram.edit('submitTo')
              }
            }
          }
        ]
      }
    ]
  }
}