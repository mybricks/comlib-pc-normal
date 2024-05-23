import React, { useCallback, useEffect, useState } from 'react';
import { Divider } from 'antd';
import { DataType } from './constants';

export default function ({ data, slots }: RuntimeParams<DataType>) {
  const { type, dashed, style, orientation, children, orientationMargin, customizableTitle } = data;

  const [renderedChildren, setRenderedChildren] = useState<React.ReactNode>(children);

  const childrenRender = useCallback(() => {
    if (customizableTitle) {
      setRenderedChildren(slots['title']?.render());
    } else {
      setRenderedChildren(children);
    }
  }, [customizableTitle, children]);

  useEffect(() => {
    childrenRender();
  }, [childrenRender]);

  return (
    <Divider
      type={type}
      style={style}
      dashed={dashed}
      orientation={orientation}
      orientationMargin={orientationMargin}
      children={type === 'horizontal' && renderedChildren}
    />
  );
}
