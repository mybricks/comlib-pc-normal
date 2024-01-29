import { useEffect, useState } from 'react';

/**
 * 获取父容器高度
 */
function useParentHeight(ref: React.RefObject<HTMLElement>) {
  /** 父容器高度px数字 */
  const [height, setHeight] = useState(0);

  /** 监听并获取父容器高度px数字 */
  useEffect(() => {
    const element = ref.current;
    if (element && element.parentElement) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (entry.target === element.parentElement) {
            setHeight(entry.contentRect.height);
          }
        }
      });

      resizeObserver.observe(element.parentElement);

      return () => {
        if (element.parentElement) {
          resizeObserver.unobserve(element.parentElement!);
        }
      };
    }
  }, [ref]);

  return [height] as [number];
}

export default useParentHeight;
