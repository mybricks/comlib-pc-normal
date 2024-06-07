import React, { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Sketch from '@mybricks/color-picker';

import css from './style.less';
function getFakeColor(color: string) {
  const arr = color?.match(/^var\((.*)\)$/);
  if (arr) {
    const name = arr[1];
    return getComputedStyle(document.body).getPropertyValue(name) || 'transparent';
  } else {
    return color;
  }
}

export default function (props: { color: string; onChangeComplete: (color: string) => void }) {
  const { color, onChangeComplete } = props;

  const onSketchChangeComplete = useCallback((data: { rgb: any; hex: string }) => {
    const { hex, rgb } = data;
    onChangeComplete(`rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`);
  }, []);

  const rawColor = getFakeColor(color || '#FFFFFF00');

  return (
    <Sketch
      color={rawColor}
      onChange={({ rgba, hex }) => {
        onSketchChangeComplete({ rgb: rgba, hex: hex });
      }}
      presetColors={false}
    />
  );
}
