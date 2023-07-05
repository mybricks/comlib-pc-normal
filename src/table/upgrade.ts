import { getFilterSelector } from '../utils/cssSelector';
import { isEmptyObject } from '../utils';

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

  return true;
}