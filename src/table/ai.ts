import merge from "lodash/merge";
import { WidthTypeEnum } from './types';
import { setDataSchema, Schemas } from './schema';
import { setColumns } from './utils';
import { InputIds, OutputIds, SlotIds } from './constants';
import { updateSlot } from "./editors/table/rowSelection";
const version = ANTD_VERSION === 4 ? "" : "antd5."

const handleDataColumns = (params) => {
  const { data, val, slot } = params
  let newRowKey = data?.rowKey;
  for (let item of val) {
    if (item.dataIndex === '') {
      item.dataIndex = item.title;
      // message.warn(`表格列字段不能为空！`);
    }

    // 保证每次只有一个isRowKey是true
    if (item?.isRowKey && data.rowKey !== item.dataIndex) {
      newRowKey = String(item.dataIndex);
    }
    // 开启唯一key之后不能取消
    else if (data.rowKey === item.dataIndex && !item?.isRowKey) {
      // @ts-ignore
      item._renderKey = uuid(); // 新增一个随机的值renderKey刷新防止不更新
      // message.warn(`必须设置一个唯一key`);
    }
  }

  data.rowKey = newRowKey;

  const cols = val.map((item) => ({
    ...item,
    // width: item.isAutoWidth
    //   ? WidthTypeEnum.Auto
    //   : item.width === WidthTypeEnum.Auto
    //     ? 'auto'
    //     : Number(item.width),
    width: item.isAutoWidth ? WidthTypeEnum.Auto : Number(item.width) || 140,
    isAutoWidth: undefined,
    isRowKey: data?.rowKey && item?.dataIndex === data?.rowKey
  }));
  setColumns({ data, slot }, cols);
  setDataSchema(params);
}

