import React from 'react';
import { Divider } from 'antd';
import { DataType } from './constants';

export default function ({ data, slots, env }: RuntimeParams<DataType>) {
  const { type, dashed, style, orientation, children, orientationMargin, customizableTitle } = data;
  const childrenNode =
    type === 'horizontal' && (customizableTitle ? slots['title']?.render() : env.i18n(children));

  return (
    <Divider
      type={type}
      style={style}
      dashed={dashed}
      orientation={orientation}
      orientationMargin={orientationMargin}
      children={childrenNode}
    />
  );
}
