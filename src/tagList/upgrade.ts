import { Data } from './types';
import { isEmptyObject } from '../utils';
import { descriptionUp } from '../form-coms/utils/descriptionUp';
import { TagSchema, checkableTagSchema } from './editor/index'

export default function ({ input, output, data, setDeclaredStyle }: UpgradeParams<Data>): boolean {
  const { tagStyle } = data;
  if (!data.appendBtn) {
    data.appendBtn = {
      text: '新增',
      icon: 'PlusOutlined'
    };
  }
  if (!data.hasOwnProperty('useAppendBtn')) {
    data.useAppendBtn = true;
  }
  if (!output.get('outputTags')) {
    output.add('outputTags', '输出标签列表', {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          icon: {
            title: '图标',
            type: 'string'
          },
          content: {
            title: '标签内容',
            type: 'string'
          },
          color: {
            title: '背景颜色',
            type: 'string'
          },
          closable: {
            title: '是否可关闭',
            type: 'boolean'
          }
        }
      }
    });
  }

  if (!input.get('getTags')) {
    input.add('getTags', '获取标签列表', { type: 'any' }, '获取标签列表数据');
    const getTagsInput = input.get('getTags');
    getTagsInput.setRels(['outputTags']);
  }

  if (tagStyle && !isEmptyObject(tagStyle)) {
    data.tags.forEach(({ borderColor, color, textColor }, index) => {
      const selector = `div[data-root] span[data-index="${index}"]`;
      const style = {
        background: color || tagStyle?.color,
        color: textColor || tagStyle?.textColor,
        borderColor: borderColor || tagStyle?.borderColor
      };
      setDeclaredStyle(selector, style);
    });
    data.tagStyle = {};
  }

  // 兼容1.0.8版本之前 没有关闭设置，使用appendAble作为判断条件的数据
  if (typeof data.closeAble === 'undefined' && data.appendAble) {
    data.closeAble = true;
  }

  const dynamicInput = input.get('dynamicTags');
  if (dynamicInput) {
    if (!output.get('dynamicComplete')) {
      output.add('dynamicComplete', '完成', { type: 'any' });
      dynamicInput.setRels(['dynamicComplete']);
    }
  }

  /**
   * @description v1.0.14 新增description
  */
  const descriptionUpList = [
    {
      type: 'output',
      id: 'outputTags',
      schema: {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "icon": {
              "title": "图标",
              "type": "string",
              "description": "标签的图标"
            },
            "content": {
              "title": "标签内容",
              "type": "string",
              "description": "标签的内容"
            },
            "color": {
              "title": "背景颜色",
              "type": "string",
              "description": "标签的背景颜色"
            },
            "closable": {
              "title": "是否可关闭",
              "type": "boolean",
              "description": "标签是否可关闭"
            }
          }
        }
      }
    }
  ];
  descriptionUp(descriptionUpList, input, output);
  //=========== 1.0.14 end ===============

  /**
   * @description v1.0.15 新增clickAble 是否可点击
  */
  if (typeof data.clickAble === 'undefined' ) {
    data.clickAble = false;
  }
  //=========== 1.0.15 end ===============

  /**
   * @description v1.0.16 升级'onCheck''选中状态改变时'的schema
  */
  const onCheckSchema = {
    type: 'object',
    properties: {
      changed: checkableTagSchema,
      checked: {
        type: 'array',
        description: "选中项",
        items: checkableTagSchema
      },
      allTag: {
        type: 'array',
        description: '全部标签项',
        items: checkableTagSchema
      }
    }
  };
  const oldSchema = output.get('onCheck');
  if (output.get('onCheck') &&  oldSchema !== onCheckSchema) {
    output.get('onCheck').setSchema(onCheckSchema);
  }
  if(data.checkable === true && !input.get('getCheckedTags') && !output.get('checkedTags')){
    input.add('getCheckedTags', '获取选中项', {type: 'any'});
    output.add('checkedTags', '选中项', {
      type: 'array',
      description: "选中项",
      items: checkableTagSchema
    })
    ;
    input.get('getCheckedTags').setRels(['checkedTags']);
  }
  //=========== 1.0.16 end ===============


  if (data.checkable) {
    input.get('dynamicTags') &&
      input.get('dynamicTags').setSchema({ type: 'array', items: checkableTagSchema });
  } else {
    input.get('dynamicTags') &&
      input.get('dynamicTags').setSchema({ type: 'array', items: TagSchema });
  }

  return true;
}
