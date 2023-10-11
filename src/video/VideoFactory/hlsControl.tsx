import React, { useEffect } from 'react';
import { Data } from '../types';
import Hls from 'hls.js';
import styles from './index.less';
export default React.forwardRef<HTMLVideoElement, RuntimeParams<Data>>(({ data }, ref) => {
  const { src, controls, poster, autoplay, loop, fit, muted } = data;
  useEffect(() => {
    //测试hls视频流 https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
    let hls;
    const { Events, ErrorTypes, isSupported } = Hls;
    if (isSupported()) {
      hls = new Hls();
      hls.attachMedia(ref.current);
      hls.on(Events.MEDIA_ATTACHED, () => {
        console.log('video and hls.js are now bound together !');
        hls.loadSource(src);
      });
      hls.on(Events.MANIFEST_PARSED, (event, data) => {
        console.log('manifest loaded, found ' + data.levels.length + ' quality level');
        autoplay && ref.current.play();
      });
      hls.on(Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case ErrorTypes.NETWORK_ERROR: // try to recover network error
              console.log('fatal network error encountered, try to recover');
              hls.startLoad();
              break;
            case ErrorTypes.MEDIA_ERROR:
              console.log('fatal media error encountered, try to recover');
              hls.recoverMediaError();
              break;
          }
        }
      });
    }

    return () => {
      hls?.destroy();
    };
  }, []);
  const handleClick = () => {
    //控制权交给controls
    if (controls) return;
    if (ref.current.paused) {
      ref.current?.play();
    } else {
      ref.current?.pause();
    }
  };
  return (
    <video
      className={styles.video}
      preload="auto"
      controls={controls}
      poster={poster}
      autoPlay={autoplay}
      loop={loop}
      onClick={handleClick}
      ref={ref}
      crossOrigin="anonymous"
      muted={!!muted}
      style={{ objectFit: fit }}
    />
  );
});
