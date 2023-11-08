import React, { useEffect, useCallback } from 'react';
import { Card } from 'antd';
import { Data, InputIds, OutputIds, SlotIds } from './constants';
import css from './runtime.less';
import { checkIfMobile } from '../utils';

const CursorType = {
  Pointer: 'pointer',
  Default: 'default'
};
export default (props: RuntimeParams<Data>) => {
  const { data, slots, inputs, env, outputs } = props;
  const { title, useExtra, bordered, size, style, hoverable, useClick, isAction } = data;

  const isMobile = checkIfMobile(env);

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

  const onDoubleClick = useCallback(() => {
    if (env.runtime && useClick && outputs[OutputIds.DoubleClick]) {
      const outVal: string | number =
        data.dataType === 'external' ? data.inVal : data.outputContent;
      outputs[OutputIds.DoubleClick](outVal);
    }
  }, []);

  const RenderAction = () => {
    let itemsArr = data.items.map((item) => {
      return slots[item.key]?.render();
    });
    return itemsArr;
  };

  return (
    <div className={`${css.card} card`}>
      <Card
        title={env.i18n(title)}
        size={isMobile ? 'small' : size}
        bodyStyle={{
          padding: isMobile ? '12px' : data.padding,
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
        onDoubleClick={onDoubleClick}
        actions={isAction ? RenderAction() : void 0}
      >
        <div
          style={{
            overflowY: props.style.height !== 'auto' ? 'auto' : void 0,
            overflowX: props.style.width !== 'auto' ? 'auto' : void 0
          }}
          className={css.containerCard}
        >
          {slots[SlotIds.Body]?.render()}
        </div>
      </Card>
    </div>
  );
};
