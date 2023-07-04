import { Data, FormItems } from './types';
import { inputIds, slotInputIds, outputIds } from './constants'
import { getFormItemPropsSchema } from './schema'
import { omit } from 'lodash';

export default function ({ data, input, output, slot, children, setDeclaredStyle }: UpgradeParams<Data>): boolean {
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
     * @description v1.1.3 表单项style配置改造
     */
    const defaultLabelStyle = {
      lineHeight: '14px',
      letterSpacing: '0px',
      fontSize: '14px',
      fontWeight: 400,
      color: 'rgba(0, 0, 0, 0.85)',
      fontStyle: 'normal'
    };
    if (item.labelStyle) {
      const selector = `#${item.id} label > label`;

      const uniqueStyle = {};
      let hasUnique = false;
      Object.entries(item.labelStyle).map(([key, value]) => {
        if (value !== defaultLabelStyle[key]) {
          uniqueStyle[key] = value;
          hasUnique = true;
        }
      });
      hasUnique && setDeclaredStyle(selector, { ...uniqueStyle });
      omit(item, 'labelStyle');
    }
    if (item.descriptionStyle) {
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

  return true;
}