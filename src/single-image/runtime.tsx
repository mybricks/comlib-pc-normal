import React, { useCallback, useEffect } from 'react';
import { Image } from 'antd';
import { Data, InputIds, OutputIds } from './constants';
import css from './runtime.less';
import { uuid } from '../utils';

export default function ({ env, data, inputs, outputs, style }: RuntimeParams<Data>) {
  const {
    alt,
    src,
    customStyle,
    useFallback,
    fallbackImgSrc,
    usePreview,
    previewImgSrc,
    disableDrag,
    disableContextMenu
  } = data;
  const { runtime } = env;

  const uuidId = uuid(); // 使用runtime.less生成的选择器对每个组件是固定的，所以需要再加id处理

  useEffect(() => {
    if (runtime) {
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

  const onVisibleChange = (visible: boolean) => {
    if (visible) {
      const previewElement = document.body.querySelector(`.${css.preview}.${uuidId}`);
      if (!previewElement) {
        return;
      }
      const imageElement = previewElement?.querySelectorAll('img.ant-image-preview-img');
      const wrapperElements = previewElement?.querySelector(`.ant-image-preview-img-wrapper`);
      if (wrapperElements && disableDrag) {
        wrapperElements.classList.add(css.wrapper);
      }
      if (imageElement && imageElement?.length > 0) {
        imageElement.forEach((element) => {
          disableContextMenu && element?.addEventListener('contextmenu', (e) => e.preventDefault());
          disableDrag && element?.addEventListener('dragstart', (e) => e.preventDefault());
        });
      }
    }
  };

  return (
    <div className={css.container}>
      <Image
        alt={env.i18n(alt)}
        src={src}
        width="100%"
        height="100%"
        style={{
          objectFit: data?.objectFit || 'fill',
          cursor:
            outputs[OutputIds.Click] && outputs[OutputIds.Click]?.getConnections()?.length > 0
              ? 'pointer'
              : undefined,
          ...(customStyle || {})
        }}
        fallback={useFallback && fallbackImgSrc ? fallbackImgSrc : undefined}
        preview={
          usePreview && runtime
            ? {
                src: previewImgSrc || src,
                className: `${css.preview} ${uuidId}`,
                onVisibleChange
              }
            : usePreview && !runtime
            ? {}
            : false
        }
        onClick={onClick}
        onContextMenu={(e) => disableContextMenu && e.preventDefault()}
        onDragStart={(e) => disableDrag && e.preventDefault()}
      />
    </div>
  );
}
