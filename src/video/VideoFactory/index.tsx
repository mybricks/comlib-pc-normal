import React, { useEffect, useRef } from 'react';
import HlsVideo from './hlsControl';
import FlvVideo from './flvControl';
import Mp4Video from './mp4Control';

import { Data, VideoType } from '../types';
import styles from './index.less';
import empty from '../empty.svg';

const getVideoTypeBySrc = (src) => {
  const extname = src?.split('.').pop();
  if (extname?.includes('?')) {
    return extname.substring(0, extname.indexOf('?'))?.toLowerCase();
  }
  return extname?.toLowerCase();
};

const VideoFactory: React.FC<RuntimeParams<Data>> = (props) => {
  const { data, inputs, env } = props;
  const { src, dynamicSrc, style } = data;
  const videoRef = useRef<HTMLVideoElement>();

  const videoStrategy = {
    [VideoType.MP4]: () => <Mp4Video ref={videoRef} {...props} />,
    [VideoType.MOV]: () => <Mp4Video ref={videoRef} {...props} />,
    [VideoType.HLS]: () => <HlsVideo ref={videoRef} {...props} />,
    [VideoType.FLV]: () => <FlvVideo ref={videoRef} {...props} />
  };

  useEffect(() => {
    dynamicSrc &&
      inputs['link']((value: string) => {
        data.src = value;
      });
    inputs['screenshot'](screenshot);
  }, []);

  const screenshot = (filename?) => {
    const canvas = document.createElement('canvas');
    const { width, height } = videoRef.current.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/png');
    const downLink = document.createElement('a');
    downLink.href = dataUrl;
    downLink.download = filename || 'screenshot';
    downLink.click();
    return dataUrl;
  };

  const renderVideo = (src) => {
    const type = getVideoTypeBySrc(src);
    const noMatch = () => (
      <div style={style} className={styles.empty}>
        视频格式不支持
      </div>
    );
    const noSrc = () => (
      <div style={style} className={styles.empty}>
        <span>请输入视频链接</span>
      </div>
    );
    if (!src) {
      return noSrc;
    }
    return videoStrategy[type] || noMatch;
  };

  return (
    <div className={styles['video-wrap']} style={style}>
      {env.runtime ? renderVideo(src)() : <img src={empty} width={'35%'} height={'35%'} />}
    </div>
  );
};
export default VideoFactory;
