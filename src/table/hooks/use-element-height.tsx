import React, { useState, useEffect } from 'react';

function useElementHeight(ref: React.RefObject<HTMLElement>) {
  /** 元素高度px数字 */
  const [height, setHeight] = useState(0);

  /** 监听并获取元素高度px数字 */
  useEffect(() => {
    const element = ref.current;
    if (element) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (entry.target === element) {
            setHeight(entry.contentRect.height);
          }
        }
      });

      resizeObserver.observe(element);

      return () => {
        resizeObserver.unobserve(element!);
      };
    }
  }, [ref]);

  return [height] as [number];
}

export default useElementHeight;
