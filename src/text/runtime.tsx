import React, { useEffect, useMemo } from 'react';
import { Typography } from 'antd';
import css from './runtime.less';

import {
  AlignTypeEnum,
  CursorTypeEnum,
  Data,
  InputIds,
  OutputIds,
  WhiteSpaceEnum
} from './constants';

const { Text, Paragraph } = Typography;

export default ({ data, inputs, outputs }: RuntimeParams<Data>) => {
  useEffect(() => {
    inputs[InputIds.SetContent]((value: string) => {
      let res = value;
      if (res != undefined && typeof res !== 'string') {
        res = JSON.stringify(res);
      }
      data.content = res;
    });
    inputs[InputIds.SetStyle] &&
      inputs[InputIds.SetStyle]((value: React.CSSProperties) => {
        data.style = value;
      });
  }, []);

  const dynamicStyle = useMemo(() => ({ ...(data.style || {}) }), [data.style]);

  const onClick = () => {
    if (data.useClick && outputs[OutputIds.Click]) {
      outputs[OutputIds.Click](data.outputContent || data.content || '');
    }
  };

  return (
    <div style={{ lineHeight: 1 }}>
      {data.isEllipsis && data.ellipsis?.rows > 1 ? (
        <Paragraph
          style={{
            ...dynamicStyle,
            wordBreak: 'break-all',
            whiteSpace: WhiteSpaceEnum.PreWrap,
            cursor: data.useClick ? CursorTypeEnum.Pointer : CursorTypeEnum.Default
          }}
          className={css.text}
          onClick={onClick}
          ellipsis={data.ellipsis || {}}
          data-item-type="root"
        >
          {data.content || ''}
        </Paragraph>
      ) : (
        <Text
          style={{
            ...dynamicStyle,
            wordBreak: 'break-all',
            whiteSpace: data.isEllipsis ? WhiteSpaceEnum.NoWrap : WhiteSpaceEnum.PreWrap,
            cursor: data.useClick ? CursorTypeEnum.Pointer : CursorTypeEnum.Default
          }}
          className={css.text}
          onClick={onClick}
          ellipsis={data.ellipsis || {}}
          data-item-type="root"
        >
          {data.content || ''}
        </Text>
      )}
    </div>
  );
};
