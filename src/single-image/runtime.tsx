import React, { useCallback, useEffect } from 'react';
import { Image } from 'antd';
import { Data, InputIds, OutputIds } from './constants';

export default function ({ env, data, inputs, outputs }: RuntimeParams<Data>) {
  const { alt, src, customStyle, useFallback, fallbackImgSrc, usePreview, previewImgSrc } = data;

  useEffect(() => {
    if (env.runtime) {
      inputs[InputIds.SetImgSrc]((val) => {
        if (typeof val === 'string') {
          data.src = val;
        }
      });
    }
  }, []);

  const onClick = useCallback(() => {
    outputs[OutputIds.Click]();
  }, []);

  return (
    <Image
      alt={alt}
      src={src}
      width="100%"
      height="100%"
      style={{
        cursor: 'pointer',
        ...(customStyle || {})
      }}
      fallback={useFallback && fallbackImgSrc ? fallbackImgSrc : undefined}
      preview={usePreview && env.runtime ? { src: previewImgSrc || src } : false}
      onClick={onClick}
    />
  );
}
