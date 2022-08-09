export default {
  ':root' ({data}: EditorResult<{ type }>, ...catalog) {
    catalog[0].title = '常规';

    catalog[0].items = [
      {
        title: '事件',
        items: [
          {
            title: '值发生改变',
            type: '_event',
            options: {
              outputId: 'onChange'
            }
          }
        ]
      },
    ]
  }
}