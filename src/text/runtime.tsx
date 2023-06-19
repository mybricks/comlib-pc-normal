import React, { useEffect, useState } from 'react';
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
  const [isHover, setIsHover] = useState(false);
  const [dynamicStyle, setDynamicStyle] = useState({});

  const onClick = () => {
    if (data.useClick && outputs[OutputIds.Click]) {
      outputs[OutputIds.Click](data.outputContent || data.content || '');
    }
  };

  useEffect(() => {
    inputs[InputIds.SetContent]((value: string) => {
      let res = value;
      if (res != undefined && typeof res !== 'string') {
        res = JSON.stringify(res);
      }
      data.content = res;
    });
    inputs[InputIds.SetStyle] &&
      inputs[InputIds.SetStyle]((value: any) => {
        const { color, fontSize, fontWeight } = value || {};
        setDynamicStyle({ color: color, fontSize: fontSize, fontWeight: fontWeight });
      });
  }, []);

  return (
    <div
      style={{
        // textAlign: data.align || AlignTypeEnum.Left,
        lineHeight: 1
      }}
      onMouseOver={() => {
        if (data.useHoverStyle) {
          setIsHover(true);
        }
      }}
      onMouseLeave={() => {
        if (data.useHoverStyle) {
          setIsHover(false);
        }
      }}
    >
      {data.isEllipsis && data.ellipsis?.rows > 1 ? (
        <Paragraph
          style={{
            ...(inputs[InputIds.SetStyle] && !isHover ? dynamicStyle : void 0),
            wordBreak: 'break-all',
            whiteSpace: WhiteSpaceEnum.PreWrap,
            cursor: data.useClick ? CursorTypeEnum.Pointer : CursorTypeEnum.Default
          }}
          className={`${css.text} text ${data.useHoverStyle ? 'textHover' : void 0} ${
            data.useHoverStyle ? css.textHover : void 0
          }`}
          onClick={onClick}
          ellipsis={data.ellipsis || {}}
        >
          {data.content || ''}
        </Paragraph>
      ) : (
        <Text
          style={{
            ...(inputs[InputIds.SetStyle] && !isHover ? dynamicStyle : void 0),
            wordBreak: 'break-all',
            whiteSpace: data.isEllipsis ? WhiteSpaceEnum.NoWrap : WhiteSpaceEnum.PreWrap,
            cursor: data.useClick ? CursorTypeEnum.Pointer : CursorTypeEnum.Default
          }}
          className={`${css.text} text ${data.useHoverStyle ? css.textHover : void 0} ${
            data.useHoverStyle ? 'textHover' : void 0
          }`}
          onClick={onClick}
          ellipsis={data.ellipsis || {}}
        >
          {data.content || ''}
        </Text>
      )}
    </div>
  );
};