export default {
  ':root' (rootParams) {
    return {
      
    }
  },
  execute(nowData, params) {
    const { data } = params;

    merge(data, nowData);
    handleDataColumns({...params, val: data.columns})
  },
  createSlot(nowSlot, edtCtx) {
    const { id, title, type } = nowSlot;
    const { env, data, inputs, outputs, slot, ...res } = edtCtx;

    if (id === "expandContent") {
      inputs.add(InputIds.EnableAllExpandedRows, '开启关闭所有展开项', { type: 'boolean' });
      outputs.add(OutputIds.EnableAllExpandedRows, '开启关闭所有展开项', {
        type: 'boolean'
      });
      inputs.get(InputIds.EnableAllExpandedRows).setRels([OutputIds.EnableAllExpandedRows]);
      slot.add({ id: SlotIds.EXPAND_CONTENT, title: `展开内容`, type: 'scope' });
      if (data.expandDataIndex) {
        slot
          .get(SlotIds.EXPAND_CONTENT)
          .inputs.add(InputIds.EXP_ROW_VALUES, '展开数据', Schemas.Object);
      }
      slot
        .get(SlotIds.EXPAND_CONTENT)
        .inputs.add(InputIds.EXP_COL_VALUES, '当前行数据', Schemas.Object);
      slot
        .get(SlotIds.EXPAND_CONTENT)
        .inputs.add(InputIds.INDEX, '当前行序号', Schemas.Number);
      setDataSchema({ data, slot, inputs, outputs, env, ...res });
    } else if (id === "headerTitle") {
      slot.add(SlotIds.HEADER_TITLE, title || '标题区插槽');
    } else if (id === "headerOperation") {
      slot.add(SlotIds.HEADER_OPERATION, title || '操作区插槽');
    } else if (id === "rowSelectionOperation") {
      updateSlot({ data, slot });
    } else if (id === "summaryColumn") {
      slot.add({
        id: 'summaryColumn',
        title: title || "`自定义总结栏内容`",
        type: 'scope'
      });
    } else {
      const column = data.columns.find((column) => {
        return column.contentType === "slotItem"
      })
      if (!column) {
        slot.add({ id, title });
        return
      }
      const slotId = id;
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
    }
  },
  prompts: {
    summary: '数据表格',
    usage: `data数据模型
type TformattersValue<I = any, O = any> = {
  formatterName: string,
  nullValueHandling?: boolean,
  nullValueHandlingValue?: string,
  values: {
    [key: string]: any
  }
}

type PaginationData = {
  total: number; // 总条数
  text: string; // 说明文字
  current: number; // 当前页数
  currentPage: { // 当前页面
    pageNum: number; // 页码
    pageSize: number; // 每页条数
  };
  isDynamic: boolean; // 是否支持动态启用/禁用
  disabled?: boolean; // 是否禁用
  defaultPageSize: number; // 默认每页条数
  align: 'flex-start' | 'center' | 'flex-end'; // 位置
  size: 'default' | 'small' | 'simple'; // 尺寸
  showSizeChanger?: boolean; // 每页条数配置功能
  pageSizeOptions?: string[]; // 指定每页可以显示多少条
  showQuickJumper?: boolean; // 跳转页面功能
  hideOnSinglePage?: boolean; // 只有一页时隐藏分页器
  pageSize?: number; // 每页条数
  useFrontPage?: boolean; // 前端分页
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
  // 省略展示
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
  // 带排序列表头对齐方式
  sorterAlign?: AlignEnum;
  template?: string; // 选择哪个列作为模板
  enableOnCell?: boolean;
  onCellScript?: string;
  isRowKey?: boolean; // 是否是rowKey
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
interface Data {
  // 数据源唯一标识
  rowKey?: string;
  // 数据源
  dataSource: any[];

  // 列配置
  columns: IColumn[];
  _inicCols: IColumn[];
  // 是否显示表头
  showHeader?: boolean;
  //显示表格列筛选
  useColumnSetting?: boolean;

  // 列宽分配规则
  tableLayout?: TableLayoutEnum;

  // 边框
  bordered: boolean;
  // 尺寸
  size: SizeEnum;
  // 固定表头
  fixedHeader: boolean;
  enableStripe: boolean;
  // 滚动
  scroll: Scroll;

  // 开启loading
  useLoading: boolean;
  // loading文案
  loadingTip?: string;

  // 使用勾选
  useRowSelection: boolean;
  // 点击行触发勾选
  enableRowClickSelection: boolean;
  // 勾选类型
  selectionType: RowSelectionTypeEnum;
  // 勾选操作区位置
  rowSelectionPostion?: RowSelectionPostionEnum[];
  // 勾选限制
  rowSelectionLimit?: number;
  // 是否禁止勾选
  isDisabledScript?: string;
  // 使用动态设置勾选项
  useSetSelectedRowKeys?: boolean;
  // 使用动态设置禁用勾选
  useSetDisabledRowSelection?: boolean;
  rowSelectionMessage?: string;
  // 排序参数
  sortParams?: {
    id?: string;
    order?: string;
  };
  // 筛选参数
  filterParams: Record<string, string[] | null>;

  // 头部 标题区插槽
  useHeaderTitleSlot?: boolean;
  // 头部 操作区插槽
  useHeaderOperationSlot?: boolean;

  // 使用列展开
  useExpand?: boolean;
  expandDataIndex?: string | string[];
  expandDataSchema?: any;

  usePagination?: boolean;
  // 分页配置。使用paginationConfig的前提是usePagination必须设置为true
  paginationConfig: PaginationData;

  // 动态设置显示列
  useDynamicColumn?: boolean;

  //动态设置显示表格标题和字段
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
  // 是否默认展开所有行
  defaultExpandAllRows: boolean;

  useSummaryColumn: boolean; // 是否开启总结栏
  summaryColumnTitle: string; // 总结栏 title
  summaryCellTitleCol: number; // 总结栏 title col
  summaryColumnContentType: 'text' | 'slotItem'; // 总结栏内容类型
  summaryColumnContentSchema: object; // 总结栏内容Schema
  enbaleRowMerge?: boolean;
  enableOnRow?: boolean;
  rowMergeConfig?: {
    // 合并规则，当连续的几行中，该列的值一样时，合并符合要求的行
    mergeByField: string;
    // 返回true，表示对应的列不能合并
    excludeFields?: string[];
  };
  fixedHeight?: string | number;

  mergeCheckboxColumn?: boolean; // 合并勾选栏

  //是否自定义空状态
  isEmpty: boolean;
  //自定义描述内容
  description: string;
  //是否自定义图片
  //isImage: boolean;
  //图片地址
  image: string;
  onRowScript: string;
  enableDynamicChangeCols: boolean; // 动态修改列属性

  /** 表格数据懒加载 */
  lazyLoad: boolean;
  /** 表格筛选默认图标 */
  filterIconDefault?: string;

  // 用于标记唯一key是否升级过了和是否存量升级 undefined 没升级的存量 0 存量升级 1 新的场景
  hasUpdateRowKey?: number;

  borderSpacing?: React.CSSProperties['borderSpacing'];

  /** 领域模型 */
  _domainModel?: any;
}

slots插槽
表格列动态插槽，当cloumn的contentType为slotItem时，对应列的slotId，scope类型
expandContent，展开内容插槽，scope类型
headerTitle， 标题区插槽
headerOperation，操作区插槽
rowSelectionOperation，勾选操作区，scope类型
summaryColumn，自定义总结栏内容，scope类型

styleAry声明
表格: .ant-table
表头: .ant-table-thead
内容: .ant-table-tbody
分页: [data-table-pagination]

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

注意：
1. 修改paginationConfig的前提是将usePagination设置为true
2. 操作列插槽内建议使用mybricks.normal-pc.${version}toolbar组件，通常为横向排布的按钮
`
  },
  modifyTptJson: (component) => {
    if (!component.data) {
      component.data = {}
    }

    component.data.layout = component.data?.direction === 'row' ? 'horizontal' : 'vertical'
    delete component.data?.direction
    if (component.data.layout === 'vertical') {
      component.data.itemWidth = '100%'
    } else if (component.data.layout === 'horizontal') {
      component.data.isAuto = component.data.wrap ?? true
      delete component.data.wrap
    }

    component.data.useLoading = false;
    component.data.loadingTip = '加载中...';
  }
}