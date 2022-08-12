import React, { useEffect } from 'react';
import { Card } from 'antd';
import { Data, InputIds, OutputIds, SlotIds } from './constants';

const CursorType = {
  Pointer: 'pointer',
  Default: 'default'
};
export default (props: RuntimeParams<Data>) => {
  const { data, slots, inputs, env, outputs } = props;
  const {
    title,
    useExtra,
    bordered,
    size,
    style,
    bodyStyle,
    hoverable,
    useClick,
    outputContent
  } = data;

  useEffect(() => {
    if (env.runtime) {
      inputs[InputIds.SetTitle]((val: string) => {
        data.title = val;
      });
    }
  }, []);

  return (
    <Card
      title={env.i18n(title)}
      size={size}
      bodyStyle={bodyStyle}
      bordered={bordered}
      style={{
        ...style,
        cursor: data.cursor ? CursorType.Pointer : CursorType.Default
      }}
      extra={useExtra ? slots[SlotIds.Extra]?.render() : undefined}
      hoverable={hoverable}
      onClick={() => {
        if (useClick && outputs[OutputIds.Click]) {
          outputs[OutputIds.Click](outputContent);
        }
      }}
    >
      {slots[SlotIds.Body]?.render()}
    </Card>
  );
};
