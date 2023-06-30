import React from 'react';
import { clipPaths, ShapeProps } from './constants';
import css from './runtime.less';

const wrapperStyles: React.CSSProperties = {
  width: '100%',
  height: '100%'
};

interface RuntimeShapeProps {
  data: ShapeProps;
}

export default function ({ data }: RuntimeShapeProps) {
  const { type, image, rotate, size, isImgRotate } = data;

  const shapeStyles: React.CSSProperties = {
    width: `${size}%`,
    aspectRatio: 1 / 1,
    clipPath: clipPaths[type],
    transform: `rotate(${rotate}deg)`
  };

  const imgStyles: React.CSSProperties = {
    top: 0,
    left: 0,
    objectFit: 'cover',
    transform: `rotate(${isImgRotate ? 0 : -rotate}deg)`
  };

  return (
    <div style={wrapperStyles} className={css.wrapper}>
      <div style={shapeStyles} className={css.shape} data-item-type="shape">
        {image && <img src={image} alt="" style={imgStyles} />}
      </div>
    </div>
  );
}
