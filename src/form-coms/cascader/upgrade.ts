import { InputIds, OutputIds } from '../types';
import { inputIds, outputIds } from '../form-container/constants';
import { RuleKeys } from '../utils/validator';
import { Data } from './runtime';
import { setIfUndefined } from '../../utils';
import { descriptionUpList } from './constants'
import { descriptionUp } from '../utils/descriptionUp'

export default function ({ 
  data, 
  input, 
  output, 
  style,
  getDeclaredStyle,
  removeDeclaredStyle,
  setDeclaredStyle }: UpgradeParams<Data>): boolean {
  const valueSchema = {
    type: 'array'
  };

  if (!input.get('setInitialValue')) {
    input.add('setInitialValue', '设置初始值', valueSchema);
  }

  if (!output.get('onInitial')) {
    output.add('onInitial', '初始化', valueSchema);
  }

  //1.0.2->1.0.3 补全输入数据源结构
  input.get('setOptions').setSchema({
    title: '输入数据源数据',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        value: {
          title: '值',
          type: 'any'
        },
        label: {
          title: '名称',
          type: 'string'
        },
        disabled: {
          title: '禁用',
          type: 'boolean'
        },
        children: {
          title: '子项',
          type: 'array',
          items: {
            type: 'object',
            properties: {}
          }
        }
      }
    }
  });

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
              value: 'success'
            },
            {
              type: 'string',
              value: 'error'
            }
          ]
        },
        help: {
          type: 'string'
        }
      }
    });
  }
  if (!output.get(OutputIds.OnValidate)) {
    output.add(OutputIds.OnValidate, '校验触发', {
      type: 'array',
      items: {
        type: 'string'
      }
    });
  }
  const customRule = data.rules?.find((i) => i.key === RuleKeys.CUSTOM_EVENT);
  if (data.rules?.length && !customRule) {
    data.rules.push({
      key: RuleKeys.CUSTOM_EVENT,
      status: false,
      visible: true,
      title: '自定义校验'
    });
  }
  //=========== v1.1.0 end ===============

  /**
   * @description v1.1.1 新增启用/禁用 输入项
   */
  if (!input.get(inputIds.IsEnable)) {
    input.add(inputIds.IsEnable, '启用/禁用', {
      type: 'boolean'
    });
  }
  //=========== v1.1.1 end ===============

  /**
   * @description v1.1.3 新增关联输出项
   */
  //1、设置值
  const arraySchema = {
    type: 'array',
    items: {
      type: 'any'
    }
  };

  if (!output.get(outputIds.setValueDone)) {
    output.add(outputIds.setValueDone, '设置值完成', arraySchema);
  }
  if (
    output.get(outputIds.setValueDone) &&
    input.get(inputIds.setValue) &&
    !input.get(inputIds.setValue)?.rels?.includes(outputIds.setValueDone)
  ) {
    input.get(inputIds.setValue).setRels([outputIds.setValueDone]);
  }
  //2、设置初始值
  if (!output.get(outputIds.setInitialValueDone)) {
    output.add(outputIds.setInitialValueDone, '设置初始值完成', arraySchema);
  }
  if (
    output.get(outputIds.setInitialValueDone) &&
    input.get(inputIds.setInitialValue) &&
    !input.get(inputIds.setInitialValue)?.rels?.includes(outputIds.setInitialValueDone)
  ) {
    input.get(inputIds.setInitialValue).setRels([outputIds.setInitialValueDone]);
  }
  //3、重置值
  if (!output.get(outputIds.resetValueDone)) {
    output.add(outputIds.resetValueDone, '重置完成', { type: 'any' });
  }
  if (
    output.get(outputIds.resetValueDone) &&
    input.get(inputIds.resetValue) &&
    !input.get(inputIds.resetValue)?.rels?.includes(outputIds.resetValueDone)
  ) {
    input.get(inputIds.resetValue).setRels([outputIds.resetValueDone]);
  }
  //4、设置禁用
  if (!output.get(outputIds.setDisabledDone)) {
    output.add(outputIds.setDisabledDone, '禁用完成', { type: 'any' });
  }
  if (
    output.get(outputIds.setDisabledDone) &&
    input.get(inputIds.SET_DISABLED) &&
    !input.get(inputIds.SET_DISABLED)?.rels?.includes(outputIds.setDisabledDone)
  ) {
    input.get(inputIds.SET_DISABLED).setRels([outputIds.setDisabledDone]);
  }
  //5、设置启用
  if (!output.get(outputIds.setEnabledDone)) {
    output.add(outputIds.setEnabledDone, '启用完成', { type: 'any' });
  }
  if (
    output.get(outputIds.setEnabledDone) &&
    input.get(inputIds.SET_ENABLED) &&
    !input.get(inputIds.SET_ENABLED)?.rels?.includes(outputIds.setEnabledDone)
  ) {
    input.get(inputIds.SET_ENABLED).setRels([outputIds.setEnabledDone]);
  }
  //6、启用/禁用isEnable
  if (!output.get(outputIds.isEnableDone)) {
    output.add(outputIds.isEnableDone, '启用/禁用完成', { type: 'boolean' });
  }
  if (
    output.get(outputIds.isEnableDone) &&
    input.get(inputIds.IsEnable) &&
    !input.get(inputIds.IsEnable)?.rels?.includes(outputIds.isEnableDone)
  ) {
    input.get(inputIds.IsEnable).setRels([outputIds.isEnableDone]);
  }
  //7、设置数据源
  const optionsSchema = {
    title: '输入数据源数据',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        value: {
          title: '值',
          type: 'any'
        },
        label: {
          title: '名称',
          type: 'string'
        },
        disabled: {
          title: '禁用',
          type: 'boolean'
        },
        children: {
          title: '子项',
          type: 'array',
          items: {
            type: 'object',
            properties: {}
          }
        }
      }
    }
  };
  if (!output.get(outputIds.setOptionsDone)) {
    output.add(outputIds.setOptionsDone, '设置数据源完成', optionsSchema);
  }
  if (
    output.get(outputIds.setOptionsDone) &&
    input.get('setOptions') &&
    !input.get('setOptions')?.rels?.includes(outputIds.setOptionsDone)
  ) {
    input.get('setOptions').setRels([outputIds.setOptionsDone]);
  }
  //8、设置校验结果
  const infoSchema = {
    type: 'object',
    properties: {
      validateStatus: {
        type: 'enum',
        items: [
          {
            type: 'string',
            value: 'success'
          },
          {
            type: 'string',
            value: 'error'
          }
        ]
      },
      help: {
        type: 'string'
      }
    }
  };
  if (!output.get(outputIds.setValidateInfoDone)) {
    output.add(outputIds.setValidateInfoDone, '设置校验状态完成', infoSchema);
  }
  if (
    output.get(outputIds.setValidateInfoDone) &&
    input.get(inputIds.SET_VALIDATE_INFO) &&
    !input.get(inputIds.SET_VALIDATE_INFO)?.rels?.includes(outputIds.setValidateInfoDone)
  ) {
    input.get(inputIds.SET_VALIDATE_INFO).setRels([outputIds.setValidateInfoDone]);
  }
  //=========== v1.1.3 end ===============

  /**
   * @description v1.1.6 新增 编辑/可读输入
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
  //=========== v1.1.6 end ===============

  data.fieldNames = setIfUndefined(data?.fieldNames, {
    label: 'label',
    value: 'value',
    children: 'children'
  });

  /**
   * @description v1.1.14 新增description
  */
  // const IOMap = [{'input': input}, {'output': output}]

  // descriptionUpList.map((item)=>{
  //   IOMap[item.type].get(item.id).setSchema(item.schema)
  // })
  descriptionUp(descriptionUpList, input, output);
  //=========== v1.1.14 end ===============

  if (typeof data.isCheckAutoWithChildren === 'undefined') {
    // 全选某一级下，携带下一级子节点信息,默认为false
    data.isCheckAutoWithChildren = false;
  }

  /**
   * @description 1.1.17 增加挂载点
   */
  if( typeof data.mount === 'undefined') {
    data.mount = 'body'
  }

  /**
   * @description 1.1.17 增加挂载点
   */
  if( typeof data.mount === 'undefined') {
    data.mount = 'body'
  }

  /**
   * @description 1.1.20 增加异步加载 改变设置数据源schema、增加设置异步加载数据、增加异步加载完成
   */
  if( typeof data.useLoadData === 'undefined') {
    data.useLoadData = false
  }
  const dataSchema = {
    title: "输入数据源数据",
    type: "array",
    items: {
      type: "object",
      properties: {
        value: {
          title: "值",
          description: "选项值",
          type: "any"
        },
        label: {
          title: "名称",
          description: "选项标签（一般展示）",
          type: "string"
        },
        isLeaf: {
          title: "是否叶子节点",
          type: "boolean",
          description: "是否是叶子节点, 设置了 异步加载 时有效"
        },
        disabled: {
          title: "禁用",
          description: "选项禁用，true时禁用",
          type: "boolean"
        },
        children: {
          title: "子项",
          description: "子项内容，逐级嵌套",
          type: "array",
          items: {
            type: "object",
            properties: {}
          }
        }
      }
    }
  };

  if (input.get("setOptions")) {
    input.get("setOptions").setSchema(dataSchema);
  }
  if (output.get("setOptionsDone")) {
    output.get("setOptionsDone").setSchema(dataSchema);
  }

  const loadDataSchema = {
    type: "object",
    description: "异步加载数据，输出",
    properties: {
      label: {
        title: "标签",
        type: "string"
      },
      value: {
        title: "值",
        type: "string"
      }
    }
  }

  if (!output.get("loadData")) {
    output.add("loadData", "异步加载", loadDataSchema);
  }

  const setLoadDataSchema = {
    type: "object",
    description: "异步加载数据结构",
    properties: {
      label: {
        title: "标签",
        type: "string",
        description: "选项的标签"
      },
      value: {
        title: "值",
        type: "string",
        description: "选项的值"
      },
      isLeaf: {
        title: "是否叶子节点",
        type: "boolean",
        description: "是否是叶子节点, 设置了异步加载时有效"
      },
      children: {
        title: "子项",
        type: "array",
        description: "节点的子节点数组数据",
        items: {
          type: "object",
          properties: {}
        }
      }
    }
  }

  if(!input.get("setLoadData")){
    input.add("setLoadData", "设置异步加载数据", setLoadDataSchema);
  }

  if(!output.get("setLoadDataDone")){
    output.add("setLoadDataDone", "设置异步加载数据完成", setLoadDataSchema);
  }

  if (
    output.get("setLoadDataDone") &&
    input.get("setLoadData") &&
    !input.get("setLoadData")?.rels?.includes("setLoadDataDone")
  ) {
    input.get("setLoadData").setRels(["setLoadDataDone"]);
  }

  /**
  * @description v1.1.22  级联 清除按钮target
  */
  const preClearOptionStyle = getDeclaredStyle('.anticon-close-circle');
  if (preClearOptionStyle) {
    removeDeclaredStyle('.anticon-close-circle');
    setDeclaredStyle('.ant-select-allow-clear .ant-select-clear', preClearOptionStyle.css);
  }

  //=========== v1.1.22 end ===============
  return true;
}
