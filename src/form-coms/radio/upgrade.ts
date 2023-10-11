import { inputIds, outputIds } from '../form-container/constants';
import { InputIds } from '../types';
import { RuleKeys } from '../utils/validator';
import { Data } from './types';

export default function ({ data, input, output, getDeclaredStyle, setDeclaredStyle, removeDeclaredStyle }: UpgradeParams<Data>): boolean {
  const valueSchema = {
    "type": "string"
  }

  if (!input.get('setInitialValue')) {

    input.add('setInitialValue', '设置初始值', valueSchema);
  }

  if (!output.get('onInitial')) {
    output.add('onInitial', '值初始化', valueSchema);
  }
  output.get('onInitial').setTitle('值初始化');

  /**
   * @description v1.0.11->1.0.12 增加布局（水平或者垂直）
   */
  if (typeof data.layout === "undefined") {
    data.layout = "horizontal";
  };

  /**
   * @description v1.1.0 新增自定义校验事件
   */

  if (!input.get(inputIds.SET_VALIDATE_INFO)) {
    input.add(inputIds.SET_VALIDATE_INFO, '设置校验状态', {
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
  if (!output.get(outputIds.ON_VALIDATE)) {
    output.add(outputIds.ON_VALIDATE, '校验触发', {
      type: 'string'
    });
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
  //=========== v1.1.0 end ===============

  /**
   * v1.1.0 -> v1.1.1 调整选项标签的样式优先级
   */
  
  const preLabelStyle = getDeclaredStyle("label.ant-radio-wrapper > span:nth-child(2)");
  if(preLabelStyle) {
    setDeclaredStyle("label.ant-radio-wrapper", preLabelStyle.css);
    removeDeclaredStyle("label.ant-radio-wrapper > span:nth-child(2)");
  }

  const preLabelDisableStyle = getDeclaredStyle("label.ant-radio-wrapper.ant-radio-wrapper-disabled > span:nth-child(2)");
  if(preLabelDisableStyle) {
    setDeclaredStyle("label.ant-radio-wrapper.ant-radio-wrapper-disabled", preLabelDisableStyle.css);
    removeDeclaredStyle("label.ant-radio-wrapper.ant-radio-wrapper-disabled > span:nth-child(2)");
  }

  input.add('setActiveFontColor', '设置激活选项字体的颜色', { type: "string" });

  return true;
}