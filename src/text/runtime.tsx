import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
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
        data.style.color = color || data.style.color;
        data.style.fontSize = fontSize || data.style.fontSize;
        data.style.fontWeight = fontWeight || data.style.fontWeight;
      });
  }, []);

  return (
    <div
      style={{
        textAlign: data.align || AlignTypeEnum.Left,
        lineHeight: 1
      }}
      onMouseOver={() => {
        if (data.useHoverStyle && data.hoverStyle) {
          setIsHover(true);
        }
      }}
      onMouseLeave={() => {
        if (data.useHoverStyle && data.hoverStyle) {
          setIsHover(false);
        }
      }}
    >
      {data.isEllipsis && data.ellipsis?.rows > 1 ? (
        <Paragraph
          style={{
            ...(isHover ? data.hoverStyle : data.style),
            whiteSpace: WhiteSpaceEnum.PreWrap,
            cursor: data.useClick ? CursorTypeEnum.Pointer : CursorTypeEnum.Default
          }}
          onClick={onClick}
          ellipsis={data.ellipsis || {}}
        >
          {data.content || ''}
        </Paragraph>
      ) : (
        <Text
          style={{
            ...(isHover ? data.hoverStyle : data.style),
            whiteSpace: data.isEllipsis ? WhiteSpaceEnum.NoWrap : WhiteSpaceEnum.PreWrap,
            cursor: data.useClick ? CursorTypeEnum.Pointer : CursorTypeEnum.Default
          }}
          onClick={onClick}
          ellipsis={data.ellipsis || {}}
        >
          {data.content || ''}
        </Text>
      )}
    </div>
  );
};
