import React, { useEffect, useRef, useMemo } from 'react';
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
    useClick,
    useFixed
  } = data;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (useFixed && ref.current?.parentElement?.style) {
      ref.current.parentElement.style.zIndex = '1001';
    }

    if (env.runtime) {
      if (useSrcollIntoView && inputs[InputIds.ScrollIntoView]) {
        inputs[InputIds.ScrollIntoView](() => {
          if (ref.current?.scrollIntoView) {
            ref.current.scrollIntoView({
              behavior,
              block,
              inline
            });
          }
        });
      }
    }
  }, []);

  const legacyConfigStyle = useMemo(() => {
    return data.legacyConfigStyle ?? {};
  }, [data.legacyConfigStyle]);

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
      id={data?.id}
      ref={ref}
      data-root="root"
      className={css.container}
      style={{
        ...getOverflowStyle(),
        transition: 'all 0.2s',
        position: useFixed ? 'fixed' : 'static',
        cursor: useClick ? 'pointer' : '',
        ...legacyConfigStyle
      }}
      onClick={() => {
        if (useClick && outputs[OutputIds.Click]) {
          outputs[OutputIds.Click]();
        }
      }}
    >
      {slots[SlotIds.Content].render({ style: data.slotStyle })}
    </div>
  );
}
