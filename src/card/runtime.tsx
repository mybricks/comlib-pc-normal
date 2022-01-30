import React, { useEffect } from 'react';
import { Card } from 'antd';
import { Data } from './constants';

const RuntimeRender = (props: RuntimeParams<Data>) => {
  const { data, slots, inputs, env } = props;
  const { title, useExtra, bordered, size, style, bodyStyle, hoverable } = data;

  useEffect(() => {
    if (env.runtime && inputs['title']) {
      inputs['title']((val: string) => {
        data.title = val;
      });
    }
  }, []);

  return (
    <Card
      title={title}
      size={size}
      bodyStyle={bodyStyle}
      bordered={bordered}
      style={style}
      extra={useExtra && slots['extra'] ? slots['extra'].render() : undefined}
      hoverable={hoverable}
    >
      {slots['body'] && slots['body'].render()}
    </Card>
  );
};

export default function (props: RuntimeParams<Data>) {
  return <RuntimeRender {...props} />;
}
