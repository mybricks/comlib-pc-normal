import React, { useEffect, useRef, useState } from 'react';
import { unitConversion } from '../utils';
import { Data, SlotIds, InputIds, OutputIds, OverflowEnum } from './constants';
import css from './style.less';

export default function ({
  env,
  data,
  slots,
  inputs = {},
  outputs
}: RuntimeParams<Data>) {
  const {
    id,
    useSlotProps,
    useSrcollIntoView,
    behavior,
    block,
    inline,

    overflowY,
    overflowX,

    style,
    hoverStyle,
    useHoverStyle,
    useClick,
    useSetMaxHeight,
    useFixed
  } = data;
  const [eleID, setEleID] = useState();
  const [maxHeight, setMaxHeight] = useState<string>();
  const ref = useRef<HTMLElement>();
  const slotRef = useRef<any>();
  const [slotProps, setSlotProps] = useState();

  useEffect(() => {
    // 临时hack
    if (useFixed && (ref.current as HTMLElement)?.parentElement?.style) {
      (ref.current as HTMLElement).parentElement.style.zIndex = '1001';
    }
    if (env.runtime) {
      if (useSlotProps && inputs[InputIds.SlotProps]) {
        inputs[InputIds.SlotProps]((val) => {
          setSlotProps(val);
          if (val !== undefined && typeof slotRef.current === 'function') {
            slotRef.current(val);
          }
          if (val && val._eleID && typeof val._eleID === 'string') {
            setEleID(val._eleID);
          }
        });
      }
      if (useSrcollIntoView && inputs[InputIds.ScrollIntoView]) {
        inputs[InputIds.ScrollIntoView](() => {
          if ((ref.current as HTMLElement)?.scrollIntoView) {
            (ref.current as HTMLElement)?.scrollIntoView({
              behavior,
              block,
              inline
            });
          }
        });
      }
      if (useSetMaxHeight && inputs[InputIds.SetMaxHeight]) {
        inputs[InputIds.SetMaxHeight]((val) => {
          setMaxHeight((val ? unitConversion(val) : '') || '');
        });
      }
    }
  }, []);

  const onMouseOver = () => {
    const ele = ref.current as HTMLElement;
    if (useHoverStyle && ele) {
      Object.keys(hoverStyle || {}).forEach((key) => {
        ele.style[key] = hoverStyle?.[key];
      });
    }
  };

  const onMouseLeave = () => {
    const ele = ref.current as HTMLElement;
    if (useHoverStyle && ele) {
      Object.keys(hoverStyle || {}).forEach((key) => {
        ele.style[key] = '';
      });
      Object.keys(style || {}).forEach((key) => {
        ele.style[key] = style?.[key];
      });
    }
  };

  return (
    <div
      id={eleID || id}
      ref={ref}
      className={css.container}
      style={{
        ...style,
        position: useFixed ? 'fixed' : undefined,
        maxHeight: maxHeight === undefined ? style?.maxHeight : maxHeight,
        overflowY: overflowY || OverflowEnum.Hidden,
        overflowX: overflowX || OverflowEnum.Hidden,
        cursor: useClick || useHoverStyle ? 'pointer' : ''
      }}
      onClick={() => {
        if (useClick && outputs[OutputIds.Click]) {
          outputs[OutputIds.Click]();
        }
      }}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      {slots[SlotIds.Content].render({
        inputs: {
          slotProps(fn) {
            slotRef.current = fn;
            if (slotProps !== undefined) {
              fn(slotProps);
            }
          }
        }
      })}
    </div>
  );
}
