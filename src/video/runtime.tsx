import React from 'react';
import { Data } from './types';
import VideoFactory from './VideoFactory';
export default (props: RuntimeParams<Data>) => {
  return <VideoFactory {...props} />;
};
