import React, { useEffect } from 'react';
import { Data } from '../types';
import flv from 'flv.js';
import styles from './index.less';
import { message } from 'antd';
export default React.forwardRef<HTMLVideoElement, RuntimeParams<Data>>(({ data }, ref) => {
  const { src, controls, autoplay, poster, loop, fit, muted } = data;
  //测试地址 https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv
  useEffect(() => {
    let player;
    if (flv.isSupported()) {
      player = flv.createPlayer(
        {
          type: 'flv',
          url: src,
          isLive: true,
          hasAudio: true,
          hasVideo: true
        },
        {
          enableWorker: false
        }
      );
      player.attachMediaElement(ref.current);
      player.load();
      player.play();
      player.on(flv.Events.ERROR, (err) => {
        message.error(err);
      });
    }
    return () => {
      player.detachMediaElement();
      player.destroy();
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
      controls={controls}
      autoPlay={autoplay}
      poster={poster}
      src={src}
      ref={ref}
      loop={loop}
      preload="auto"
      crossOrigin="anonymous"
      muted={!!muted}
      onClick={handleClick}
      style={{ objectFit: fit }}
    />
  );
});
