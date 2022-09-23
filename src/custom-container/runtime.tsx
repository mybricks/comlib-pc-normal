import React, { useEffect, useRef } from 'react';
import { Data, SlotIds, InputIds, OutputIds, OverflowEnum } from './constants';
import css from './style.less';

export default function (props: RuntimeParams<Data>) {
  const { env, data, slots, inputs, outputs } = props;
  const {
    useSrcollIntoView,
    behavior,
    block,
    inline,

    overflowY,
    overflowX,
    useOverflowUnset,

    style,
    hoverStyle,
    useHoverStyle,
    useClick
  } = data;
  const ref = useRef<any>();

  useEffect(() => {
    if (env.runtime) {
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

  const getOverflowStyle = () => {
    const res = {
      overflowY: overflowY || OverflowEnum.Hidden,
      overflowX: overflowX || OverflowEnum.Hidden
    };
    if (useOverflowUnset) {
      res.overflowX = res.overflowX === OverflowEnum.Hidden ? OverflowEnum.Unset : res.overflowX;
      res.overflowY = res.overflowY === OverflowEnum.Hidden ? OverflowEnum.Unset : res.overflowY;
    }
    return res;
  };

  return (
    <div
      ref={ref}
      className={css.container}
      style={{
        ...style,
        ...getOverflowStyle(),
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
      {slots[SlotIds.Content].render()}
    </div>
  );
}
