import React, { useCallback, useEffect } from 'react';
import { Image } from 'antd';
import { Data, InputIds, OutputIds } from './constants';
import css from './runtime.less';

export default function ({ env, data, inputs, outputs }: RuntimeParams<Data>) {
  const { alt, src, customStyle, useFallback, fallbackImgSrc, usePreview, previewImgSrc } = data;

  useEffect(() => {
    if (env.runtime) {
      inputs[InputIds.SetImgSrc]((val, relOutputs) => {
        if (typeof val === 'string') {
          data.src = val;
          relOutputs['setImgSrcDone'](val);
        }
      });
      inputs[InputIds.SetPreviewImgSrc]?.((val, relOutputs) => {
        if (typeof val === 'string') {
          data.previewImgSrc = val;
          relOutputs['setPreviewImgSrcDone'](val);
        }
      });
    }
  }, []);

  const onClick = useCallback(() => {
    outputs[OutputIds.Click]();
  }, []);

  return (
    <div className={css.container}>
      <Image
        alt={env.i18n(alt)}
        src={src}
        width="100%"
        height="100%"
        style={{
          cursor:
            outputs[OutputIds.Click] && outputs[OutputIds.Click]?.getConnections()?.length > 0
              ? 'pointer'
              : undefined,
          ...(customStyle || {})
        }}
        fallback={useFallback && fallbackImgSrc ? fallbackImgSrc : undefined}
        preview={usePreview && env.runtime ? { src: previewImgSrc || src } : false}
        onClick={onClick}
      />
    </div>
  );
}
