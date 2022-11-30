import React from 'react';
import { Data } from '../types';
import styles from './index.less';
export default React.forwardRef<HTMLVideoElement, RuntimeParams<Data>>(({ data }, ref) => {
  const { src, controls, autoplay, poster, loop } = data;
  const handleClick = () => {
    if (controls) return;
    if (ref.current.paused) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  };

  return (
    <video
      className={styles.video}
      controls={controls}
      autoPlay={autoplay}
      poster={poster}
      src={src}
      ref={ref}
      loop={loop}
      preload="auto"
      crossOrigin="anonymous"
      onClick={handleClick}
    />
  );
});
