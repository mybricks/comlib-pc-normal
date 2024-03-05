import { Data, InputIds } from './constants';
import { isEmptyObject } from '../utils';
import { getDataDescSchema } from './editors/utils';

export default function ({ data, input, output, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  /**
   * @description v1.0.2 增加“设置数据源”和“设置标题”默认schema
   */

  const titleSchema = {
    type: 'string'
  };

  const dataSourceSchema = {
    type: 'object',
    properties: {
      field1: {
        type: 'string'
      }
    }
  };

  if (!input.get('setTitle')) {
    input.add('setTitle', '设置标题', titleSchema);
  }

  if (!output.get('setDataSource')) {
    output.add('setDataSource', '设置数据源', dataSourceSchema);
  }

  /**
   * @description v1.0.7 标签和内容字体style改造
   */
  data.items.map((item) => {
    if (!isEmptyObject(item.labelStyle)) {
      setDeclaredStyle(`.${item.id}-item .ant-descriptions-item-label`, { ...item.labelStyle });
      item.labelStyle = {};
    }
    if (!isEmptyObject(item.contentStyle)) {
      setDeclaredStyle(`.${item.id}-item .ant-descriptions-item-content`, { ...item.contentStyle });
      item.contentStyle = {};
    }
    if (!isEmptyObject(item.padding)) {
      setDeclaredStyle(`.${item.id}-item`, {
        paddingLeft: item.padding?.[0],
        paddingRight: item.padding?.[1],
        paddingTop: item.padding?.[2],
        paddingBottom: item.padding?.[3]
      });
      item.padding = [];
    }
  });

  // 1.0.11 添加移动端列数
  if (typeof data.mobileColumn === 'undefined') {
    data.mobileColumn = 1;
  }

  // 1.0.15 右上角操作区插槽
  if (typeof data.showExtra === 'undefined') {
    data.showExtra = false;
  }

  const setTitleComplete = output.get('setTitleComplete');
  if (!setTitleComplete) {
    output.add('setTitleComplete', '完成', { type: 'any' });
    input.get('setTitle').setRels(['setTitleComplete']);
  }

  const setDataSourceComplete = output.get('setDataSourceComplete');
  if (!setDataSourceComplete) {
    output.add('setDataSourceComplete', '完成', { type: 'any' });
    input.get('setDataSource').setRels(['setDataSourceComplete']);
  }

  const setDataDesc = input.get(InputIds.SetDataDesc)
  if(!setDataDesc) {
    input.add(InputIds.SetDataDesc, '设置数据源描述', getDataDescSchema(data))
    output.add('setDataDescComplete', '完成', { type: 'any' })
  }

  return true;
}
