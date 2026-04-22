import React, { useEffect } from 'react';
import { ThumbsSwiper, DotsSwiper } from './render'
import { Data, InputIds } from './constants'

export default function ({ env, data, inputs, outputs }: RuntimeParams<Data>) {
  useEffect(() => {
    inputs[InputIds.SetDataSource]((value: any[], relOutputs) => {
      data.items = value;
      relOutputs['setDataSourceDone'](value);
    });
  }, []);

  
  if (data.mode) {
    return <ThumbsSwiper {...data} />
  }

  return <DotsSwiper {...data} />
}
