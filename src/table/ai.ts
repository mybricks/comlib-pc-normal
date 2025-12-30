const version = ANTD_VERSION === 4 ? "" : "antd5."

export default {
  prompts: {
    summary: `数据表格 Table，支持分页、特殊列、自定义内容列。`,
    usage: `数据表格 Table，支持分页、特殊列、自定义内容列。
slots插槽
动态插槽，当column的contentType为slotItem时，对应列的key

使用步骤：
- 添加并确定列：
  - 配置「表格列」，并确定每一列的宽度和类型进行添加，对于不同的类型，继续以下流程：
    - 如果是自定义内容列，会添加对应列的key的插槽，插槽为空内容，先添加一个布局容器后，添加各种内容
      - 比如添加可点击文本，为可操作列
      - 比如添加表单项，为输入列
    - 如果是链接列，注意链接默认为蓝色
- 确定是否包含固定列配置；
- 确定分页配置：开启后，UI默认在右下角展示分页器组件，从左到右包含「总结条数」「分页器」「每页条数下拉选择」「跳页器」；

注意：无需关心dataSource，数据从输入项外部输入即可。
  `,
  },
  // editors: {
  //   ':root': [
  //     '常规/列/列宽分配',
  //     {
  //       title: '常规/表格列',
  //       description: `通过数组来配置所有列
  // [ # 表格列配置
  //   {
  //     key: string # 列唯一标识
  //     dataIndex: string
  //     title: string # 列标题
  //     width: string | number 
  //     isRowKey: boolean 
  //     contentType: ['text', 'link', 'slotItem'] # 列内容类型，默认为text
  //     fixed: 'left' | 'right' # 固定左边右边
  //   }
  // ]
  // `,
  //       type: 'array',
  //       value: {
  //         set: ({ data, slot, ...extra }, value) => {

  //           console.log('data.columns', 111)
  //           data.columns = value.map(t => ({
  //             ...t,
  //             visible: t.visible ?? true
  //           }))
  //           data.columns.forEach(col => {
  //             if (col.contentType === 'slotItem') {
  //               col.slotId = col.key;
  //               slot.add({ id: col.slotId, title: `${col.title}-列`, type: 'scope' })
  //             }
  //           })

  //           console.log('data.columns', data.columns)

  //         }
  //       }
  //     },
  //     '常规/分页模式',
  //     '样式/默认/表格容器',
  //     '样式/默认/表格',
  //     '样式/默认/单元格',
  //     '样式/默认/行'
  //   ],
  //   // [COLUMN_EDITORS_CLASS_KEY]: {
  //   //   get title() {
  //   //     return 'thead th[data-table-th-idx="列的key字段"]'
  //   //   },
  //   //   configs: [
  //   //     '常规/内容省略展示',
  //   //     '高级/排序/使用排序',
  //   //     '样式/单行',
  //   //     '样式/双行',
  //   //     '样式/默认/表头',
  //   //     '样式/默认/分割线',
  //   //     '样式/默认/内容',
  //   //     '样式/表头对齐方式'
  //   //   ]
  //   // },
  //   ['[data-table-pagination]']: {
  //     get title() {
  //       return "[data-table-pagination]"
  //     },
  //     configs: [
  //       '常规/位置',
  //       '常规/默认每页显示条数',
  //       '高级/跳页功能',
  //       '高级/条数选择功能',
  //       '高级/条数配置',
  //       '样式/默认/页码',
  //       '样式/默认/页码字体',
  //       '样式/默认/翻页按钮',
  //       '样式/默认/前置文案字体',
  //       '样式/默认/条数选择',
  //       '样式/默认/条数选择标签'
  //     ]
  //   }
  // },
  editors: [
    '常规/列/列宽分配',
    {
      title: '常规/表格列',
      description: `通过数组来配置所有列
[ # 表格列配置
  {
    key: string # 列唯一标识
    dataIndex: string
    title: string # 列标题
    width: string | number 
    isRowKey: boolean 
    contentType: ['text', 'link', 'slotItem'] # 列内容类型，默认为text
  }
]
`,
      type: 'array',
      value: {
        set: ({ data, slot, ...extra }, value) => {
          data.columns = value.map(t => ({
            ...t,
            visible: t.visible ?? true
          }))
          data.columns.forEach(col => {
            if (col.contentType === 'slotItem') {
              col.slotId = col.key;
              slot.add({ id: col.slotId, title: `${col.title}-列`, type: 'scope' })
            }
          })
        }
      }
    },
    '常规/分页模式',
    '样式/默认/表格容器',
    '样式/默认/表格',
    '样式/默认/表头',
    '样式/默认/单元格',
    '样式/默认/行'
  ],
}