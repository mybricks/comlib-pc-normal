import { inputIds, outputIds } from '../form-container/constants';
import { RuleKeys, ExpRules, mergeRules } from '../utils/validator';
import { Data } from './types';

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
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
  if (!output.get(outputIds.ON_VALIDATE)) {
    output.add(outputIds.ON_VALIDATE, '校验触发', {
      type: 'string'
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
   * @description v1.1.4 新增启用/禁用 输入项
   */
  if (!input.get(inputIds.IsEnable)) {
    input.add(inputIds.IsEnable, '启用/禁用', {
      type: 'boolean'
    });
  }
  //=========== v1.1.4 end ===============

  /**
   * @description v1.1.5 新增启用/禁用 输入项
   */
  if (!Reflect.has(data, 'customUpload')) {
    data.customUpload = false;
  }
  //=========== v1.1.5 end ===============

  /**
   * @description v1.1.9 新增关联输出项
   */
  //1、设置值
  if (!output.get(outputIds.setValueDone)) {
    output.add(outputIds.setValueDone, '设置值完成', { type: 'string' });
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
    output.add(outputIds.setInitialValueDone, '设置初始值完成', { type: 'string' });
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
  //7、设置校验结果
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
  //=========== v1.1.9 end ===============

  data.rules = mergeRules(ExpRules, data.rules);

  if (data?.icons === undefined) {
    data.icons = [];
  }

  if (data?.statusbar === undefined) {
    data.statusbar = false;
  }

  // v1.1.30 新增上传响应失败
  if (data.customUpload && !input.get('uploadReject')) {
    input.add('uploadReject', '上传失败响应', {
      type: 'string',
      title: '上传失败信息',
    });
  }

  if (input.get('uploadResponse') && !output.get(`${'uploadResponse'}Done`)) {
    output.add(`${'uploadResponse'}Done`, '完成', {
      type: 'object',
      properties: {
        url: {
          title: 'url',
          type: 'string'
        }
      }
    });
    input.get('uploadResponse').setRels([`${'uploadResponse'}Done`]);
  }

  if (input.get('uploadReject') && !output.get(`${'uploadReject'}Done`)) {
    output.add(`${'uploadReject'}Done`, '完成', { type: 'string' });
    input.get('uploadReject').setRels([`${'uploadReject'}Done`]);
  }

  return true;
}
