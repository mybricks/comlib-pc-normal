import React, { useCallback } from 'react';
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

export default function (props: { color: string; onChangeComplete: (color: string) => void; positionRef: { current: { left: number, top: number}} }) {
  const { color, onChangeComplete, positionRef } = props;

  const onSketchChangeComplete = useCallback((data: { rgb: any; hex: string }) => {
    const { hex, rgb } = data;
    onChangeComplete(`rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`);
  }, []);

  const rawColor = getFakeColor(color || '#FFFFFF00');
  return ReactDOM.createPortal(<div className={css.colorPicker} id="color-inner" style={{
    position: 'absolute', top: '0px', left: '0px', width: '100%', zIndex: 10001
  }}>
    <div style={{  position: 'absolute', left: positionRef.current.left, top: (positionRef.current.top || 0) + 40,}}>
      <Sketch
        color={rawColor}
        onChange={({ rgba, hex }) => {
          onSketchChangeComplete({ rgb: rgba, hex: hex });
        }}
        style={{ zIndex: 11000}}
        presetColors={false}
      />
      </div>
    </div>,  document.body)
    
  // return (
  //   <div className={css.colorPicker}>
  //     <Sketch
  //       color={rawColor}
  //       onChange={({ rgba, hex }) => {
  //         onSketchChangeComplete({ rgb: rgba, hex: hex });
  //       }}
  //       presetColors={false}
  //     />
  //   </div>
  // );
}
