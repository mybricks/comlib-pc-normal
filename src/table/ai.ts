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
    summary: '数据表格',
    usage: `data数据模型
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
usePagination: boolean
paginationConfig: { 
total: number
current: number 
pageSize: number 
showSizeChanger: boolean 
showQuickJumper: boolean 
}

slots插槽
动态插槽，当cloumn的contentType为slotItem时，对应列的key

styleAry声明
表格: .ant-table
表头: .ant-table-thead
内容: .ant-table-tbody
分页: [data-table-pagination]

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
  usePagination: true,
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
//     usage: `
// # data定义
// \`\`\` typescript
// interface IColumn {
//   /** 唯一随机key */
//   key: string;
//   /** 字段名 */
//   dataIndex: string | string[];
//   /** 列名 */
//   title: string;
//   /**
//    * 列内容类型
//    * text - 普通文字
//    * image - 图片
//    * link - 链接
//    * slotItem - 自定义插槽
//    * group - 分组
//    * switch - 开关
//    */
//   contentType: 'text' | 'image' | 'link' | 'slotItem' | 'group' | 'switch';
//   /** 当 contentType !== 'group' 时，配置列是否展示 */
//   visible?: boolean;
//   /** 
//    * 当 contentType !== 'group' 时，配置列宽
//    * number - 固定宽度
//    * auto - 当前表格列将会填充剩余宽度
//    */
//   width?: number | 'auto';
//   /** 显示提示，开启后，支持配置表头提示文案，鼠标hover时可以显示自定义信息，用于添加对表格列的说明。 */
//   hasTip?: boolean;
//   /** 当 hasTip === true 时配置提示文案 */
//   tip?: string;
//   /** 当 contentType === 'text' 时，配置内容省略展示，开启后，表格的单元格宽度不够时，内部文本内容可以自动省略、不换行、以省略号结尾 */
//   ellipsis?: any;
//   /** 当 contentType === 'text' || contentType === 'slotItem' 时，配置排序相关配置 */
//   sorter?: {
//     /** 开启排序 */
//     enable: boolean;
//     /** 
//      * 当 enable === true 时，配置排序方式
//      * length - 字符长度
//      * size - 数字大小
//      * date - 时间前后
//      * request - 自定义
//      */
//     type: 'length' | 'size' | 'date' | 'request';
//   };
//   /** 当 contentType === 'text' || contentType === 'slotItem' 时，配置筛选相关配置 */
//   filter?: {
//     /** 开启删选，开启后，可以对表格数据进行筛选设置。同时会开启表格输入项【获取筛选数据】【设置筛选数据】【设置筛选项】，用户可以通过逻辑连线实现对应筛选需求 */
//     enable?: boolean;
//     /** 
//      * 筛选方式
//      * local - 本地筛选
//      * request - 请求接口
//      */
//     type?: 'local' | 'request';
//     /** 当 enable && filterSource !== 'request' 时配置自定义筛选项，筛选采用【本地定义】方式后，可以设置键值对来自定义筛选项' */
//     options?: any[];
//     /** 当 enable === true 时配置隐藏筛选菜单 */
//     hideFilterDropdown?: boolean;
//     /** 
//      * 筛选项来源，定义筛选项数据的来源方式
//      * local - 本地定义
//      * request - 接口获取
//      */
//     filterSource?: 'local' | 'request';
//     /**
//      * 筛选类型，筛选支持单选或多选
//      * multiple - 多选
//      * single - 单选
//      */
//     filterType?: 'multiple' | 'single';
//     /** 筛选图标继承自表格 */
//     filterIconInherit?: boolean;
//     /** 当 enable && filterIconInherit === false 时配置筛选图标，来自图标库的图标 */
//     filterIcon?: string;
//   };
//   /** 当 contentType === 'slotItem' 时，对应插槽的id，禁止修改 */
//   slotId?: string;
//   /** 
//    * 当 contentType !== 'gloup' && data.tableLayout !== 'auto' 时配置固定列，对于列数很多的数据，可以固定前后的列，横向滚动查看其它数据
//    * left - 左固定
//    * right - 右固定
//    * '' - 默认
//    */
//   fixed?: 'left' | 'right' | '';
//   /** 当 contentType === 'group' 时，配置分组的子项 */
//   children?: IColumn[];
//   /**
//    * 当 sorter.enable === true 时配置表头对齐方式
//    * left - 左对齐
//    * center - 居中对齐
//    * right - 右对齐
//    */
//   sorterAlign?: 'left' | 'center' | 'right';
//   /** 配置是否作为rowKey，只能有一项被作为rowKey，设置为true，其余均为false */
//   isRowKey?: boolean; // 是否是rowKey
// }

