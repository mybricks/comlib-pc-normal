import React, { useState, useCallback, useEffect } from 'react';
import { Image } from 'antd';
import { Data, InputIds, OutputIds } from './constants';
import css from './runtime.less';
import { uuid } from '../utils';

export default function ({ env, data, inputs, outputs, style }: RuntimeParams<Data>) {
  const {
    images = [],
    layout,
    columns,
    gap,
    objectFit,
    useFallback,
    fallbackImgSrc,
    usePreview,
    disableDrag,
    disableContextMenu
  } = data;
  const { runtime } = env;

  const [imageItemStyle, setImageItemStyle] = useState({})

  const uuidId = uuid();

  useEffect(() => {
    if (runtime) {
      inputs[InputIds.SetImages]?.((val, relOutputs) => {
        if (Array.isArray(val)) {
          data.images = val.map((item) => ({
            id: item.id || uuid(),
            src: item.src || '',
            alt: item.alt || '',
            previewImgSrc: item.previewImgSrc || '',
            width: item.width,
            height: item.height,
            style: item.style
          }));
          relOutputs['setImagesDone'](data.images);
        }
      });

      inputs[InputIds.AddImages]?.((val, relOutputs) => {
        if (Array.isArray(val)) {
          const newItems = val.map((item) => ({
            id: item.id || uuid(),
            src: item.src || '',
            alt: item.alt || '',
            previewImgSrc: item.previewImgSrc || '',
            width: item.width,
            height: item.height,
            style: item.style
          }));
          data.images = [...data.images, ...newItems];
          relOutputs['addImagesDone'](data.images);
        }
      });

      inputs[InputIds.SetImageStyle]?.((val, relOutputs) => {
        if (val && typeof val === 'object') {
          const {  style: itemStyle } = val;
          setImageItemStyle(itemStyle)
          relOutputs['setImageStyleDone'](itemStyle);
        }
      });
    }
  }, []);

  useEffect(() => {
    inputs[InputIds.GetImages]?.((val, relOutputs) => {
      relOutputs['getImagesDone'](data.images);
    });
  }, [data.images]);

  const onClick = useCallback(
    (index: number, item: any) => {
      outputs[OutputIds.Click]({
        index,
        id: item.id,
        src: item.src,
        alt: item.alt,
        width: item.width,
        height: item.height,
        style: item.style
      });
    },
    []
  );

  const onVisibleChange = (visible: boolean) => {
    if (visible) {
      const previewElement = document.body.querySelector(`.${css.preview}.${uuidId}`);
      if (!previewElement) return;
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

  const containerStyle: React.CSSProperties = {
    gap: `${gap || 0}px`,
    ...(layout === 'grid'
      ? {display: 'grid', gridTemplateColumns: `repeat(${columns || 3}, 1fr)` }
      : {display: 'flex', flexWrap: 'wrap'})
  };

  const renderImage = (item: any, index: number) => {
    const itemWidth = item.width !== undefined ? item.width : '100%';
    const itemHeight = item.height !== undefined ? item.height : '100%';

    const imageProps: any = {
      alt: env.i18n(item.alt),
      src: item.src,
      width: itemWidth,
      height: itemHeight,
      style: {
        maxWidth: itemWidth,
        maxHeight: itemHeight,
        objectFit: objectFit || 'cover',
        ...(imageItemStyle || {})
      },
      fallback: useFallback && fallbackImgSrc ? fallbackImgSrc : undefined,
      onClick: () => onClick(index, item),
      onContextMenu: (e: React.MouseEvent) => disableContextMenu && e.preventDefault(),
      onDragStart: (e: React.DragEvent) => disableDrag && e.preventDefault()
    };

    if (usePreview && runtime) {
      imageProps.preview = {
        src: item.previewImgSrc || item.src
      };
    } else if (usePreview && !runtime) {
      imageProps.preview = {};
    } else {
      imageProps.preview = false;
    }

    return (
      <div className={`${css['mult-image-item']} mult-image-item`} key={item.id || index}>
        <Image {...imageProps} />
      </div>
    );
  };

  if (!images || images.length === 0) {
    return <div className={css.empty}>暂无图片</div>;
  }

  const imageList = images.map((item, index) => renderImage(item, index));

  return (
    <div className={`${css.container} ${layout === 'grid' ? css.grid : css.flex} mult-image-contain`} style={containerStyle}>
      {usePreview && runtime ? (
        <Image.PreviewGroup
          preview={{
            className: `${css.preview} ${uuidId}`,
            onVisibleChange
          }}
        >
          {imageList}
        </Image.PreviewGroup>
      ) : (
        imageList
      )}
    </div>
  );
}
