import React, { useEffect, useState } from 'react';
import { Image } from 'antd';
import { uuid } from '../utils';
import { Data, ImageItem, InputIds } from './constants';

export default function ({ env, data, inputs }: RuntimeParams<Data>) {
  const [imageInfo, setImageInfo] = useState(data.images);
  const setImages = (ds) => {
    if (data.configMode === 1) {
      if (Array.isArray(data.images) && Array.isArray(ds)) {
        const mapped: any[] = [];
        data.images.forEach((item, index) => {
          if (typeof ds[index] === 'string') {
            mapped.push({ ...item, src: ds[index] });
          } else {
            mapped.push({ ...item });
          }
        });
        data.images = mapped;
      } else if (
        !Array.isArray(ds) &&
        typeof ds === 'string' &&
        (!Array.isArray(data.images) || data.images.length === 1)
      ) {
        if (!Array.isArray(data.images)) {
          data.images = {
            ...data.images,
            src: ds
          };
        } else {
          data.images = {
            ...data.images[0],
            src: ds
          };
        }
      }
    } else if (data.configMode === 2) {
      if (Array.isArray(ds)) {
        const mapped: any[] = [];
        ds.forEach((item, index) => {
          if (typeof item === 'string') {
            mapped.push({
              id: uuid(),
              src: item,
              width: data.config.width,
              height: data.config.height,
              margin: data.config.margin,
              customBorderStyle: data.config.customBorderStyle,
              fallback: data.config.fallback,
              supportFallback: data.config.supportFallback,
              preview: data.config.preview
            });
          }
        });
        data.images = mapped;
      }
    }
    setImageInfo(data.images);
  };
  useEffect(() => {
    if (env.runtime) {
      inputs[InputIds.Image] && inputs[InputIds.Image](setImages);
      inputs[InputIds.SlotProps] && inputs[InputIds.SlotProps](setImages);
    }
  }, []);

  if (!Array.isArray(imageInfo)) {
    return (
      <div>
        <ImgRender item={imageInfo} />
      </div>
    );
  }
  return (
    <div>
      <Image.PreviewGroup>
        {imageInfo.map((image) => {
          return <ImgRender item={image} />;
        })}
      </Image.PreviewGroup>
    </div>
  );
}
// 单图片渲染
function ImgRender({ item }: { item: ImageItem }) {
  const {
    width,
    height,
    alt,
    src,
    fallback,
    placeholder,
    preview,
    id,
    customBorderStyle,
    margin,
    supportFallback
  } = item;

  const [top, bottom, left, right] = margin || [];

  const styles = {
    display: 'inline-flex',
    verticalAlign: 'bottom',
    marginTop: top,
    marginBottom: bottom,
    marginLeft: left,
    marginRight: right
  };
  return (
    <div key={id} data-img-id={id} style={styles}>
      <Image
        width={`${width}px`}
        height={`${height}px`}
        alt={alt}
        src={src}
        style={{ ...customBorderStyle }}
        fallback={supportFallback ? fallback : ''}
        placeholder={placeholder}
        preview={preview}
      />
    </div>
  );
}
