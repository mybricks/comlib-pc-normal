import { inputIds, outputIds } from '../form-container/constants';
import { RuleKeys } from '../utils/validator';
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
  const cutomRule = data.rules?.find((i) => i.key === RuleKeys.CUSTOM_EVENT);
  if (data.rules?.length && !cutomRule) {
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

  /**
   * @description v1.1.5 新增上传事件配置
   */
  if (!output.get('onUpload')) {
    output.add('onUpload', '上传', {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          file: {
            title: '文件内容',
            type: 'any'
          },
          file_type: {
            title: '文件类型',
            type: 'string'
          },
          file_name: {
            title: '文件名称',
            type: 'string'
          }
        }
      }
    });
  }

  if (!input.get('setUploadResponse')) {
    input.add('setUploadResponse', '上传响应', {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: {
            type: 'string'
          }
        }
      }
    });
  }

  //=========== v1.1.4 end ===============

  return true;
}
