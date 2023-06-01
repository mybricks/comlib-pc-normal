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
  const { title, useExtra, bordered, size, style, hoverable, useClick, isAction } = data;

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

  const RenderAction = () => {
    let itemsArr = data.items.map((item) => {
      return slots[item.key]?.render();
    });
    return itemsArr;
  };

  return (
    <div className={css.card}>
      <Card
        title={env.i18n(title)}
        size={size}
        bodyStyle={{
          padding: data.padding,
          height: title !== '' ? `calc(100% - ${data.padding}*2)` : '100%'
        }}
        bordered={bordered}
        style={{
          ...style,
          cursor: data.cursor ? CursorType.Pointer : CursorType.Default,
          height: '100%'
        }}
        extra={useExtra ? slots[SlotIds.Extra]?.render() : undefined}
        hoverable={hoverable}
        onClick={onClick}
        actions={isAction ? RenderAction() : void 0}
      >
        <div
          style={{
            overflowY: props.style.height !== 'auto' ? 'auto' : void 0,
            overflowX: props.style.width !== 'auto' ? 'auto' : void 0
          }}
          className={css.container}
        >
          {slots[SlotIds.Body]?.render()}
        </div>
      </Card>
    </div>
  );
};
