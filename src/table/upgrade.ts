import { getFilterSelector } from '../utils/cssSelector';
import { isEmptyObject } from '../utils';
import { ContentTypeEnum, IColumn } from './types';
import { OutputIds } from './constants';
import { Schemas, upgradeSchema } from './schema'
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
  input }: UpgradeParams<Data>): boolean {
  /**
    * @description v1.0.22 支持领域模型
  */

  if (typeof data.domainModel === "undefined") {
    data.domainModel = {};
  };
  /**
    * @description v1.0.13 增加动态设置表头
  */

  if (typeof data.useDynamicTitle === "undefined") {
    data.useDynamicTitle = false;
  };


  /**
 * style升级
 */
  data.columns.forEach((item, index) => {
    const { titleColor, titleBgColor, headStyle, contentStyle, contentColor } = item
    const headSelector = `table thead tr th${getFilterSelector(id)}`;
    const bodySelector = `table tbody tr td${getFilterSelector(id)}`;

    if (titleColor || titleBgColor || !isEmptyObject(headStyle)) {
      setDeclaredStyle(headSelector, {
        color: titleColor,
        backgroundColor: titleBgColor,
        ...headStyle
      });
      item.titleColor = ''
      item.titleBgColor = ''
      item.headStyle = {}
    }

    if (contentColor || !isEmptyObject(contentStyle)) {
      setDeclaredStyle(bodySelector, {
        color: contentColor,
        ...contentStyle
      });
      item.contentColor = ''
      item.contentStyle = {}
    }
  });

  /*
  * 更新行数据 添加插槽列的新输出
  */
  const addOutput = (slotId: any, outputId: string) => {
    const slotItem = slot.get(slotId);
    if (slotItem && !slotItem.outputs.get(outputId)) {
      slotItem.outputs.add(outputId, '更新行数据', {
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
    }
  };

  const UpdateColumnsOutput = (columns: IColumn[]) => {
    columns.forEach((column) => {
      if (column.contentType === ContentTypeEnum.SlotItem && slot?.get(column.slotId)) {
        addOutput(column.slotId, OutputIds.Edit_Table_Data);
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
  if (data?.SummaryColumnTitle === undefined) {
    data.SummaryColumnTitle = "合计";
  }
  if (data?.SummaryCellTitleCol === undefined) {
    data.SummaryCellTitleCol = 1;
  }
  if (data?.SummaryColumnContentType === undefined) {
    data.SummaryColumnContentType = "text";
  }
  if (data?.SummaryColumnContentSchema === undefined) {
    data.SummaryColumnContentSchema = {
      type: "string"
    }
  }

  /**
   * @description 1.0.68->1.0.69  更改target
  */
  const prePaginationStyle = getDeclaredStyle(`.ant-pagination.ant-pagination-disabled .ant-pagination-item-link`);

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

  return true;
}