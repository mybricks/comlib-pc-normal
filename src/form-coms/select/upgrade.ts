import { InputIds, OutputIds } from '../types';
import { Schemas } from './constants';
import { Data } from './types';

export default function ({
  data,
  input,
  output,
  getDeclaredStyle,
  removeDeclaredStyle,
  setDeclaredStyle
}: UpgradeParams<Data>): boolean {

  const isMultiple = data.config.mode && ['multiple', 'tags'].includes(data.config.mode);

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
  let setValueSchema;
  if (isMultiple) {
    setValueSchema = {
      type: 'array',
      items: Schemas.String
    };
  } else {
    setValueSchema = Schemas.String;
  }
  if (!input.get(InputIds.SetInitialValue)) {
    input.add(InputIds.SetInitialValue, '设置初始值', setValueSchema);
  }
  if (!output.get(OutputIds.OnInitial)) {
    output.add(OutputIds.OnInitial, '值初始化', setValueSchema);
  }
  output.get(OutputIds.OnInitial).setTitle('值初始化');

  //=========== v1.0.2 end ===============

  /**
    * @description v1.0.3 统一“设置数据源”、“设置值”、“设置初始值”、“值初始化”的schema
    */
  input.get(InputIds.SetInitialValue).setSchema(setValueSchema);
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
          type: 'string',
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

  //=========== v1.0.3 end ===============

  /**
    * @description v1.0.22 支持 输出数据 配置项
    */

  let returnValueSchema;
  if (data.config.labelInValue) {
    returnValueSchema = {
      type: 'object',
      properties: {
        label: Schemas.String,
        value: Schemas.String,
      }
    };
  } else {
    returnValueSchema = Schemas.String;
  }
  let outputValueSchema = returnValueSchema;
  if (isMultiple) {
    outputValueSchema = {
      type: 'array',
      items: returnValueSchema
    };
  }
  if (data.outputValueType === undefined) {
    if (data.config.labelInValue) {
      data.outputValueType = 'labelInValue';
    } else {
      data.outputValueType = 'value';
    }
    output.get(OutputIds.OnChange)?.setSchema(outputValueSchema);
    output.get(OutputIds.OnInitial)?.setSchema(outputValueSchema);
    output.get(OutputIds.OnBlur)?.setSchema(outputValueSchema);
    output.get(OutputIds.ReturnValue)?.setSchema(outputValueSchema);
  }

  //=========== v1.0.22 end ===============

  /**
    * @description v1.0.25 支持 下拉箭头 配置项
    */

  if (data.config.showArrow === undefined) {
    data.config.showArrow = !isMultiple;
  }

  //=========== v1.0.25 end ===============


  /**
    * @description v1.0.30 -> v1.0.31 下拉区域target改写
  */

  const preDropdownStyle = getDeclaredStyle(`.{id} div.ant-select-dropdown-placement-bottomLeft`);

  let dropdownCss: React.CSSProperties = {}, css: React.CSSProperties = {}, hoverCss: React.CSSProperties = {};

  if (preDropdownStyle) {
    dropdownCss = { ...preDropdownStyle.css };
    removeDeclaredStyle(`.{id} div.ant-select-dropdown-placement-bottomLeft`);
    setDeclaredStyle('.{id}.ant-select-dropdown', dropdownCss, true);
  }

  /**
   * @description v1.1.0 新增自定义校验事件
   */

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
    output.add(OutputIds.OnValidate, '校验触发', outputValueSchema);
  }

  //=========== v1.1.0 end ===============

  return true;
}