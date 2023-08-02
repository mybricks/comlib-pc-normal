import { Data } from './types';
import { isEmptyObject } from '../utils';

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
  return true;
}
