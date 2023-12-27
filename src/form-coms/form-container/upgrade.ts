import { Data, FormItems } from './types';
import { inputIds, slotInputIds, outputIds } from './constants'
import { getFormItemPropsSchema, getSubmitSchema } from './schema'

export default function ({ data, input, output, slot, children }: UpgradeParams<Data>): boolean {
  if (!input.get(inputIds.SET_INITIAL_VALUES)) {
    const schema = {
      "type": "object",
      "properties": {}
    };

    input.add(inputIds.SET_INITIAL_VALUES, '设置表单数据', schema);
  }

  if (input.get(inputIds.SET_FIELDS_VALUE)) {
    input.get(inputIds.SET_FIELDS_VALUE).setTitle('设置表单数据（触发值变化）')
  }

  /**
   * @description v1.1.1 表单项/操作项增加宽度配置项
   */
  if (!data.actions.widthOption) {
    data.actions.widthOption = 'flexFull';
  }

  data.items.forEach(item => {
    /**
     * @description v1.1.1 表单项/操作项增加宽度配置项
     */
    if (!item.widthOption) {
      item.widthOption = 'span'
      item.span = 24 / data.formItemColumn;
    }

    /**
     * @description v1.1.3 内联布局下，表单项/操作项增加边距配置项
     */
    if (!item.inlineMargin) {
      item.inlineMargin = [0, 16, 24, 0]
    }

    /**
     * @description v1.1.10 表单项增加默认”显示冒号“配置；表单项字段trim
     */
    if (item.colon === undefined) {
      item.colon = 'default';
    }
    if (item.name !== item.name.trim()) {
      item.name = item.name.trim();
    }

    /**
     * @description v1.1.15 表单项增加"标题对齐方式"、"标题是否折行"配置项
     */
    if (item.labelAlign === undefined) {
      item.labelAlign = 'default';
    }

    if (item.labelAutoWrap === undefined) {
      item.labelAutoWrap = 'default';
    }

    /**
     * @description v1.4.13 表单项增加"标题宽度"、自定义宽度 配置项
     */
    if (item.labelWidthType === undefined) {
      item.labelWidthType = 'default';
    }

  });

  /**
   * @description v1.1.3 内联布局下，表单项/操作项增加边距配置项
   */
  if (!data.actions.inlinePadding) {
    data.actions.inlinePadding = [0, 0, 0, 0];
  }


  /**
   * @description v1.1.2 , 新增子组件通知校验功能
   */
  if (!slot?.get('content')._inputs.get(slotInputIds.VALIDATE_TRIGGER)) {
    const validateTriggerSchema = {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "title": "组件ID"
        }
      }
    }
    slot?.get('content')._inputs.add(slotInputIds.VALIDATE_TRIGGER, '触发校验', validateTriggerSchema)
  }

  /**
    * @description v1.1.15 操作项visible初始化
    */
  data.actions.items?.forEach(act => {
    if (act && act.visible === undefined) {
      act.visible = true;
    }
  })

  /**
    * @description v1.1.16 表单容器增加 ~~整体禁用~~ 配置。*使用组件内置属性*
    */
  if (typeof data.config === 'undefined') {
    data.config = {
      colon: data.colon || true,
      layout: data.layout,
      labelWrap: false,
      labelAlign: 'right',
      // disabled: false
    }

    delete data.colon
    delete data.layout
  }

  // if (!input.get(inputIds.SET_DISABLED)) {
  //   input.add('setDisabled', '设置禁用', { type: 'any' });
  // }
  // if (!input.get(inputIds.SET_ENABLED)) {
  //   input.add('setEnabled', '设置启用', { type: 'any' });
  // }

  /**
    * @description v1.1.19 表单容器增加“设置表单项配置”输入项，实现表单项公共配置动态配置
    */
  if (!input.get(inputIds.SET_FORM_ITEMS_PROPS)) {
    input.add(inputIds.SET_FORM_ITEMS_PROPS, '设置表单项配置', getFormItemPropsSchema(data));
  }

  /**
    * @description v1.1.20 增加获取表单数据 I/O
    */
  if (!input.get(inputIds.GET_FIELDS_VALUE)) {
    input.add(inputIds.GET_FIELDS_VALUE, '获取表单数据', { type: 'any' });
  }

  if (!output.get(outputIds.RETURN_VALUES)) {
    output.add(outputIds.RETURN_VALUES, '表单数据输出', { type: 'object', properties: {} });
  }

  if (output.get(outputIds.RETURN_VALUES) &&
    input.get(inputIds.GET_FIELDS_VALUE) &&
    !input.get(inputIds.GET_FIELDS_VALUE)?.rels?.includes(outputIds.RETURN_VALUES)) {
    input.get(inputIds.GET_FIELDS_VALUE).setRels([outputIds.RETURN_VALUES]);
  }

  //=========== v1.1.20 end ===============

  /**
   * @description v1.2.2 , 支持表单值更新输出
   */
  if (!slot?.get('content')._inputs.get(slotInputIds.ON_CHANGE)) {
    const validateTriggerSchema = {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "title": "组件ID"
        },
        "value": {
          "type": "any",
          "title": "组件值"
        }
      }
    }
    slot?.get('content')._inputs.add(slotInputIds.ON_CHANGE, '表单项值变化', validateTriggerSchema)
  }

  if (!output.get(outputIds.ON_VALUES_CHANGE)) {
    output.add(outputIds.ON_VALUES_CHANGE, '字段值更新输出', {
      "type": "object",
      "properties": {
        "changedValues": {
          "type": "object",
          "properties": {}
        },
        "allValues": {
          "type": "object",
          "properties": {}
        }
      }
    });
  }

  //=========== v1.2.2 end ===============


  /**
  * @description v1.2.12 , 复制&粘贴修正数据，增加 comName 字段
  */
  children['content'].forEach(child => {
    const item = data.items.find(item => item.id === child.id);

    if (item && !item.comName) {
      item['comName'] = child.name
    }

  });
  //=========== v1.2.12 end ===============

  /**
  * @description v1.3.0 , 支持潜入领域模型容器
  */

  if (typeof data.domainModel === 'undefined') {
    data.domainModel = {
      entity: {},
      queryFieldRules: {},
      type: ''
    }
  }
  //=========== v1.3.0 end ===============

  /**
 * @description v1.3.4 , 支持校验失败输出
 */
  if (!output.get(outputIds.ON_SUBMIT_ERROR)) {
    output.add(outputIds.ON_SUBMIT_ERROR, '校验失败输出', {
      type: 'object',
      properties: {
        name: {
          title: '字段名',
          type: 'string',
        },
        help: {
          title: '校验信息',
          type: 'string',
        },
      },
    });
    input.get(inputIds.SUBMIT).setRels([outputIds.ON_FINISH, outputIds.ON_SUBMIT_ERROR]);
    input.get(inputIds.SUBMIT_AND_MERGE).setRels([outputIds.ON_MERGE_FINISH, outputIds.ON_SUBMIT_ERROR]);
  }
  //=========== v1.3.4 end ===============

  /**
   * @description v1.3.9 , 作用域支持添加自定义内容项组件
   */
  if (!data.additionalItems) data.additionalItems = [];
  slot.get('content').setSchema([
    "mybricks.normal-pc.form-container/form-item",
    "mybricks.normal-pc.form-container/form-addition-container"
  ]);
  //=========== v1.3.9 end ===============

  /**
   * @description v1.3.11 , 增加 设置禁用/设置启用 输入项
   */
  if (!input.get(inputIds.SET_DISABLED)) {
    input.add(inputIds.SET_DISABLED, '设置禁用', { type: 'any' });
  }
  if (!input.get(inputIds.SET_ENABLED)) {
    input.add(inputIds.SET_ENABLED, '设置启用', { type: 'any' });
  }
  //=========== v1.3.11 end ===============


  /**
   * @description v1.4.0 , 新增 表单展示类型，支持查询表单，展开、收起
   */

  if (typeof data.layoutType === 'undefined') {
    data.layoutType = 'Form';
  }

  if (typeof data.span === 'undefined') {
    data.span = 8;
  }

  if (typeof data.defaultCollapsed === 'undefined') {
    data.defaultCollapsed = true;
  }

  //=========== v1.4.0 end ===============

  /**
   * @description v1.4.5 , 新增 操作项，禁用启用
  */
  data.actions.items?.forEach(act => {
    if (act && act.disabled === undefined) {
      act.disabled = false;
    }
    if (act && act.useDynamicDisabled === undefined) {
      act.useDynamicDisabled = false;
    }
    if (act && act.useDynamicHidden === undefined) {
      act.useDynamicHidden = false;
    }
  })

  /**
     * @description v1.4.9 , 新增 校验表单项 输入项
     */

  if (!input.get(inputIds.VALIDATE_FIELDS)) {
    const schema = {
      type: 'array',
      items: {
        type: 'string'
      }
    };

    input.add(inputIds.VALIDATE_FIELDS, '校验表单项', schema);
  }

  //=========== v1.4.9 end ===============

  /**
     * @description v1.4.10 , 新增 收起/展开表单项 输出项
  */

  if (data.layoutType === 'QueryFilter' && !output.get(outputIds.ON_COLLAPSE)) {
    const schema = {
      type: 'boolean',
    };

    output.add(outputIds.ON_COLLAPSE, '收起/展开表单项', schema);
  }

  //=========== v1.4.10 end ===============

  /**
    * @description v1.4.15 , 兼容表单项无name，用label替换
  */
  data.items.forEach((item)=>{
    if(item.name === '' || item.name === undefined){
      item.name = item.label;
    }
  })

  /**
    * @description v1.4.18 , 表单容器添加关联输出项
  */
  //1、设置表单数据完成
  if (!output.get("setInitialValuesDone")) {
    output.add("setInitialValuesDone", '设置表单数据完成', getSubmitSchema(data));
  }
  if (output.get("setInitialValuesDone") &&
    input.get("setInitialValues") &&
    !input.get("setInitialValues")?.rels?.includes("setInitialValuesDone")) {
    input.get("setInitialValues").setRels(["setInitialValuesDone"]);
  }
  //2、设置表单数据（触发值变化）完成
  if (!output.get("setFieldsValueDone")) {
    output.add("setFieldsValueDone", '设置表单数据（触发值变化）完成', getSubmitSchema(data));
  }
  if (output.get("setFieldsValueDone") &&
    input.get("setFieldsValue") &&
    !input.get("setFieldsValue")?.rels?.includes("setFieldsValueDone")) {
    input.get("setFieldsValue").setRels(["setFieldsValueDone"]);
  }
  //3、设置禁用完成，setDisabledDone
  if (!output.get("setDisabledDone")) {
    output.add("setDisabledDone", '设置禁用完成', { type: 'any' });
  }
  if (output.get("setDisabledDone") &&
    input.get("setDisabled") &&
    !input.get("setDisabled")?.rels?.includes("setDisabledDone")) {
    input.get("setDisabled").setRels(["setDisabledDone"]);
  }
  //4、设置启用完成，setEnabledDone
  if (!output.get("setEnabledDone")) {
    output.add("setEnabledDone", '设置启用完成', { type: 'any' });
  }
  if (output.get("setEnabledDone") &&
    input.get("setEnabled") &&
    !input.get("setEnabled")?.rels?.includes("setEnabledDone")) {
    input.get("setEnabled").setRels(["setEnabledDone"]);
  }
  //5、校验表单项完成 validateFieldsDone
  if (!output.get("validateFieldsDone")) {
    output.add("validateFieldsDone", '设置启用完成', { type: "boolean" });
  }
  if (output.get("validateFieldsDone") &&
    input.get("validateFields") &&
    !input.get("validateFields")?.rels?.includes("validateFieldsDone")) {
    input.get("validateFields").setRels(["validateFieldsDone"]);
  }
  //6、设置表单项配置 setFormItemsPropsDone
  if (!output.get("setFormItemsPropsDone")) {
    output.add("setFormItemsPropsDone", '设置表单项配置完成', getFormItemPropsSchema(data));
  }
  if (output.get("setFormItemsPropsDone") &&
    input.get("setFormItemsProps") &&
    !input.get("setFormItemsProps")?.rels?.includes("setFormItemsPropsDone")) {
    input.get("setFormItemsProps").setRels(["setFormItemsPropsDone"]);
  }

  /**
    * @description v1.4.31 => v1.4.32, 操作项增加图标
  */
  data.actions.items?.forEach(act => {
    if (act && act.useIcon === undefined) {
      act.useIcon = false;
    }
    if (act && act.iconDistance === undefined) {
      act.iconDistance = 8;
    }
    if (act && act.icon === undefined) {
      act.icon = "HomeOutlined";
    }
    if (act && act.iconLocation === undefined) {
      act.iconLocation = "front";
    }
  })

  /**
   * @description v1.4.33 新增 编辑/可读输入
   */
  if (!output.get(outputIds.isEditableDone)) {
    output.add(outputIds.isEditableDone, '设置编辑/只读完成', { type: 'boolean' });
  }
  if (!input.get(inputIds.isEditable)) {
    input.add(inputIds.isEditable, '设置编辑/只读', { type: 'boolean' });
    input.get(inputIds.isEditable).setRels([outputIds.isEditableDone]);
  }
  //=========== v1.4.33 end ===============
  return true;
}