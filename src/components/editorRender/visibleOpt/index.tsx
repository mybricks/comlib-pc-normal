import React from 'react';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { ContentTypeEnum } from '../../../table/types';
// import css from './style.less';

export default ({ item, index, setList }) => {
  if ([ContentTypeEnum.Group, ContentTypeEnum.SlotItem].includes(item.contentType)) {
    return null;
  }
  return (
    <div
      onClick={() => {
        setList((prev) => {
          const copy = [...prev];
          if (copy && copy[index]) {
            copy[index].visible = !copy[index].visible;
          }
          return copy;
        });
      }}
    >
      {item.visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
    </div>
  );
};