// export interface Data {
//   /** 数据源唯一标识字段，该标识字段的值需要全局唯一 */
//   rowKey?: string;
//   /** 表格列配置 */
//   columns: IColumn[];
//   /** 控制是否显示每列的列名，关闭后，只显示表格内容区域 */
//   showHeader?: boolean;
//   /** 显示列设置按钮，开启后，支持在表格右上角显示列设置按钮，可以在运行时调整展示列的顺序、固定和显隐 */
//   useColumnSetting?: boolean;
//   /** 
//    * 列宽分配
//    * fixedWidth - 固定列宽(不自动适配)
//    * fixed - 按比例分配多余宽度
//    * auto - 按比例适配（无横向滚动条）
//    */
//   tableLayout?: 'fixedWidth' | 'fixed' | 'auto';
//   /** 展示表格边框 */
//   bordered: boolean;
//   /**
//    * 部分风格、尺寸
//    * default - 默认
//    * middle - 适中布局
//    * small - 紧凑布局
//    */
//   size: 'default' | 'middle' | 'small';
//   /** 当组件 layout.height === 'auto' 时，可以配置固定表头，开启后，表头固定，表格内容支持滚动。可以设置编辑项【可滚动最大高度】和【固定高度】来控制滚动 */
//   fixedHeader: boolean;
//   /** 斑马纹，开启后，可以设置表格的单双行采用不同样式 */
//   enableStripe: boolean;
//   /** 滚动相关配置 */
//   scroll: {
//     /** 当 data.fixedHeader && layout.height === 'auto' 时，可配置可滚动最大高度，设置表格的可滚动最大高度，开启固定表头后生效 */
//     y: string | undefined
//     /** 自动滚动到首行，当分页、排序、筛选变化后是否滚动到表格顶部 */
//     scrollToFirstRowOnChange: boolean;
//   };
//   /** 动态设置loading，开启后，支持通过逻辑连线设置表格为loading状态 */
//   useLoading: boolean;
//   /** 配置loading状态的文案 */
//   loadingTip?: string;
//   /** 开启勾选功能，开启后，可以进行表格勾选相关的操作。同时可以通过逻辑连线连接输入项【获取勾选数据】和【清空勾选】 */
//   useRowSelection: boolean;
//   /** 当 data.useRowSelection === ture 时配置行点击触发勾选，开启后，通过点击表格行就可以触发勾选，不需要额外开启行点击事件 */
//   enableRowClickSelection: boolean;
//   /** 
//    * 当 data.useRowSelection === true 时配置勾选类型
//    * radio - 单选
//    * checkbox - 批量选择
//    */
//   selectionType: 'radio' | 'checkbox';
//   /** 
//    * 当 data.selectionType === 'checkbox' 时配置勾选操作区位置，当数组里同时包含top、bottom时，同时开启顶部和底部的勾选操作区
//    * top - 开启顶部勾选操作区
//    * bottom - 开启底部勾选操作区
//    */
//   rowSelectionPostion?: Array<'top' | 'bottom'>;
//   /** 当 data.selectionType === 'checkbox' 时配置勾选限制，设置最多勾选几行数据，0表示不限制 */
//   rowSelectionLimit?: number;
//   /** 使用动态设置勾选项，开启后，可以通过逻辑连线连接输入项【设置勾选项】, 实现动态设置勾选项 */
//   useSetSelectedRowKeys?: boolean;
//   /** 动态设置禁用勾选，开启后，可以通过逻辑连线连接输入项目【设置禁用勾选】，实现动态设置禁用勾选 */
//   useSetDisabledRowSelection?: boolean;
//   /** 勾选文案，例：已选中 {count} 项, 注意 {count}必填，代表勾选数量 */
//   rowSelectionMessage?: string;
//   /** 开启标题区插槽，开启后，支持在表格左上角自定义内容 */
//   useHeaderTitleSlot?: boolean;
//   /** 开启头部操作区插槽，开启后，支持在表格右上角自定义内容 */
//   useHeaderOperationSlot?: boolean;
//   /** 表格行展开，开启后，支持自定义行展开内容 */
//   useExpand?: boolean;
//   /** 当 data.useExpand === true 时配置展开字段，[非必填]与后端返回数据字段对应 */
//   expandDataIndex?: string | string[];
//   /** 开启分页模式 */
//   usePagination?: boolean;
//   /** 当 data.usePagination === true 时，配置分页器的配置 */
//   paginationConfig: {
//     /** 
//      * 当 data.rowSelectionPostion 数组内没有 bottom 时配置分页器位置
//      * flex-start - 居左
//      * center - 居中
//      * flex-end - 居右
//      */
//     align: 'flex-start' | 'center' | 'flex-end';
//     /** 
//      * 尺寸
//      * default - 正常
//      * small - 小
//      * simple - 简单模式
//      */
//     size: 'default' | 'small' | 'simple'
//     /** 默认每页显示条数 */
//     defaultPageSize: number
//     /** 前端分页，开启后，会自动根据当前页码/条目数分页展示 */
//     useFrontPage: boolean
//     /** 当 data.paginationConfig.size !== 'simple' 时配置前置说明文字，格式：{start}当前页起始条目，{end}当前页结束条目，{total}总条目数 */
//     text: string
//     /** 当 data.paginationConfig.size !== 'simple' 时配置开启跳页功能，打开该功能后，支持直接输入页码跳转(当页数为1时，不显示跳页操作) */
//     showQuickJumper: boolean
//     /** 当 data.paginationConfig.size !== 'simple' 时配置开启条数选择功能，打开该功能后，不再支持页数为1时隐藏功能 */
//     showSizeChanger: boolean
//     /** 当  data.paginationConfig.showSizeChanger && data.paginationConfig.size !== 'simple' 时，配置条数切换器可选的条目数，仅识别正整数 */
//     pageSizeOptions: string[]
//     /** 当 !data.paginationConfig.showSizeChanger || data.paginationConfig.size === 'simple' 时，配置页数为1时隐藏分页器 */
//     hideOnSinglePage: boolean
//   }
//   /** 行点击，开启后，可以响应行点击事件 */
//   enableRowClick?: boolean;
//   /** 行双击，开启后，可以响应行双击事件 */
//   enableRowDoubleClick?: boolean;
//   /** 单元格点击，开启后，可以响应表格的单元格点击事件 */
//   enableCellClick?: boolean;
//   /** 单元格选中状态 */
//   enableCellFocus?: boolean;
//   /** 是否默认展开所有行，开启后，默认展开每一行数据, 支持自定义展开项和树形结构的默认展开 */
//   defaultExpandAllRows: boolean;
//   /** 开启总结栏，开启后，支持设置总结栏 */
//   useSummaryColumn: boolean;
//   /** 总结栏标题 */
//   summaryColumnTitle: string;
//   /** 总结栏标题列数，标题占据的列数，内容占据剩余所有列 */
//   summaryCellTitleCol: number;
//   /** 
//    * 总结栏标题类型
//    * text - 普通文字
//    * slotItem - 自定义插槽
//    */
//   summaryColumnContentType: 'text' | 'slotItem';
//   /** 当 data.fixedHeader && layout.height === 'auto' 时配置表格固定高度，设置表格的固定高度，开启固定表头后生效 */
//   fixedHeight?: string | number;
//   /** 自定义空白状态 */
//   isEmpty: boolean;
//   /** 当 data.isEmpty === true 时配置空状态文案，自定义描述内容 */
//   description: string;
//   /** 当 data.isEmpty === true 时配置空状态图片地址 */
//   image: string;
//   /** 开启表格数据懒加载，当表格数据太大时，可以开启此项进行优化。初始只加载部分数据，滚动条接近底部时再多加载一部分数据，直到全部数据加载完（表格需要有滚动条才能生效） */
//   lazyLoad: boolean;
//   /** 表格筛选默认图标，来自图标库的图标 */
//   filterIconDefault?: string;
// }
// \`\`\`

