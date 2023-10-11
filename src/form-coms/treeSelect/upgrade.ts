import { InputIds, OutputIds } from '../types';
import { RuleKeys } from '../utils/validator';
import { Data, IconType } from './types';

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

  /**
    * @description v1.1.12 增加 展开深度openDepth 配置项
    */

  if (typeof data.openDepth !== "number") {
    data.openDepth = data.config.treeDefaultExpandAll ? -1 : 0;
    data.config.treeDefaultExpandAll = undefined;
  }

  //=========== v1.1.12 end ===============

  /**
    * @description v1.1.13 增加 展开/收起图标switcherIcon 配置项, 修复默认展开深度和异步加载的冲突
    */

  if (!data.switcherIcon) {
    data.switcherIcon = {
      src: false
    } as IconType;
  }

  //=========== v1.1.13 end ===============

  /**
    * @description v1.1.15 增加 下拉菜单和选择器同宽data.config.dropdownMatchSelectWidth 配置项
    */

  if (data.config.dropdownMatchSelectWidth === undefined) {
    data.config.dropdownMatchSelectWidth = true;
  }

  //=========== v1.1.15 end ===============

  /**
   * @description v1.2.0 新增自定义校验事件
   */

  const valueSchem = data.config.multiple ? {
    type: 'array',
    items: {
      type: 'string'
    }
  }
    : {
      type: 'string',
    }
  if (!input.get(InputIds.SetValidateInfo)) {
    input.add(InputIds.SetValidateInfo, '设置校验状态', {
      type: 'object',
      properties: {
        validateStatus: {
          type: 'enum',
          items: [
            {
              type: 'string',
              value: 'success',
            },
            {
              type: 'string',
              value: 'error',
            },
          ],
        },
        help: {
          type: 'string',
        },
      },
    });
  }

  if (!output.get(OutputIds.OnValidate)) {
    output.add(OutputIds.OnValidate, '校验触发', valueSchem);
  }
  const cutomRule = data.rules?.find(
    (i) => i.key === RuleKeys.CUSTOM_EVENT
  );
  if (data.rules?.length && !cutomRule) {
    data.rules.push({
      key: RuleKeys.CUSTOM_EVENT,
      status: false,
      visible: true,
      title: '自定义校验',
    });
  }
  //=========== v1.2.0 end ===============

  input.add(InputIds.SetColor, '设置字体颜色', { type: "string" });

  return true;
}
