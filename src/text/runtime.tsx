import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
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

export default ({ data, inputs, outputs, env }: RuntimeParams<Data>) => {
  const [dynamicStyle, setDynamicStyle] = useState<CSSProperties>({});
  useEffect(() => {
    inputs[InputIds.SetContent]((value: string, relOutputs) => {
      let res = value;
      if (res != undefined && typeof res !== 'string') {
        res = JSON.stringify(res);
      }
      data.content = res;
      if (relOutputs['setContentDone']) {
        relOutputs['setContentDone'](res);
      }
    });
    inputs[InputIds.SetStyle] &&
      inputs[InputIds.SetStyle]((value: CSSProperties) => {
        setDynamicStyle(value);
      });
  }, []);

  const onClick = () => {
    if (data.useClick && outputs[OutputIds.Click]) {
      outputs[OutputIds.Click](data.outputContent || data.content || '');
    }
  };

  const legacyConfigStyle = useMemo(() => {
    return data.legacyConfigStyle ?? {};
  }, [data.legacyConfigStyle]);

  return (
    <div style={{ lineHeight: 1 }}>
      {data.isEllipsis && data.ellipsis?.rows > 1 ? (
        <Paragraph
          style={{
            ...dynamicStyle,
            ...legacyConfigStyle,
            wordBreak: 'break-all',
            whiteSpace: WhiteSpaceEnum.PreWrap,
            cursor: data.useClick ? CursorTypeEnum.Pointer : void 0
          }}
          className={css.text}
          onClick={onClick}
          ellipsis={data.ellipsis || {}}
          data-item-type="root"
        >
          {env.i18n(data.content || '')}
        </Paragraph>
      ) : (
        <Text
          style={{
            ...dynamicStyle,
            ...data.legacyConfigStyle,
            wordBreak: 'break-all',
            whiteSpace: data.isEllipsis ? WhiteSpaceEnum.NoWrap : WhiteSpaceEnum.PreWrap,
            cursor: data.useClick ? CursorTypeEnum.Pointer : void 0
          }}
          className={css.text}
          onClick={onClick}
          ellipsis={data.ellipsis || {}}
          data-item-type="root"
        >
          {env.i18n(data.content || '')}
        </Text>
      )}
    </div>
  );
};
