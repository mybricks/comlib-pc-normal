import { InputIds } from '../types';
import { Data } from './types';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {

  if (typeof data.config.showSearch === "undefined") {
    data.config.showSearch = true;
  };
  if (typeof data.config.filterOption === "undefined") {
    data.config.filterOption = true;
  };
  if (typeof data.config.optionFilterProp === "undefined") {
    data.config.optionFilterProp = "label";
  };
  if (typeof data.dropdownSearchOption === "undefined") {
    data.dropdownSearchOption = false;
  };

  /**
    * @description v1.0.2 增加"设置初始值"输入项和“初始化”输出项
    */
  const setValueSchema = input.get(InputIds.SetValue).schema;
  let valueSchema = {};
  if (data.config.mode && ['multiple', 'tags'].includes(data.config.mode)) {
    valueSchema = data.config.labelInValue ? {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: {
            type: 'string'
          },
          value: setValueSchema
        }
      }
    } : {
      type: 'array'
    };
  } else {
    valueSchema = data.config.labelInValue ? {
      type: 'object',
      properties: {
        label: {
          type: 'string'
        },
        value: setValueSchema
      }
    } : setValueSchema;
  }
  if (!input.get('setInitialValue')) {
    input.add('setInitialValue', '设置初始值', valueSchema);
  }
  if (!output.get('onInitial')) {
    output.add('onInitial', '值初始化', valueSchema);
  }
  output.get('onInitial').setTitle('值初始化');

  /**
    * @description v1.0.3 统一“设置数据源”、“设置值”、“设置初始值”、“值初始化”的schema
    */
  input.get('setInitialValue').setSchema(valueSchema);
  output.get('onInitial').setSchema(valueSchema);
  const dataSourceSchema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        label: {
          title: '标签',
          type: 'string',
        },
        value: {
          title: '值',
          type: setValueSchema?.type || 'string',
        },
        disabled: {
          title: '禁用',
          type: 'boolean',
        },
        checked: {
          title: '选中',
          type: 'boolean',
        },
      },
    },
  };
  input.get('setOptions').setSchema(dataSourceSchema);

  return true;
}