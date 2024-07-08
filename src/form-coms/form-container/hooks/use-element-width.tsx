import React, { useState, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

function useElementWidth(ref: React.RefObject<HTMLElement>) {
  /** 元素宽度px数字 */
  const [width, setWidth] = useState(0);

  /** 监听并获取元素高度px数字 */
  useEffect(() => {
    const element = ref.current;
    if (element) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (entry.target === element) {
            setWidth(entry.contentRect.width);
          }
        }
      });

      resizeObserver.observe(element);

      return () => {
        resizeObserver.unobserve(element!);
      };
    }
  }, [ref]);

  return [width] as [number];
}

export default useElementWidth;
