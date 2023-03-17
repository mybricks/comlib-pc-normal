import React, { useEffect, useCallback } from 'react';
import { Card } from 'antd';
import { Data, InputIds, OutputIds, SlotIds } from './constants';
import css from './runtime.less';

const CursorType = {
  Pointer: 'pointer',
  Default: 'default'
};
export default (props: RuntimeParams<Data>) => {
  const { data, slots, inputs, env, outputs } = props;
  const { title, useExtra, bordered, size, style, bodyStyle, hoverable, useClick, outputContent } =
    data;

  useEffect(() => {
    if (env.runtime) {
      inputs[InputIds.SetTitle]((val: string) => {
        data.title = val;
      });
    }
  }, []);

  useEffect(() => {
    if (env.runtime) {
      inputs['external']((ds: any) => {
        data.inVal = ds;
      });
    }
  });

  const onClick = useCallback(() => {
    if (env.runtime && useClick && outputs[OutputIds.Click]) {
      const outVal: string | number =
        data.dataType === 'external' ? data.inVal : data.outputContent;
      outputs[OutputIds.Click](outVal);
    }
  }, []);

  let borderSty = bordered ? data.borderStyle : {};

  return (
    <div className={css.card}>
      <Card
        title={env.i18n(title)}
        size={size}
        bodyStyle={bodyStyle}
        bordered={bordered}
        style={{
          ...style,
          cursor: data.cursor ? CursorType.Pointer : CursorType.Default,
          height: '100%',
          ...borderSty
        }}
        extra={useExtra ? slots[SlotIds.Extra]?.render() : undefined}
        hoverable={hoverable}
        onClick={onClick}
      >
        <div
          style={{
            overflowY: props.style.height !== 'auto' ? 'auto' : void 0,
            overflowX: props.style.width !== 'auto' ? 'auto' : void 0
          }}
          className={data.title === '' ? css.noTitleContainer : css.container}
        >
          {slots[SlotIds.Body]?.render()}
        </div>
      </Card>
    </div>
  );
};
