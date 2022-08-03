import React, { useEffect } from 'react';
import { Typography } from 'antd';
import { Data } from './constants';

const { Text, Paragraph } = Typography;

export default function ({ data, inputs, outputs, env }: RuntimeParams<Data>) {
  const { style } = data;

  const onClick = () => {
    if (data.click) {
      outputs['click'](data.outputContent || data.content || '');
    }
  };

  useEffect(() => {
    inputs['content']((value: string) => {
      if (value != undefined && typeof value !== 'string') value = JSON.stringify(value);
      data.content = value;
    });
  }, []);

  return (
    <div
      style={{
        height: 'fit-content',
        maxWidth: '100%',
        textAlign: data.align || 'left'
      }}
    >
      {data.isEllipsis ? (
        <Paragraph
          style={{
            ...style,
            whiteSpace: 'pre-wrap',
            cursor: data.click ? 'pointer' : 'default'
          }}
          type={data.textType}
          onClick={onClick}
          ellipsis={data.ellipsis || {}}
        >
          {env.i18n(data.content) || ''}
        </Paragraph>
      ) : (
        <Text
          style={{
            ...style,
            whiteSpace: 'pre-wrap',
            cursor: data.click ? 'pointer' : 'default'
          }}
          type={data.textType}
          onClick={onClick}
        >
          {env.i18n(data.content) || ''}
        </Text>
      )}
    </div>
  );
}
