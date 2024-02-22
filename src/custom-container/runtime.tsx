import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Data, SlotIds, InputIds, OutputIds, OverflowEnum } from './constants';
// import { useResizeObserver } from '../hooks/useResizeObserver';
import css from './style.less';

export default function (props: RuntimeParams<Data>) {
  const { env, data, slots, inputs, outputs, style } = props;
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

  const [dynamicStyle, setDynamicStyle] = useState<React.CSSProperties>({});
  const [preHeight, setPreHeight] = useState('auto');
  const [preType, setPreType] = useState('normal');

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

      inputs[InputIds.SetStyle] &&
        inputs[InputIds.SetStyle]((style: React.CSSProperties, relOutputs) => {
          setDynamicStyle(style);
          typeof relOutputs['setStyleComplete'] === 'function' && relOutputs['setStyleComplete']();
        });

      inputs[InputIds.ScrollTo] &&
        inputs[InputIds.ScrollTo]((val: number, relOutputs) => {
          if (ref.current) {
            ref.current.scrollTop = typeof val !== 'number' ? ref.current.scrollHeight : val;
            typeof relOutputs['scrollComplete'] === 'function' && relOutputs['scrollComplete']();
          }
        });
    }
  }, []);

  const legacyStyle = useMemo(() => {
    const legacyStyle = { ...data.legacyStyle };
    if (env.runtime.debug || env.edit) {
      Object.entries(legacyStyle).map(([key, value]) => {
        if (typeof value === 'string' && value?.includes('vw')) {
          legacyStyle[key] = value.replace('vw', '%');
        }
      });
    }
    return { ...legacyStyle, ...data.legacyConfigStyle };
  }, [data.legacyConfigStyle, data.legacyStyle]);

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

  const slotStyle = useMemo(() => {
    const minHeight = dynamicStyle?.minHeight || legacyStyle?.minHeight;
    const maxHeight = dynamicStyle?.maxHeight || legacyStyle?.maxHeight;
    const minWidth = dynamicStyle?.minWidth || legacyStyle?.minWidth;
    const maxWidth = dynamicStyle?.maxWidth || legacyStyle?.maxWidth;
    return {
      ...(data.slotStyle || {}),
      minHeight,
      maxHeight,
      minWidth,
      maxWidth
    };
  }, [dynamicStyle, legacyStyle, data.slotStyle]);

  // useResizeObserver(ref, (entries) => {
  //   if (!ref.current) return;
  //   if (env.edit || env.runtime?.debug) {
  //     const { contentRect } = entries[0];
  //     ref.current.style.height = `${contentRect.height}px`;
  //   }
  // });

  useEffect(() => {
    setPreHeight(style.height);
  }, []);

  useEffect(() => {
    //1、先把normal的高度存起来
    if (data.slotStyle?.flexDirection !== 'smart') {
      setPreHeight(style.height);
      setPreType('normal');
    } else {
      setPreType('smart');
    }
  }, [data.slotStyle, style.height]);

  //2、切换到smart布局时，高度改为200
  useEffect(() => {
    if (env.edit && data.slotStyle?.flexDirection === 'smart' && preHeight === 'auto') {
      style.height = 200;
    }
  }, [data.slotStyle?.flexDirection, preHeight]);

  //3、从smart切换到normal时，取出preHeight，给到style.height
  if (preType === 'smart' && data.slotStyle?.flexDirection !== 'smart') {
    style.height = preHeight;
  }

  if (env.runtime && data.slotStyle?.flexDirection === 'smart') {
    style.height = 'auto';
  }

  return (
    <div
      id={data?.id}
      ref={ref}
      className={`${css.container} root`}
      style={{
        position: useFixed ? 'fixed' : 'static',
        cursor: useClick ? 'pointer' : '',
        ...legacyStyle,
        ...dynamicStyle
      }}
      onClick={() => {
        if (useClick && outputs[OutputIds.Click]) {
          outputs[OutputIds.Click]();
        }
      }}
    >
      <div
        className={
          data.isAutoScroll && env.runtime
            ? data.direction === 'vertical'
              ? css.verticalRowUp
              : css.horizontalRowUp
            : void 0
        }
        style={
          data.isAutoScroll && env.runtime ? { animationDuration: `${data.scrollTime}ms` } : void 0
        }
      >
        {slots[SlotIds.Content].render({ style: slotStyle })}
      </div>
    </div>
  );
}
