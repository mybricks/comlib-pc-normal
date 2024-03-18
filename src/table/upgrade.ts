import { getFilterSelector } from '../utils/cssSelector';
import { isEmptyObject } from '../utils';
import { ContentTypeEnum, IColumn } from './types';
import { DefaultOnRowScript, InputIds, OutputIds, SlotIds } from './constants';
import { Schemas, upgradeSchema } from './schema';
import {
  OutputIds as PaginatorOutputIds,
  InputIds as PaginatorInputIds
} from './components/Paginator/constants';
import { Data } from './types';
import { addFilterIO } from './editors/table-item/filterEditor';

export default function ({
  data,
  setDeclaredStyle,
  getDeclaredStyle,
  removeDeclaredStyle,
  id,
  slot,
  output,
  input,
  style
}: UpgradeParams<Data>): boolean {
  /**
   * @description v1.0.22 支持领域模型
   */

  if (typeof data.domainModel === 'undefined') {
    data.domainModel = {};
  }
  /**
   * @description v1.0.13 增加动态设置表头
   */

  if (typeof data.useDynamicTitle === 'undefined') {
    data.useDynamicTitle = false;
  }

  /**
   * style升级
   */
  data.columns.forEach((item, index) => {
    const { titleColor, titleBgColor, headStyle, contentStyle, contentColor } = item;
    const headSelector = `table thead tr th${getFilterSelector(id)}`;
    const bodySelector = `table tbody tr td${getFilterSelector(id)}`;

    if (titleColor || titleBgColor || !isEmptyObject(headStyle)) {
      setDeclaredStyle(headSelector, {
        color: titleColor,
        backgroundColor: titleBgColor,
        ...headStyle
      });
      item.titleColor = '';
      item.titleBgColor = '';
      item.headStyle = {};
    }

    if (contentColor || !isEmptyObject(contentStyle)) {
      setDeclaredStyle(bodySelector, {
        color: contentColor,
        ...contentStyle
      });
      item.contentColor = '';
      item.contentStyle = {};
    }
  });

  /*
   * 更新行数据 添加插槽列的新输出
   */
  const addOutput = (
    slotId: any,
    outputId: string,
    title = '更新行数据',
    schema?: Record<string, any>
  ) => {
    const slotItem = slot.get(slotId);
    if (slotItem && !slotItem.outputs.get(outputId)) {
      slotItem.outputs.add(
        outputId,
        title,
        schema || {
          type: 'object',
          properties: {
            index: {
              type: 'number'
            },
            value: {
              type: 'any'
            }
          }
        }
      );
    }
  };

  const UpdateColumnsOutput = (columns: IColumn[]) => {
    columns.forEach((column) => {
      if (column.contentType === ContentTypeEnum.SlotItem && slot?.get(column.slotId)) {
        addOutput(column.slotId, OutputIds.Edit_Table_Data);
        addOutput(column.slotId, OutputIds.Row_Move_Up, '上移行', Schemas.Number);
        addOutput(column.slotId, OutputIds.Row_Move_Down, '下移行', Schemas.Number);
        addOutput(column.slotId, OutputIds.Remove_Row, '移除行', Schemas.Number);
      }
      if (column.children) {
        UpdateColumnsOutput(column.children);
      }
    });
  };

  UpdateColumnsOutput(data.columns);
  // 列插槽作用域schema
  upgradeSchema({ data, output, input, slot });

  const useFilter = data.columns.some((item) => item.filter?.enable);
  if (useFilter) {
    output.add(OutputIds.FILTER_CLICK, '点击筛选', Schemas.Object);
  }

  if (!output.get(OutputIds.COLUMNS_CHANGE)) {
    output.add(OutputIds.COLUMNS_CHANGE, '列结构变化', Schemas.Array);
  }
  if (!output.get(OutputIds.CELL_CLICK)) {
    output.add(OutputIds.CELL_CLICK, '点击单元格', Schemas.CEll_CLICK);
  }

  addFilterIO({ data, output, input });

  if (data?.useSummaryColumn === undefined) {
    data.useSummaryColumn = false;
  }
  if (data?.summaryColumnTitle === undefined) {
    data.summaryColumnTitle = '合计';
  }
  if (data?.summaryCellTitleCol === undefined) {
    data.summaryCellTitleCol = 1;
  }
  if (data?.summaryColumnContentType === undefined) {
    data.summaryColumnContentType = 'text';
  }
  if (data?.summaryColumnContentSchema === undefined) {
    data.summaryColumnContentSchema = {
      type: 'string'
    };
  }

  /**
   * @description 1.0.68->1.0.69  更改target
   */
  const prePaginationStyle = getDeclaredStyle(
    `.ant-pagination.ant-pagination-disabled .ant-pagination-item-link`
  );

  let paginationCss: React.CSSProperties = {};

  if (prePaginationStyle) {
    paginationCss = { ...prePaginationStyle.css };
    removeDeclaredStyle(`.ant-pagination.ant-pagination-disabled .ant-pagination-item-link`);
    setDeclaredStyle('.ant-pagination-disabled > .ant-pagination-item-link', paginationCss);
  }

  /**
   * @description 1.0.73 “设置当前页码”增加 ”设置完成“ 关联输出项
   */

  const setPageNumPin = input.get(PaginatorInputIds.SetPageNum);
  const setPageNumFinishPin = output.get(PaginatorOutputIds.SetPageNumFinish);
  if (setPageNumPin) {
    if (!setPageNumFinishPin) {
      output.add(PaginatorOutputIds.SetPageNumFinish, '设置页码完成', {
        type: 'number'
      });
    }
    if (!setPageNumPin.rels) {
      setPageNumPin.setRels([PaginatorOutputIds.SetPageNumFinish]);
    }
  }

  //=========== v1.0.73 end ===============

  /**
   * @description v1.0.76 合并勾选项
   */
  if (data?.mergeCheckboxColumn === undefined) {
    data.mergeCheckboxColumn = false;
  }

  /**
   * @description v1.0.88->1.0.89 自定义空白文案和图片
   */
  if (data?.description === undefined) {
    data.description = '暂无数据';
  }
  // if(data?.isImage === undefined){
  //   data.isImage = false;
  // }
  // if (data?.image === undefined) {
  //   data.image =
  //     'data:image/png;base64,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';
  // }
  //=========== v1.0.89 end ===============

  /**
   * @description v1.0.89->1.0.90 fix&feat 增加自定空状态开关
   */
  if (data?.isEmpty === undefined) {
    data.isEmpty = false;
  }
  //=========== v1.0.90 end ===============

  if (data?.onRowScript === undefined) {
    data.onRowScript = DefaultOnRowScript;
  }
  //=========== v1.0.98 end ===============

  /**
   * @description v1.1.0->1.1.1 feat 新增对应串行输出
   */
  const setRels = (InputId: any, OutputId: any, OutputTitle: any, Schema: any = Schemas.Any) => {
    const Input = input.get(InputId);
    const OutPut = output.get(OutputId);
    if (Input) {
      if (!OutPut) {
        output.add(OutputId, OutputTitle, Schema);
      }
      if (!Input.rels) {
        Input.setRels([OutputId]);
      }
    }
  };
  setRels(InputIds.SET_DATA_SOURCE, OutputIds.SET_DATA_SOURCE, '数据源', Schemas.Array);
  setRels(InputIds.START_LOADING, OutputIds.START_LOADING, '开启loading后');
  setRels(InputIds.END_LOADING, OutputIds.END_LOADING, '关闭loading后');

  setRels(InputIds.CLEAR_ROW_SELECTION, OutputIds.CLEAR_ROW_SELECTION, '清空勾选后', Schemas.Void);
  setRels(InputIds.SET_FILTER, OutputIds.SET_FILTER, '筛选数据', Schemas.Object);
  setRels(InputIds.SET_SORT, OutputIds.SET_SORT, '排序数据', Schemas.SORTER);
  setRels(InputIds.TABLE_HEIGHT, OutputIds.TABLE_HEIGHT, '表格高度', Schemas.TABLE_HEIGHT);
  setRels(InputIds.SUMMARY_COLUMN, OutputIds.SUMMARY_COLUMN, '总结栏数据', Schemas.String);
  setRels(
    InputIds.SET_SHOW_COLUMNS,
    OutputIds.SET_SHOW_COLUMNS,
    '显示列',
    Schemas.SET_SHOW_COLUMNS
  );
  setRels(InputIds.SET_SHOW_TitleS, OutputIds.SET_SHOW_TitleS, '表头', Schemas.SET_SHOW_TitleS);
  setRels(
    InputIds.CHANGE_COLS_ATTR,
    OutputIds.CHANGE_COLS_ATTR,
    '列属性',
    Schemas.CHANGE_COLS_ATTR
  );
  setRels(
    InputIds.SET_ROW_SELECTION,
    OutputIds.SET_ROW_SELECTION,
    '勾选项',
    Schemas.SET_ROW_SELECTION
  );
  setRels(InputIds.SET_FILTER_INPUT, OutputIds.SET_FILTER_INPUT, '筛选项', Schemas.Object);
  setRels(
    InputIds.EnableAllExpandedRows,
    OutputIds.EnableAllExpandedRows,
    '开启关闭所有展开项',
    Schemas.Boolean
  );

  setRels(
    PaginatorInputIds.SetTotal,
    PaginatorOutputIds.SetTotal,
    '设置数据总数完成',
    Schemas.Number
  );
  setRels(PaginatorInputIds.SetDisable, PaginatorOutputIds.SetDisable, '禁用分页器后');
  setRels(PaginatorInputIds.SetEnable, PaginatorOutputIds.SetEnable, '启用分页器后');

  //=========== v1.1.1 end ===============

  /**
   * @description v1.1.13 -> 1.1.14 开启表格高度配置
   */
  if (style.height === void 0) {
    style.height = 'auto';
  }

  if (data?.enableRowFocus && !input.get(InputIds.SET_FOCUS_ROW)) {
    input.add(InputIds.SET_FOCUS_ROW, '设置选中行序号', Schemas.SET_FOCUS_ROW);
    output.add(OutputIds.SET_FOCUS_ROW, '设置选中行之后', Schemas.SET_FOCUS_ROW);
    input.get(InputIds.SET_FOCUS_ROW).setRels([OutputIds.SET_FOCUS_ROW]);
  }

  /**
   * @description v1.1.36 -> v1.1.37 新增动态设置布局风格能力
   */
  if (!input.get(InputIds.SET_SIZE)) {
    input.add(InputIds.SET_SIZE, '设置布局风格', Schemas.SET_SIZE);
    output.add(OutputIds.SET_SIZE_DONE, '设置布局风格完成', Schemas.SET_SIZE_DONE);
    input.get(InputIds.SET_SIZE).setRels([OutputIds.SET_SIZE_DONE]);
  }

  /**
   * @description v1.1.39 -> v1.1.40 筛选图标配置方式升级
   */
  if (!data.filterIconDefault || ['filter', 'search'].includes(data.filterIconDefault)) {
    if (data.filterIconDefault === 'search') data.filterIconDefault = 'SearchOutlined';
    else data.filterIconDefault = 'FilterFilled';
  }

  /**
   * @description v1.1.39 -> v1.1.40 筛选图标配置方式升级
   */
  data.columns.forEach((item, index) => {
    if (item.filter?.filterIcon === 'search') item.filter.filterIcon = 'SearchOutlined';
    else if (item.filter?.filterIcon === 'filter') item.filter.filterIcon = 'FilterFilled';
    else if (item.filter?.filterIcon === 'inherit') {
      item.filter.filterIcon = void 0;
      item.filter.filterIconInherit = true;
    }
    if (!item.filter?.filterIcon) {
      if (!item.filter) item.filter = { filterIconInherit: true };
      else item.filter.filterIconInherit = true;
    }
  });

  return true;
}
