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
    input.add('setLoadData', '设置异步加载数据', treeDataSchema);
  }

  if (!output.get('loadData')) {
    output.add('loadData', '异步加载', {
      type: 'object',
      properties: {
        label: {
          title: '标签',
          type: 'string'
        },
        value: {
          title: '值',
          type: 'string'
        }
      }
    });
  }

  //=========== v1.1.0 end ===============

  /**
   * @description v1.1.2 , 新增 更新节点数据输入项、节点展开输出项
  */

  if (!input.get('setNodeData')) {
    input.add('setNodeData', '更新节点数据', treeDataSchema.items);
  }

  if (!output.get('onExpand')) {
    output.add('onExpand', '节点展开', treeDataSchema.items);
  }

  //=========== v1.1.2 end ===============

  return true;
}
