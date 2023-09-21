import { Data } from './types';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {

  /**
   * @description v1.1.0 , 新增 异步加载数据，自定义节点 label、value、children 的字段
  */

  const treeDataSchema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        [data.labelFieldName || 'label']: {
          title: '标签',
          type: 'string'
        },
        [data.valueFieldName || 'value']: {
          title: '值',
          type: 'string'
        },
        isLeaf: {
          title: '是否叶子节点',
          type: 'boolean'
        },
        [data.childrenFieldName || 'children']: {
          title: '子项',
          type: 'array',
          items: {
            type: 'object',
            properties: {}
          }
        }
      }
    }
  }

  if (typeof data.useLoadData === 'undefined') {
    data.useLoadData = false
  }

  if (!input.get('setLoadData')) {
    input.add('setLoadData', '设置异步加载数据', treeDataSchema.items);
  }

  if (!output.get('loadData')) {
    output.add('loadData', '异步加载', treeDataSchema.items);
  }

  //=========== v1.1.0 end ===============

  /**
   * @description v1.1.2: 异步加载数据重构，新增 仅首次加载 配置项
  */

  if (typeof data.loadDataOnce === 'undefined') {
    data.loadDataOnce = true;
  }
  input.get('setLoadData').setSchema(treeDataSchema.items);
  output.get('loadData').setSchema(treeDataSchema.items);

  //=========== v1.1.2 end ===============

  /**
    * @description v1.1.8 支持 下拉箭头 配置项
    */

  if (data.config.showArrow === undefined) {
    data.config.showArrow = !data.config.multiple;
  }

  //=========== v1.1.8 end ===============

  /**
    * @description v1.1.11 修复maxTagCount没有默认值的问题
    */

  if (data.maxTagCountType == "isResponsive") {
    data.config.maxTagCount = 'responsive';
  }

  //=========== v1.1.11 end ===============

  return true;
}