// # slots定义
// | id | type | description |
// |------|--------|--------|
// | data.columns[].slotId | scope | 表格列动态插槽，当 \`data.columns[].contentType === "slotItem"\` 时，对应 \`data.columns[].slotId\` |
// | expandContent | scope | 展开内容插槽，当 \`data.useExpand === true\` 时允许使用 |
// | headerTitle | normal | 标题区插槽，当 \`data.useHeaderTitleSlot === true\` 时允许使用 |
// | headerOperation | normal | 右上角操作区插槽，当 \`data.useHeaderOperationSlot === true\` 时允许使用 |
// | rowSelectionOperation | scope | 勾选操作区插槽，当 \`data.useRowSelection && data.selectionType !== RowSelectionTypeEnum.Radio && data.rowSelectionPostion?.length\` 时允许使用 |
// | summaryColumn | scope | 自定义总结栏内容插槽，当 \`data.useSummaryColumn === true && data.summaryColumnContentType === "slotItem"\` 时允许使用 |

// <examples>
//   <!-- 功能问询 -->
//   <example>
//     <user_query>如何设置自定义loading文案</user_query>
//     <assistant_response>
//       在UI面板中，选中当前组件，在配置面板中的 **常规/自定义loading文案** 中，配置该表格的自定义loading文案
//     </assistant_response>
//   </example>
//   <!-- 内容修改 -->
//   <example>
//     <user_query>将自定义loading文案修改为加载中，请稍后</user_query>
//     <assistant_response>
//       好的，我将当前组件的自定义loading文案修改为加载中，请稍后
//       \`\`\`dsl file="component.dsl"
//       <mybricks.normal-pc.${version}table data={{useLoading: true, loadingTip: "加载中，请稍后"}}>
//       </mybricks.normal-pc.${version}table>
//       \`\`\`
//     </assistant_response>
//   </example>
//   <!-- 内容修改 -->
//   <example>
//     <user_query>搭建一个学生成绩单</user_query>
//     <assistant_response>
//       学生成绩单，一门学科一列，并且包含，学生姓名等信息
//       \`\`\`dsl file="component.dsl"
//       <mybricks.normal-pc.${version}table data={{columns: [{"title":"ID","key":"rowKey","width":"auto","visible":false,"contentType":"text","_id":"Jv9Egr","dataIndex":"id","isRowKey":true},{"title":"列2","key":"u_m80e7e","width":"auto","visible":true,"contentType":"text","_id":"6FkDxG","dataIndex":"列2","keepDataIndex":true,"filter":{"filterIconInherit":true},"sorter":{"enable":false,"type":"size"},"isRowKey":false},{"title":"列3","key":"u_nnkwke","width":"auto","visible":true,"contentType":"text","_id":"W7MqXz","dataIndex":"列3","keepDataIndex":true,"filter":{"filterIconInherit":true},"sorter":{"enable":false,"type":"size"},"isRowKey":false},{"title":"操作","key":"u_d978h0","width":"auto","visible":true,"contentType":"slotItem","_id":"qpqrfR","dataIndex":"action","keepDataIndex":true,"filter":{"filterIconInherit":true},"sorter":{"enable":false,"type":"size"},"isRowKey":false,"slotId":"u_m9c382","fixed":"right"}]}}>
//         <slots.u_m9c382 title="操作-列" type="scope">
//           <mybricks.normal-pc.${version}toolbar data={{"btnList":[{"key":"btn0","text":"编辑","showText":true,"dataType":"number","outVal":0,"inVal":"","isCustom":false,"contentSize":[14,14],"iconDistance":8,"src":"","loading":false,"useDynamicLoading":false,"style":{"height":"auto","width":"auto"},"useIcon":false,"type":"link"},{"key":"u_c9atjx","text":"删除","showText":true,"dataType":"number","outVal":0,"inVal":"","isCustom":false,"src":"","contentSize":[14,14],"iconDistance":8,"loading":false,"useDynamicLoading":false,"style":{"height":"auto","width":"auto"},"isSlot":false,"useIcon":false,"type":"link","danger":true}],"layout":"flex-start","spaceSize":[4,4]}}>
//           </mybricks.normal-pc.${version}toolbar>
//         </slots.u_m9c382>
//       </mybricks.normal-pc.${version}table>
//       \`\`\`
//     </assistant_response>
//   </example>
// </examples>

// # 注意
//  - 修改\`data.paginationConfig\`内容的前提是将\`data.usePagination\`设置为true
//  - 操作列插槽内建议使用\`mybricks.normal-pc.${version}toolbar\`组件，通常为横向排布的按钮
// `
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
        // 与提示词保持统一，见slots插槽定义
        column.slotId = column.key;
      }
    })
    return dsl;
  }
}