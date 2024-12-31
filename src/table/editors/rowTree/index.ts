const rowTreeEditor = {
  items: [
    {
      title: "树形数据展开框",
      options: [
        {
          type: 'border',
          config: {
            disableBorderWidth: true
          }
        },
        {
          type: 'background',
          config: {
            disableBackgroundImage: true
          }
        }
      ],
      target: `.ant-table-cell-with-append .ant-table-row-expand-icon`
    },
    {
      title: '树形数据展开图标',
      catelog: '默认',
      options: [{
        type: 'font', config: {
          disableTextAlign: true,
          disableFontFamily: true,
          disableFontWeight: true,
          disableFontSize: true,
          disableLineHeight: true,
          disableLetterSpacing: true,
          disableWhiteSpace: true,
        }
      }],
      target: [
        `.ant-table-cell-with-append .ant-table-row-expand-icon:before`,
        `.ant-table-cell-with-append .ant-table-row-expand-icon:after`
      ]
    }
  ]
}

export default rowTreeEditor;
