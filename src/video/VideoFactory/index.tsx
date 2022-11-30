import React, { useEffect, useMemo, useRef } from 'react';
import HlsVideo from './hlsControl';
import FlvVideo from './flvControl';
import Mp4Video from './mp4Control';

import { Data, VideoType } from '../types';
import styles from './index.less';
import empty from '../empty.svg';

const VideoFactory: React.FC<RuntimeParams<Data>> = (props) => {
  const { data, inputs, env } = props;
  const { src, style } = data;
  const videoRef = useRef<HTMLVideoElement>();

  const videoType = useMemo(() => {
    const extname = src?.split('.').pop();
    if (extname?.includes('?')) {
      return extname.substring(0, extname.indexOf('?'))?.toLowerCase();
    }
    return extname?.toLowerCase();
  }, [src]);

  useEffect(() => {
    inputs['link']((value: string) => {
      data.src = value;
    });
    inputs['screenshot'](screenshot);
  }, []);

  const screenshot = () => {
    const canvas = document.createElement('canvas');
    const { width, height } = videoRef.current.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/png');
    const downLink = document.createElement('a');
    downLink.href = dataUrl;
    downLink.download = 'screenshot';
    downLink.click();
    return dataUrl;
  };

  const renderVideo = (type) => {
    const videoStrategy = {
      [VideoType.MP4]: () => <Mp4Video ref={videoRef} {...props} />,
      [VideoType.MOV]: () => <Mp4Video ref={videoRef} {...props} />,
      [VideoType.HLS]: () => <HlsVideo ref={videoRef} {...props} />,
      [VideoType.FLV]: () => <FlvVideo ref={videoRef} {...props} />
    };
    const noMatch = () => (
      <div style={style} className={styles.empty}>
        视频格式不支持
      </div>
    );
    return videoStrategy[type] || noMatch;
  };

  return src ? (
    <div className={styles['video-wrap']} style={style}>
      {env.runtime ? renderVideo(videoType)() : <img src={empty} />}
    </div>
  ) : (
    <div style={style} className={styles.empty}>
      <span>请输入视频链接</span>
    </div>
  );
};
export default VideoFactory;
