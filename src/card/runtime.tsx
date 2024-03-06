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
  const {
    title,
    useExtra,
    bordered,
    size,
    style,
    hoverable,
    useClick,
    isAction,
    isHeight,
    height
  } = data;

  const isMobile = checkIfMobile(env);

  useEffect(() => {
    if (env.runtime) {
      inputs[InputIds.SetTitle]((val: string, relOutputs) => {
        data.title = val;
        relOutputs['setTitleDone'](val);
      });
    }
  }, []);

  useEffect(() => {
    if (env.runtime) {
      inputs['external']((ds: any, relOutputs) => {
        data.inVal = ds;
        relOutputs['setExternalDone'](ds);
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
        title={data.showTitle ? env.i18n(title) : ''}
        size={isMobile ? 'small' : size}
        bodyStyle={{
          padding: isMobile ? '12px' : data.padding,
          height: isHeight ? height : '100%'
        }}
        bordered={bordered}
        style={{
          cursor: data.cursor ? CursorType.Pointer : CursorType.Default,
          height: isHeight ? void 0 : props.style.height,
          overflow: isHeight ? void 0 : 'auto'
        }}
        extra={useExtra ? slots[SlotIds.Extra]?.render() : undefined}
        hoverable={hoverable}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        actions={isAction ? RenderAction() : void 0}
      >
        <div
          style={{
            overflowY: data.isHeight && env.runtime ? 'auto' : 'hidden',
            overflowX: typeof props.style.width === 'number' ? 'auto' : void 0
          }}
          className={css.containerCard}
        >
          {slots[SlotIds.Body]?.render({
            style: env.runtime ? data.slotStyle : { ...data.slotStyle, minHeight: 30 }
          })}
        </div>
      </Card>
    </div>
  );
};
