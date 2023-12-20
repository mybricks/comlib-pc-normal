import { useEffect, useState } from 'react';

/**
 * 获取父容器高度
 */
function useParentHeight(ref: React.RefObject<HTMLElement>) {
  /** 父容器高度px数字 */
  const [height, setHeight] = useState(0);
  /** 父容器高度，带单位 */
  const [heightAttr, setHeightAttr] = useState('0px');

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
        resizeObserver.unobserve(element.parentElement!);
      };
    }
  }, [ref]);

  /** 监听并获取父容器高度，带单位 */
  useEffect(() => {
    const element = ref.current;
    if (element && element.parentElement) {
      const updateHeight = () => {
        setHeightAttr(element.parentElement!.style.height);
      };

      const mutationObserver = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            updateHeight();
          }
        }
      });

      updateHeight();
      mutationObserver.observe(element.parentElement, { attributes: true });

      return () => {
        mutationObserver.disconnect();
      };
    }
  }, [ref]);

  return [height, heightAttr] as [number, string];
}

export default useParentHeight;
