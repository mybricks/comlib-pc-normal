import { RefObject, useEffect } from "react";
import ResizeObserver from 'resize-observer-polyfill';

const useResizeObserver = (
  target: RefObject<HTMLElement>,
  callback: ResizeObserverCallback
) => {
  useEffect(() => {
    const dom = target.current?.parentElement;
    if (!dom) return;
    const resizeObserver = new ResizeObserver(callback);
    resizeObserver.observe(dom);
    return () => {
      resizeObserver.disconnect();
    };
  }, [target]);
};

export { useResizeObserver };
