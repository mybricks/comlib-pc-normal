import { Data } from './types';

export default function ({ data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
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
    data.columns.forEach(({ titleColor, titleBgColor, headStyle, contentStyle, contentColor }, index) => {
      const headSelector = `thead tr th:nth-child(${
        index + 1
      }):not(.ant-table-selection-column):not(.ant-table-cell-scrollbar):not(.ant-table-row-expand-icon-cell):not(.column-draggle)`;
      const bodySelector = `tbody tr td:nth-child(${
        index + 1
      }):not(.ant-table-selection-column):not(.ant-table-cell-scrollbar):not(.ant-table-row-expand-icon-cell):not(.column-draggle)`;
      setDeclaredStyle(headSelector, {
        color: titleColor,
        backgroundColor: titleBgColor,
        ...headStyle
      });
      setDeclaredStyle(bodySelector, {
        color: contentColor,
        ...contentStyle
      });
    });

  return true;
}