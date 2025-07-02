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
    usage: `
# data定义
\`\`\` typescript
type TformattersValue<I = any, O = any> = {
  formatterName: string,
  nullValueHandling?: boolean,
  nullValueHandlingValue?: string,
  values: {
    [key: string]: any
  }
}

type PaginationData = {
  /** 总条数 */
  total: number;
  /** 说明文字 */
  text: string;
  /** 当前页数 */
  current: number;
  /** 当前页面 */
  currentPage: {
    /** 页码 */
    pageNum: number;
    /** 每页条数 */
    pageSize: number;
  };
  /** 是否支持动态启用/禁用 */
  isDynamic: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 默认每页条数 */
  defaultPageSize: number;
  /** 位置 */
  align: 'flex-start' | 'center' | 'flex-end';
  /** 尺寸 */
  size: 'default' | 'small' | 'simple';
  /** 每页条数配置功能 */
  showSizeChanger?: boolean;
  /** 指定每页可以显示多少条 */
  pageSizeOptions?: string[];
  /** 跳转页面功能 */
  showQuickJumper?: boolean;
  /** 只有一页时隐藏分页器 */
  hideOnSinglePage?: boolean;
  /** 每页条数 */
  pageSize?: number;
  /** 前端分页 */
  useFrontPage?: boolean;
}

enum ContentTypeEnum {
  Text = 'text',
  Image = 'image',
  Link = 'link',
  SlotItem = 'slotItem',
  Group = 'group',
  Switch = 'switch'
}

enum AlignEnum {
  Left = 'left',
  Center = 'center',
  Right = 'right'
}

enum FixedEnum {
  Left = 'left',
  Right = 'right',
  Default = ''
}

enum SorterTypeEnum {
  Length = 'length',
  Size = 'size',
  Date = 'date',
  Request = 'request'
}

interface Sorter {
  enable: boolean;
  type: SorterTypeEnum;
}

enum FilterTypeEnum {
  Local = 'local',
  Request = 'request',
  Multiple = 'multiple',
  Single = 'single'
}

interface Filter {
  enable?: boolean;
  type?: FilterTypeEnum;
  options?: any[];
  hideFilterDropdown?: boolean;
  filterSource?: FilterTypeEnum;
  filterType?: FilterTypeEnum;
  /** 筛选图标继承自表格 */
  filterIconInherit?: boolean;
  /** 筛选图标 */
  filterIcon?: string;
}

enum WidthTypeEnum {
  Auto = 'auto'
}

interface IColumn {
  key: string;
  dataIndex: string | string[];
  title: string;
  contentType: ContentTypeEnum;
  visible?: boolean;
  width?: number | WidthTypeEnum;
  isAutoWidth?: WidthTypeEnum;
  hasTip?: boolean;
  tip?: string;
  /** 省略展示 */
  ellipsis?: any;
  sorter?: Sorter;
  filter?: Filter;
  slotId?: string;
  fixed?: FixedEnum;
  children?: IColumn[];
  className?: string;
  keepDataIndex?: boolean;
  dataSchema?: any;
  formatData?: TformattersValue;
  colMergeScirpt?: string;
  /** 带排序列表头对齐方式 */
  sorterAlign?: AlignEnum;
  /** 选择哪个列作为模板 */
  template?: string;
  enableOnCell?: boolean;
  onCellScript?: string;
  /** 是否是rowKey */
  isRowKey?: boolean;
}

enum SizeEnum {
  Default = 'default',
  Middle = 'middle',
  Small = 'small'
}

interface Scroll {
  x: number | boolean;
  y: number | string | undefined;
  scrollToFirstRowOnChange: boolean;
}

enum RowSelectionPostionEnum {
  TOP = 'top',
  BOTTOM = 'bottom'
}

enum RowSelectionTypeEnum {
  Radio = 'radio',
  Checkbox = 'checkbox'
}

enum TableLayoutEnum {
  FixedWidth = 'fixedWidth',
  Fixed = 'fixed',
  Auto = 'auto'
}

export default interface Data {
  /** 数据源唯一标识 */
  rowKey?: string;
  /** 列配置 */
  columns: IColumn[];
  _inicCols: IColumn[];
  /** 是否显示表头 */
  showHeader?: boolean;
  /** 显示表格列筛选 */
  useColumnSetting?: boolean;
  /** 列宽分配规则 */
  tableLayout?: TableLayoutEnum;
  /** 边框 */
  bordered: boolean;
  /** 尺寸 */
  size: SizeEnum;
  /** 固定表头 */
  fixedHeader: boolean;
  enableStripe: boolean;
  /** 滚动 */
  scroll: Scroll;
  /** 开启loading */
  useLoading: boolean;
  /** loading文案 */
  loadingTip?: string;
  /** 使用勾选 */
  useRowSelection: boolean;
  /** 点击行触发勾选 */
  enableRowClickSelection: boolean;
  /** 勾选类型 */
  selectionType: RowSelectionTypeEnum;
  /** 勾选操作区位置 */
  rowSelectionPostion?: RowSelectionPostionEnum[];
  /** 勾选限制 */
  rowSelectionLimit?: number;
  /** 是否禁止勾选 */
  isDisabledScript?: string;
  /** 使用动态设置勾选项 */
  useSetSelectedRowKeys?: boolean;
  /** 使用动态设置禁用勾选 */
  useSetDisabledRowSelection?: boolean;
  rowSelectionMessage?: string;
  /** 排序参数 */
  sortParams?: {
    id?: string;
    order?: string;
  };
  /** 筛选参数 */
  filterParams: Record<string, string[] | null>;
  /** 头部 标题区插槽 */
  useHeaderTitleSlot?: boolean;
  /** 头部 操作区插槽 */
  useHeaderOperationSlot?: boolean;
  /** 使用列展开 */
  useExpand?: boolean;
  expandDataIndex?: string | string[];
  expandDataSchema?: any;
  usePagination?: boolean;
  /** 分页配置。使用paginationConfig的前提是usePagination必须设置为true */
  paginationConfig: PaginationData;
  /** 动态设置显示列 */
  useDynamicColumn?: boolean;
  /** 动态设置显示表格标题和字段 */
  useDynamicTitle?: boolean;
  enableRowClick?: boolean;
  enableRowDoubleClick?: boolean;
  enableCellClick?: boolean;
  enableCellFocus?: boolean;
  enableRowFocus: boolean;
  focusRowStyle: any;
  domainModel: {
    entity?: any;
  };
  /** 是否默认展开所有行 */
  defaultExpandAllRows: boolean;
  /** 是否开启总结栏 */
  useSummaryColumn: boolean;
  /** 总结栏 title */
  summaryColumnTitle: string;
  /** 总结栏 title col */
  summaryCellTitleCol: number;
  /** 总结栏内容类型 */
  summaryColumnContentType: 'text' | 'slotItem';
  /** 总结栏内容Schema */
  summaryColumnContentSchema: object;
  enbaleRowMerge?: boolean;
  enableOnRow?: boolean;
  rowMergeConfig?: {
    /** 合并规则，当连续的几行中，该列的值一样时，合并符合要求的行 */
    mergeByField: string;
    /** 返回true，表示对应的列不能合并 */
    excludeFields?: string[];
  };
  fixedHeight?: string | number;
  /** 合并勾选栏 */
  mergeCheckboxColumn?: boolean;
  /** 是否自定义空状态 */
  isEmpty: boolean;
  /** 自定义描述内容 */
  description: string;
  /** 图片地址 */
  image: string;
  onRowScript: string;
  /** 动态修改列属性 */
  enableDynamicChangeCols: boolean;
  /** 表格数据懒加载 */
  lazyLoad: boolean;
  /** 表格筛选默认图标 */
  filterIconDefault?: string;
  /** 用于标记唯一key是否升级过了和是否存量升级 undefined 没升级的存量 0 存量升级 1 新的场景 */
  hasUpdateRowKey?: number;
  borderSpacing?: React.CSSProperties['borderSpacing'];
  /** 领域模型 */
  _domainModel?: any;
}
\`\`\`

# slots定义
| id | type | description |
|------|--------|--------|
| data.columns[].slotId | scope | 表格列动态插槽，当 \`data.columns[].contentType === "slotItem"\` 时，对应 \`data.columns[].slotId\` |
| expandContent | scope | 展开内容插槽，当 \`data.useExpand === true\` 时允许使用 |
| headerTitle | normal | 标题区插槽，当 \`data.useHeaderTitleSlot === true\` 时允许使用 |
| headerOperation | normal | 右上角操作区插槽，当 \`data.useHeaderOperationSlot === true\` 时允许使用 |
| rowSelectionOperation | scope | 勾选操作区插槽，当 \`data.useRowSelection && data.selectionType !== RowSelectionTypeEnum.Radio && data.rowSelectionPostion?.length\` 时允许使用 |
| summaryColumn | scope | 自定义总结栏内容插槽，当 \`data.useSummaryColumn === true && data.summaryColumnContentType === "slotItem"\` 时允许使用 |

<examples>
  <!-- 功能问询 -->
  <example>
    <user_query>如何设置自定义loading文案</user_query>
    <assistant_response>
      在UI面板中，选中当前组件，在配置面板中的 **常规/自定义loading文案** 中，配置该表格的自定义loading文案
    </assistant_response>
  </example>
  <!-- 内容修改 -->
  <example>
    <user_query>将自定义loading文案修改为加载中，请稍后</user_query>
    <assistant_response>
      好的，我将当前组件的自定义loading文案修改为加载中，请稍后
      \`\`\`dsl file="component.dsl"
      <mybricks.normal-pc.${version}table data={{useLoading: true, loadingTip: "加载中，请稍后"}}>
      </mybricks.normal-pc.${version}table>
      \`\`\`
    </assistant_response>
  </example>
  <!-- 内容修改 -->
  <example>
    <user_query>搭建一个学生成绩单</user_query>
    <assistant_response>
      学生成绩单，一门学科一列，并且包含，学生姓名等信息
      \`\`\`dsl file="component.dsl"
      <mybricks.normal-pc.${version}table data={{columns: [{"title":"ID","key":"rowKey","width":"auto","visible":false,"contentType":"text","_id":"Jv9Egr","dataIndex":"id","isRowKey":true},{"title":"列2","key":"u_m80e7e","width":"auto","visible":true,"contentType":"text","_id":"6FkDxG","dataIndex":"列2","keepDataIndex":true,"filter":{"filterIconInherit":true},"sorter":{"enable":false,"type":"size"},"isRowKey":false},{"title":"列3","key":"u_nnkwke","width":"auto","visible":true,"contentType":"text","_id":"W7MqXz","dataIndex":"列3","keepDataIndex":true,"filter":{"filterIconInherit":true},"sorter":{"enable":false,"type":"size"},"isRowKey":false},{"title":"操作","key":"u_d978h0","width":"auto","visible":true,"contentType":"slotItem","_id":"qpqrfR","dataIndex":"action","keepDataIndex":true,"filter":{"filterIconInherit":true},"sorter":{"enable":false,"type":"size"},"isRowKey":false,"slotId":"u_m9c382","fixed":"right"}]}}>
        <slots.u_m9c382 title="操作-列" type="scope">
          <mybricks.normal-pc.${version}toolbar data={{"btnList":[{"key":"btn0","text":"编辑","showText":true,"dataType":"number","outVal":0,"inVal":"","isCustom":false,"contentSize":[14,14],"iconDistance":8,"src":"","loading":false,"useDynamicLoading":false,"style":{"height":"auto","width":"auto"},"useIcon":false,"type":"link"},{"key":"u_c9atjx","text":"删除","showText":true,"dataType":"number","outVal":0,"inVal":"","isCustom":false,"src":"","contentSize":[14,14],"iconDistance":8,"loading":false,"useDynamicLoading":false,"style":{"height":"auto","width":"auto"},"isSlot":false,"useIcon":false,"type":"link","danger":true}],"layout":"flex-start","spaceSize":[4,4]}}>
          </mybricks.normal-pc.${version}toolbar>
        </slots.u_m9c382>
      </mybricks.normal-pc.${version}table>
      \`\`\`
    </assistant_response>
  </example>
</examples>

# 注意
 - 修改\`data.paginationConfig\`内容的前提是将\`data.usePagination\`设置为true
 - 操作列插槽内建议使用\`mybricks.normal-pc.${version}toolbar\`组件，通常为横向排布的按钮
    `
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
    merge(data, dsl.data);
    handleDataColumns({...context, val: data.columns})
  },
}