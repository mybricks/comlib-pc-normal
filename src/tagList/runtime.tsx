import React from 'react';
import { message, Space, Tag } from 'antd';
import * as Icons from '@ant-design/icons';
import { Data, Tag as TagType } from './types';
import { uuid } from '../utils';
import styles from './style.less';

const preset = ['success', 'processing', 'error', 'warning', 'default'];

export default function ({ data, inputs, outputs, slots }: RuntimeParams<Data>) {
  const { tags, direction, align, wrap, size, tagSize } = data;

  const onTagChange = (index: number) => {
    const pre = data.tags[index];
    data.tags[index] = { ...pre, checked: !pre.checked };
    outputs['onChange'](!pre.checked);
  };

  const onTagClose = (index: number, tag: TagType) => {
    data.tags.splice(index, 1);
    outputs['onClose'](tag);
  };

  inputs['dynamicTags'] &&
    inputs['dynamicTags']((val: Array<TagType>) => {
      if (!Array.isArray(val)) {
        message.error('请输入列表数据');
        return;
      }
      data.tags = val.map((item) => {
        if (!item.key) {
          item.key = uuid();
        }
        return item;
      });
    });

  const renderTag = () => {
    return tags.map((tag, index) => {
      const { key, checkable, checked, content, icon, closable, color, textColor, borderColor } =
        tag;
      const isPreset = preset.includes(color as string);
      if (checkable) {
        return (
          <Tag.CheckableTag
            key={key}
            className={styles[tagSize]}
            data-index={index}
            data-item-tag="tag"
            checked={checked as boolean}
            style={!isPreset ? { color: textColor, borderColor } : {}}
            onChange={() => onTagChange(index)}
          >
            {content}
          </Tag.CheckableTag>
        );
      }
      return (
        <Tag
          key={key}
          className={styles[tagSize]}
          data-index={index}
          data-item-tag="tag"
          color={color}
          closable={closable}
          onClose={() => onTagClose(index, tag)}
          icon={Icons && Icons[icon as string]?.render()}
          style={!isPreset ? { color: textColor, borderColor } : {}}
        >
          {content}
        </Tag>
      );
    });
  };

  return (
    <Space className={styles.wrap} direction={direction} align={align} wrap={wrap} size={size}>
      {renderTag()}
    </Space>
  );
}
