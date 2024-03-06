import { InputIds, OutputIds, ValidateTriggerType } from '../types';
import { RuleKeys } from '../utils/validator';
import { Schemas } from './constants';
import { Data } from './types';
import { inputIds, outputIds } from '../form-container/constants';

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
    * @description v1.0.32 -> v1.0.33 文本内容样式配置 target 修改
    */
  const preSearchInputStyle = getDeclaredStyle('.ant-select-single.ant-select-show-arrow .ant-select-selection-item');
  if (preSearchInputStyle) {
    removeDeclaredStyle('.ant-select-single.ant-select-show-arrow .ant-select-selection-item');
    setDeclaredStyle('.ant-select-selection-search .ant-select-selection-search-input', preSearchInputStyle.css);
  }

  /**
   * @description v1.1.0 新增自定义校验事件
   */
  if (!input.get(InputIds.SetValidateInfo)) {
    input.add(InputIds.SetValidateInfo, '设置校验结果', {
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
  const customRule = data.rules?.find(
    (i) => i.key === RuleKeys.CUSTOM_EVENT
  );
  if (data.rules?.length && !customRule) {
    data.rules.push({
      key: RuleKeys.CUSTOM_EVENT,
      status: false,
      visible: true,
      title: '自定义校验',
    });
  }
  //=========== v1.1.0 end ===============

  input.add(InputIds.SetColor, '设置字体颜色', { type: "string" });

  /**
   * @description v1.1.2 新增 校验触发时机 配置项
   */

  if (!data.validateTrigger) {
    data.validateTrigger = [ValidateTriggerType.OnChange];
  }

  //=========== v1.1.2 end ===============

  /**
   * @description v1.1.3 新增启用/禁用 输入项
   */
  if (!input.get(inputIds.IsEnable)) {
    input.add(inputIds.IsEnable, '启用/禁用', {
      type: "boolean"
    });
  }
  //=========== v1.1.3 end ===============

  /**
   * @description v1.1.5 新增关联输出项
   */
  //1、设置值
  if (!output.get(outputIds.setValueDone)) {
    output.add(outputIds.setValueDone, '设置值完成', { type: 'string' });
  }
  if (output.get(outputIds.setValueDone) &&
    input.get(inputIds.setValue) &&
    !input.get(inputIds.setValue)?.rels?.includes(outputIds.setValueDone)) {
    input.get(inputIds.setValue).setRels([outputIds.setValueDone]);
  }
  //2、设置初始值
  if (!output.get(outputIds.setInitialValueDone)) {
    output.add(outputIds.setInitialValueDone, '设置初始值完成', { type: 'string' });
  }
  if (output.get(outputIds.setInitialValueDone) &&
    input.get(inputIds.setInitialValue) &&
    !input.get(inputIds.setInitialValue)?.rels?.includes(outputIds.setInitialValueDone)) {
    input.get(inputIds.setInitialValue).setRels([outputIds.setInitialValueDone]);
  }
  //3、重置值
  if (!output.get(outputIds.resetValueDone)) {
    output.add(outputIds.resetValueDone, '重置完成', { type: "any" });
  }
  if (output.get(outputIds.resetValueDone) &&
    input.get(inputIds.resetValue) &&
    !input.get(inputIds.resetValue)?.rels?.includes(outputIds.resetValueDone)) {
    input.get(inputIds.resetValue).setRels([outputIds.resetValueDone]);
  }
  //4、设置数据源
  const optionsSchema = {
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "label": {
          "title": "标签",
          "type": "string"
        },
        "value": {
          "title": "值",
          "type": "string"
        },
        "disabled": {
          "title": "禁用",
          "type": "boolean"
        },
        "checked": {
          "title": "选中",
          "type": "boolean"
        }
      }
    }
  };
  if (!output.get("setOptionsDone")) {
    output.add("setOptionsDone", '设置数据源完成', optionsSchema);
  }
  if (output.get("setOptionsDone") &&
    input.get("setOptions") &&
    !input.get("setOptions")?.rels?.includes("setOptionsDone")) {
    input.get("setOptions").setRels(["setOptionsDone"]);
  }
  //5、设置禁用
  if (!output.get(outputIds.setDisabledDone)) {
    output.add(outputIds.setDisabledDone, '禁用完成', { type: "any" });
  }
  if (output.get(outputIds.setDisabledDone) &&
    input.get(inputIds.SET_DISABLED) &&
    !input.get(inputIds.SET_DISABLED)?.rels?.includes(outputIds.setDisabledDone)) {
    input.get(inputIds.SET_DISABLED).setRels([outputIds.setDisabledDone]);
  }
  //6、设置启用
  if (!output.get(outputIds.setEnabledDone)) {
    output.add(outputIds.setEnabledDone, '启用完成', { type: "any" });
  }
  if (output.get(outputIds.setEnabledDone) &&
    input.get(inputIds.SET_ENABLED) &&
    !input.get(inputIds.SET_ENABLED)?.rels?.includes(outputIds.setEnabledDone)) {
    input.get(inputIds.SET_ENABLED).setRels([outputIds.setEnabledDone]);
  }
  //7、启用/禁用isEnable
  if (!output.get(outputIds.isEnableDone)) {
    output.add(outputIds.isEnableDone, '启用/禁用完成', { type: "boolean" });
  }
  if (output.get(outputIds.isEnableDone) &&
    input.get(inputIds.IsEnable) &&
    !input.get(inputIds.IsEnable)?.rels?.includes(outputIds.isEnableDone)) {
    input.get(inputIds.IsEnable).setRels([outputIds.isEnableDone]);
  }
  //8、设置加载中状态完成
  if (!output.get("setLoadingDone")) {
    output.add("setLoadingDone", '设置加载中状态完成', { type: "boolean" });
  }
  if (output.get("setLoadingDone") &&
    input.get("setLoading") &&
    !input.get("setLoading")?.rels?.includes("setLoadingDone")) {
    input.get("setLoading").setRels(["setLoadingDone"]);
  }

  //9、设置字体颜色
  if (!output.get(outputIds.setColorDone)) {
    output.add(outputIds.setColorDone, '设置字体颜色完成', { type: "string" });
  }
  if (output.get(outputIds.setColorDone) &&
    input.get('setColor') &&
    !input.get('setColor')?.rels?.includes(outputIds.setColorDone)) {
    input.get('setColor').setRels([outputIds.setColorDone]);
  }
  //10、设置校验状态
  const infoSchema = {
    "type": "object",
    "properties": {
      "validateStatus": {
        "type": "enum",
        "items": [
          {
            "type": "string",
            "value": "success"
          },
          {
            "type": "string",
            "value": "error"
          }
        ]
      },
      "help": {
        "type": "string"
      }
    }
  }
  if (!output.get(outputIds.setValidateInfoDone)) {
    output.add(outputIds.setValidateInfoDone, '设置校验状态完成', infoSchema);
  }
  if (output.get(outputIds.setValidateInfoDone) &&
    input.get(inputIds.SET_VALIDATE_INFO) &&
    !input.get(inputIds.SET_VALIDATE_INFO)?.rels?.includes(outputIds.setValidateInfoDone)) {
    input.get(inputIds.SET_VALIDATE_INFO).setRels([outputIds.setValidateInfoDone]);
  }
  //=========== v1.1.5 end ===============

  /**
   * @description v1.1.9 新增 编辑/可读输入
   */
  if (!output.get(outputIds.isEditableDone)) {
    output.add(outputIds.isEditableDone, '设置编辑/只读完成', { type: 'boolean' });
  }
  if (!input.get(inputIds.isEditable)) {
    input.add(inputIds.isEditable, '设置编辑/只读', { type: 'boolean' });
    input.get(inputIds.isEditable).setRels([outputIds.isEditableDone]);
  }
  if (typeof data.isEditable === 'undefined') {
    data.isEditable = true;
  }
  //=========== v1.1.9 end ===============

  /**
     * @description v1.1.11 增加 下拉菜单和选择器同宽data.config.dropdownMatchSelectWidth 配置项
     */

  if (data.config.dropdownMatchSelectWidth === undefined) {
    data.config.dropdownMatchSelectWidth = true;
  }

  //=========== v1.1.11 end ===============

  /**
     * @description v1.1.13 增加 搜索值为空时自动重置选项data.resetOptionsWhenEmptySearch 配置项
     */

  if (data.resetOptionsWhenEmptySearch === undefined) {
    data.resetOptionsWhenEmptySearch = true;
  }

  //=========== v1.1.13 end ===============

  return true;
}