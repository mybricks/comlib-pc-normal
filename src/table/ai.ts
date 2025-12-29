import merge from "lodash/merge";
import { WidthTypeEnum } from './types';
import { setDataSchema, Schemas } from './schema';
import { setColumns } from './utils';
import { InputIds, OutputIds, COLUMN_EDITORS_CLASS_KEY } from './constants';
const version = ANTD_VERSION === 4 ? "" : "antd5."

const handleDataColumns = (params) => {
  const { data, val, slot } = params
  let newRowKey = data?.rowKey;
  for (let item of val) {
    if (item.dataIndex === '') {
      item.dataIndex = item.title;
    }

    // 保证每次只有一个isRowKey是true
    if (item?.isRowKey && data.rowKey !== item.dataIndex) {
      newRowKey = String(item.dataIndex);
    }
    // 开启唯一key之后不能取消
    else if (data.rowKey === item.dataIndex && !item?.isRowKey) {
      // @ts-ignore
      item._renderKey = uuid(); // 新增一个随机的值renderKey刷新防止不更新
    }
  }

  data.rowKey = newRowKey;

  const cols = val.map((item) => ({
    ...item,
    width: item.isAutoWidth ? WidthTypeEnum.Auto : Number(item.width) || 140,
    isAutoWidth: undefined,
    isRowKey: data?.rowKey && item?.dataIndex === data?.rowKey
  }));
  setColumns({ data, slot }, cols);
  setDataSchema(params);
}

export default {
  prompts: {
    summary: `数据表格 Table，表格中除了表格配置之外，还内置了分页器，可以通过配置项添加。`,
    usage: `数据表格 Table，表格中除了表格配置之外，还内置了分页器，可以通过配置项添加。
slots插槽
动态插槽，当column的contentType为slotItem时，对应列的key

使用步骤：
- 添加并确定列：
  - 配置「表格列」，并确定每一列的宽度和类型，添加进去。
- 对于自定义内容列，添加合理的内容，注意先添加布局容器；
- 对于链接列（link），注意颜色是否合理；
- 确定是否包含固定列兵配置；
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
    '样式/默认/单元格',
    '样式/默认/行'
  ],
}