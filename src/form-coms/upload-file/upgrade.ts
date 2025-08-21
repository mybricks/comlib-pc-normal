import { inputIds, outputIds, commonFormItemUpdateSchema } from '../form-container/constants';
import { descriptionUp } from '../utils/descriptionUp';
import { descriptionUpList } from './constants';
import { getFilterSelector } from '../../utils/cssSelector';

export default function ({
  id,
  input,
  output,
  slot,
  data,
  getDeclaredStyle,
  removeDeclaredStyle,
  setDeclaredStyle
}): boolean {
  //1.0.0 -> 1.0.1
  input.get('setValue')?.setSchema({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        url: {
          type: 'string'
        }
      }
    }
  });
  input.get('uploadDone')?.setSchema({
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      url: {
        type: 'string'
      }
    }
  });

  // 1.0.1 -> 1.0.2
  output.get('upload')?.setSchema({
    type: 'object'
  });

  //1.0.2 -> 1.0.3
  const valueSchema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        url: {
          type: 'string'
        },
        status: {
          type: 'string'
        },
        percent: {
          type: 'number'
        },
        response: {
          type: 'string'
        }
      }
    }
  };
  if (!input.get('setInitialValue')) {
    input.add('setInitialValue', '设置初始值', valueSchema);
  }
  if (!output.get('onInitial')) {
    output.add('onInitial', '值初始化', valueSchema);
  }
  output.get('onInitial').setTitle('值初始化');

  input.get('setValue').setSchema({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        url: {
          type: 'string'
        },
        status: {
          type: 'string'
        },
        percent: {
          type: 'number'
        },
        response: {
          type: 'string'
        }
      }
    }
  });
  input.get('uploadDone')?.setSchema({
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      url: {
        type: 'string'
      },
      status: {
        type: 'string'
      },
      percent: {
        type: 'number'
      },
      response: {
        type: 'string'
      }
    }
  });

  if (!input.get('remove')) {
    input.add('remove', '删除文件', {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        uid: {
          type: 'string'
        }
      }
    });
  }

  if (!output.get('remove')) {
    output.add('remove', '删除文件', {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        uid: {
          type: 'string'
        },
        url: {
          type: 'string'
        },
        status: {
          type: 'string'
        },
        percent: {
          type: 'number'
        },
        response: {
          type: 'string'
        }
      }
    });
  }

  /**
   * @description v1.0.7 , 新增自定义插槽, 展示文件列表
   */
  if (!slot?.get('carrier')) {
    slot.add('carrier', '添加组件');
  }
  if (typeof data.isShowUploadList === 'undefined') {
    data.isShowUploadList = true;
  }

  /**
   * @description v1.0.8 , 新增尺寸校验
   */
  if (typeof data.imageSize === 'undefined') {
    data.imageSize = [0, 0];
  }

  // 早期版本。默认都使用自定义上传
  if (typeof data.customUpload === 'undefined') {
    data.customUpload = true;
  }

  /**
   * @description v1.0.22->1.0.23 , 新增上传点击事件
   */
  if (typeof data.fileClick === 'undefined') {
    data.fileClick = false;
  }

  if (typeof data.onDownload === 'undefined') {
    data.onDownload = false;
  }

  /**
   * @description v1.0.24 新增启用/禁用 输入项
   */
  if (!input.get(inputIds.IsEnable)) {
    input.add(inputIds.IsEnable, '启用/禁用', {
      type: 'boolean'
    });
  }
  //=========== v1.1.1 end ===============

  /**
   * @description v1.0.27 新增关联输出项
   */
  if (input.get('setDisabled').schema.type === 'boolean') {
    input.get('setDisabled').setSchema({
      type: 'any'
    });
  }
  if (input.get('setEnabled').schema.type === 'boolean') {
    input.get('setEnabled').setSchema({
      type: 'any'
    });
  }
  //1、设置值
  const initValueSchema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        url: {
          type: 'string'
        },
        status: {
          type: 'string'
        },
        percent: {
          type: 'number'
        },
        response: {
          type: 'string'
        }
      }
    }
  };
  if (!output.get(outputIds.setValueDone)) {
    output.add(outputIds.setValueDone, '设置值完成', initValueSchema);
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
    output.add(outputIds.setInitialValueDone, '设置初始值完成', initValueSchema);
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

  //7、上传完成 uploadComplete
  if (!output.get('uploadComplete')) {
    output.add('uploadComplete', '设置值完成', initValueSchema);
  }
  if (
    output.get('uploadComplete') &&
    input.get('uploadDone') &&
    !input.get('uploadDone')?.rels?.includes('uploadComplete')
  ) {
    input.get('uploadDone').setRels(['uploadComplete']);
  }

  //8、删除文件
  const removeSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      uid: {
        type: 'string'
      }
    }
  };
  if (!output.get('removeDone')) {
    output.add('removeDone', '删除文件完成', removeSchema);
  }
  if (
    output.get('removeDone') &&
    input.get('remove') &&
    !input.get('remove')?.rels?.includes('removeDone')
  ) {
    input.get('remove').setRels(['removeDone']);
  }
  //=========== v1.0.27 end ===============

  /**
   * @description v1.0.30 新增hideIcon
   */
  if (typeof data.hideIcon === 'undefined') {
    data.hideIcon = false;
  }
  //=========== v1.0.30 end ===============

  /**
   * @description v1.0.32 新增 编辑/可读输入
   */
  if (!output.get(outputIds.isEditableDone)) {
    output.add(outputIds.isEditableDone, '设置编辑/只读完成', { type: 'boolean' });
  }
  if (
    output.get(outputIds.isEditableDone) &&
    input.get(inputIds.isEditable) &&
    !input.get(inputIds.isEditable)?.rels?.includes(outputIds.isEditableDone)
  ) {
    input.get(inputIds.isEditable).setRels([outputIds.isEditableDone]);
  }

  if (typeof data.isEditable === 'undefined') {
    data.isEditable = true;
  }
  //=========== v1.0.32 end ===============

  /**
   * @description v1.0.33 新增 自定义图标配置
   */

  //=========== v1.0.33 end ===============

  /**
   * @description v1.0.40 change上传文案target
   */
  if (true) {
    const preStyle = getDeclaredStyle(`.ant-btn>.anticon+span`);
    removeDeclaredStyle(`.ant-btn>.anticon+span`);
    if (preStyle?.css) {
      setDeclaredStyle(`.text`, preStyle.css);
    }
  }

  //=========== v1.0.40 end ===============

  /**
   * @description v1.0.45 新增description
   */
  descriptionUp(descriptionUpList, input, output);
  //=========== 1.0.45 end ===============

  /**
   * @description v1.0.48 背景色，target 变化
   */
  const preStyle = getDeclaredStyle(['.ant-upload', '.ant-btn']);

  if (preStyle) {
    let contentCss = { ...preStyle.css };
    removeDeclaredStyle(['.ant-upload', '.ant-btn']);
    setDeclaredStyle(
      [
        `.ant-upload.ant-upload-select-picture-card${getFilterSelector(id)}`,
        `.ant-upload .ant-btn${getFilterSelector(id)}`
      ],
      contentCss,
      true
    );
  }
  //=========== 1.0.45 end ===============

  if (!data.rules) {
    data.rules = [];
  }

  if (!input.get('setValidateInfo')) {
    input.add('setValidateInfo', '设置校验状态', {
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

  if (!output.get('setValidateInfoDone')) {
    output.add('setValidateInfoDone', '设置校验状态完成', {
      type: 'object',
      properties: {
        validateStatus: {
          type: 'string'
        },
        help: {
          type: 'string'
        }
      }
    });
  }

  if (
    input.get('setValidateInfo') &&
    !input.get('setValidateInfo').rels?.includes('setValidateInfoDone')
  ) {
    input.get('setValidateInfo').setRels(['setValidateInfoDone']);
  }

  if (!output.get('onValidate')) {
    output.add('onValidate', '校验触发', {
      type: 'array'
    });
  }

  //=========== v1.0.54 end ===============
  
  const transferStyleBetweenSelectors = (prevSelector, currentSelector) => {
    const preStyle = getDeclaredStyle(prevSelector);
    let currentCss: React.CSSProperties = {};

    if (preStyle) {
      currentCss = { ...preStyle.css };
      removeDeclaredStyle(prevSelector);
      setDeclaredStyle(currentSelector, currentCss);
    }
  };

  transferStyleBetweenSelectors(
    [
      `.ant-upload.ant-upload-select-picture-card${getFilterSelector(id)}`,
      `.ant-upload .ant-btn${getFilterSelector(id)}`
    ],
    [`.ant-upload.ant-upload-select-picture-card`, `.ant-upload .ant-btn`]
  );

  return true;
}
