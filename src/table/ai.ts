import merge from "lodash/merge";
import { WidthTypeEnum } from './types';
import { setDataSchema, Schemas } from './schema';
import { setColumns } from './utils';
import { InputIds, OutputIds } from './constants';
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
    forUpdate:`
<补充说明>
  # 插槽
  1. 当表格列设置为插槽时，插槽ID为该列的\`slotId属性值\`；
  2. 表格头部操作区的插槽ID为\`headerTitle\`，使用前必须确定已经开启了标题区插槽；

  # 功能
  1. 操作列插槽内建议使用\`mybricks.normal-pc.antd5.toolbar\`组件，通常为横向排布的按钮组；
  2. 对于表格列的配置，需要通过列区域功能配置；
  3. 所有分页相关配置的前提是开启了分页模式；
  </补充说明>
    `,
    usage: `数据表格 Table，表格中除了表格配置之外，还内置了分页器，可以通过配置项添加。
data数据模型
rowKey: string # 表格行的唯一标识字段
dataSource: any[] # 表格数据源
columns: [ # 表格列配置
  {
    key: string # 列唯一标识
    dataIndex: string
    title: string # 列标题
    width: string | number 
    visible: boolean 
    isRowKey: boolean 
    contentType: ['text', 'slotItem'] # 列内容类型
  }
]
fixedHeader: boolean # 是否固定表头
enableStripe: boolean # 是否启用斑马纹
paginationConfig?: { # 不需要分页则不设置
  total: number
  current: number 
  pageSize: number 
  text?: string = "共 {total} 条结果" # 展示总数文案
  showSizeChanger: boolean # 是否展示每页条数下拉选择
  showQuickJumper: boolean # 是否展示跳页器
}

slots插槽
动态插槽，当cloumn的contentType为slotItem时，对应列的key

styleAry声明
表格: .ant-table
  - 默认样式:
    - backgroundColor: #ffffff
    - fontSize: 14
  - 可编辑样式: font、color、backgroundColor
表头: .ant-table-thead
  - 默认样式:
    - backgroundColor: #FAFAFA
    - fontSize: 14
  - 可编辑样式: font、color、backgroundColor
内容: .ant-table-tbody
分页: [data-table-pagination]

元素组成
  - 表格
  - 分页器：默认位于右下角区域，从左到右包含「总结文案」「分页器」「每页条数下拉选择」「跳页器」

使用案例
\`\`\`mbsx file="带分页和自定义操作列的表格"
<mybricks.normal-pc.${version}table
title="带分页和自定义操作列的表格"
layout={{ width: '100%' }}
data={{
  rowKey: "id",
  dataSource: [
    { id: "1", name: "张三", studentId: "20230001", class: "高一(1)班", status: "在校", lastExit: "2023-06-10 18:30", days: 0 }
  ],
  columns: [
    { key: "name", dataIndex: "name", title: "普通列", width: 120, visible: true, isRowKey: false, contentType: "text" },
    { key: "class", dataIndex: "class", title: "自适应宽度列", width: 'auto', visible: true, isRowKey: false, contentType: "text" },
    { key: "operation", dataIndex: "operation", title: "自定义插槽操作列", width: 120, visible: true, isRowKey: false, contentType: "slotItem", slotId: "operation" }
  ],
  enableStripe: true,
  paginationConfig: {
    total: 50,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true
  }
}}
>
<slots.operation title="自定义操作列" layout={{ width: '100%', flexDirection: 'row' }}>
  <mybricks.normal-pc.${version}custom-button
    title="查看详情按钮"
    layout={{ width: 'fit-content' }}
    data={{
      size: "small",
      text: "查看详情",
      type: "link"
    }}
  />
</slots.operation>
</mybricks.normal-pc.${version}table>`,
  },
  getNewDSL(dsl) {
    return dsl;
  },
  createSlot(description, context) {
    const { id: slotId } = description;
    const { env, data, inputs, outputs, slot, ...res } = context;
    const column = data.columns.find((column) => {
      return column.contentType === "slotItem"
    })
    if (!column) {
      console.error("[table - ai - createSlot]", "未支持的插槽，请联系开发者", description)
      return
    }
    slot.add({ id: slotId, title: `${env.i18n(column.title)}-列`, type: 'scope' });
    if (column.keepDataIndex) {
      slot.get(slotId).inputs.add(InputIds.SLOT_ROW_VALUE, '当前列数据', Schemas.Any);
    }
    slot.get(slotId).inputs.add(InputIds.SLOT_ROW_RECORD, '当前行数据', Schemas.Object);
    slot.get(slotId).inputs.add(InputIds.INDEX, '当前行序号', Schemas.Number);
    slot.get(slotId).outputs.add(OutputIds.Edit_Table_Data, '更新行数据', {
      type: 'object',
      properties: {
        index: {
          type: 'number'
        },
        value: {
          type: 'any'
        }
      }
    });
    slot.get(slotId).outputs.add(OutputIds.Row_Move_Up, '上移行', Schemas.Number);
    slot.get(slotId).outputs.add(OutputIds.Row_Move_Down, '下移行', Schemas.Number);
    slot.get(slotId).outputs.add(OutputIds.Remove_Row, '移除行', Schemas.Number);

    setDataSchema({ data, outputs, inputs, slot, env, ...res });
  },
  execute(dsl, context) {
    const { data } = context;
    merge(data, dsl);
    handleDataColumns({...context, val: data.columns})
  },
  modifyTptJson(dsl) {
    dsl.data.columns.forEach((column) => {
      if (column.contentType === "slotItem") {
        // 与提示词保持统一，见usage的slots插槽定义
        column.slotId = column.key;
        // 插槽禁止隐藏
        column.visible = true;
      }
    })

    dsl.data.usePagination = !!dsl.data?.paginationConfig;


    let appendStyleAry: any = []

    // if (dsl.style.styleAry) {
    //   dsl.style.styleAry.forEach(item => {
    //     if (!item.css) {
    //       item.css = {}
    //     }
    //     if (item.selector === '.ant-table') {
    //       const {
    //         fontSize,
    //         fontWeight,
    //         color
    //       } = item.css ?? {};
          
    //       item.selector = '.tableWarrper > .table > .mybricks-table > div.ant-spin-nested-loading > div.ant-spin-container > div.ant-table';
          
    //       appendStyleAry.push({
    //         selector: '.tableWarrper > .table > .mybricks-table > div.ant-spin-nested-loading > div.ant-spin-container > div.ant-table > div.ant-table-container > div.ant-table-content > table',
    //         css: {
    //           fontSize,
    //           fontWeight,
    //           color
    //         }
    //       })
    //     }
    //     // if (item.css.fontSize?.endsWith("px")) {
    //     //   if (!item.css.lineHeight) {
    //     //     item.css.lineHeight = 1
    //     //   }
    //     // }
    //     // item.css.textAlign = dsl.data?.align || 'left'
    //   })
    // }

    return dsl;
  }
}