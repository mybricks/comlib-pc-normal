import { InputIds, OutputIds } from '../types';
import { RuleKeys } from '../utils/validator';
import { Data, IconType } from './types';
import { inputIds, outputIds } from '../form-container/constants';

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
  //=========== v1.2.0 end ===============

  input.add(InputIds.SetColor, '设置字体颜色', { type: "string" });

  /**
   * @description v1.2.5 新增启用/禁用 输入项
   */
  if (!input.get(inputIds.IsEnable)) {
    input.add(inputIds.IsEnable, '启用/禁用', {
      type: "boolean"
    });
  }
  //=========== v1.2.5 end ===============

  /**
   * @description v1.2.7 新增关联输出项
   */
  //1、设置值
  if (!output.get(outputIds.setValueDone)) {
    output.add(outputIds.setValueDone, '设置值完成', { type: "string" });
  }
  if (output.get(outputIds.setValueDone) &&
    input.get(inputIds.setValue) &&
    !input.get(inputIds.setValue)?.rels?.includes(outputIds.setValueDone)) {
    input.get(inputIds.setValue).setRels([outputIds.setValueDone]);
  }
  //2、设置初始值
  if (!output.get(outputIds.setInitialValueDone)) {
    output.add(outputIds.setInitialValueDone, '设置初始值完成', { type: "string" });
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
        "isLeaf": {
          "title": "是否叶子节点",
          "type": "boolean"
        },
        "children": {
          "title": "子项",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {}
          }
        }
      }
    }
  }
  if (!output.get("setOptionsDone")) {
    output.add("setOptionsDone", '设置数据源完成', optionsSchema);
  }
  if (output.get("setOptionsDone") &&
    input.get("setOptions") &&
    !input.get("setOptions")?.rels?.includes("setOptionsDone")) {
    input.get("setOptions").setRels(["setOptionsDone"]);
  }
  //5、设置异步加载数据完成
  if (!output.get("setLoadDataDone")) {
    output.add("setLoadDataDone", '设置异步加载数据', optionsSchema);
  }
  if (output.get("setLoadDataDone") &&
    input.get("setLoadData") &&
    !input.get("setLoadData")?.rels?.includes("setLoadDataDone")) {
    input.get("setLoadData").setRels(["setLoadDataDone"]);
  }

  //6、设置禁用
  if (!output.get(outputIds.setDisabledDone)) {
    output.add(outputIds.setDisabledDone, '禁用完成', { type: "any" });
  }
  if (output.get(outputIds.setDisabledDone) &&
    input.get(inputIds.SET_DISABLED) &&
    !input.get(inputIds.SET_DISABLED)?.rels?.includes(outputIds.setDisabledDone)) {
    input.get(inputIds.SET_DISABLED).setRels([outputIds.setDisabledDone]);
  }
  //7、设置启用
  if (!output.get(outputIds.setEnabledDone)) {
    output.add(outputIds.setEnabledDone, '启用完成', { type: "any" });
  }
  if (output.get(outputIds.setEnabledDone) &&
    input.get(inputIds.SET_ENABLED) &&
    !input.get(inputIds.SET_ENABLED)?.rels?.includes(outputIds.setEnabledDone)) {
    input.get(inputIds.SET_ENABLED).setRels([outputIds.setEnabledDone]);
  }
  //8、启用/禁用isEnable
  if (!output.get(outputIds.isEnableDone)) {
    output.add(outputIds.isEnableDone, '启用/禁用完成', { type: "boolean" });
  }
  if (output.get(outputIds.isEnableDone) &&
    input.get(inputIds.IsEnable) &&
    !input.get(inputIds.IsEnable)?.rels?.includes(outputIds.isEnableDone)) {
    input.get(inputIds.IsEnable).setRels([outputIds.isEnableDone]);
  }

  //9、设置加载中状态 setLoadingDone
  if (!output.get("setLoadingDone")) {
    output.add("setLoadingDone", '设置加载中状态完成', { type: "boolean" });
  }
  if (output.get("setLoadingDone") &&
    input.get("setLoading") &&
    !input.get("setLoading")?.rels?.includes("setLoadingDone")) {
    input.get("setLoading").setRels(["setLoadingDone"]);
  }
  //10、设置字体颜色
  if (!output.get("setColorDone")) {
    output.add("setColorDone", '设置字体颜色完成', { type: "string" });
  }
  if (output.get("setColorDone") &&
    input.get("setColor") &&
    !input.get("setColor")?.rels?.includes("setColorDone")) {
    input.get("setColor").setRels(["setColorDone"]);
  }
  //11、设置校验状态
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
  //=========== v1.2.7 end ===============

  /**
   * @description v1.2.11 新增 编辑/可读输入
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
  //=========== v1.2.11 end ===============
  return true;
}
