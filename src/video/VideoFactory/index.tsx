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

const Wrap = ({ children }) => {
  return <div className={styles.empty}>{children}</div>;
};

const VideoFactory: React.FC<RuntimeParams<Data>> = (props) => {
  const { data, inputs, env } = props;
  const { src } = data;
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoStrategy = {
    [VideoType.MP4]: () => <Mp4Video ref={videoRef} {...props} />,
    [VideoType.MOV]: () => <Mp4Video ref={videoRef} {...props} />,
    [VideoType.HLS]: () => <HlsVideo ref={videoRef} {...props} />,
    [VideoType.FLV]: () => <FlvVideo ref={videoRef} {...props} />
  };

  useEffect(() => {
    inputs?.link &&
      inputs.link((value: string, relOutputs) => {
        data.src = value;
        relOutputs['setLinkComplete']()
      });
    inputs?.screenshot && inputs.screenshot(screenshot);
    inputs.setPoster!((value: string, relOutputs) => {
      data.poster = value;
      relOutputs['setPosterComplete']();
    });
  }, []);

  const screenshot = (filename?: string, relOutputs?: any) => {
    const canvas = document.createElement('canvas');
    if (!videoRef.current) return;
    const { width, height } = videoRef.current?.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/png');
    const downLink = document.createElement('a');
    downLink.href = dataUrl;
    downLink.download = filename || 'screenshot';
    downLink.click();
    relOutputs['screenshotComplete']()
    return dataUrl;
  };

  const renderVideo = (src) => {
    const type = getVideoTypeBySrc(src);
    const noMatch = () => (
      <Wrap>
        <span>视频格式不支持</span>
      </Wrap>
    );
    const noSrc = () => (
      <Wrap>
        <span>请输入视频链接</span>
      </Wrap>
    );
    const edit = () => (
      <Wrap>
        <img src={empty} width={'35%'} height={'35%'} />
      </Wrap>
    );
    if (env.edit) {
      return edit;
    }
    if (!src) {
      return noSrc;
    }
    return videoStrategy[type] || noMatch;
  };

  return (
    <div data-root="root" className={styles['video-wrap']}>
      {renderVideo(src)()}
    </div>
  );
};
export default VideoFactory;
