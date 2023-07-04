import { Data } from './types';

export default function ({ data, setDeclaredStyle, id }: UpgradeParams<Data>): boolean {
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
    const headSelector = `table thead tr th:not(#${id} .slot *)`;
    const bodySelector = `table tbody tr td:not(#${id} .slot *)`;
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