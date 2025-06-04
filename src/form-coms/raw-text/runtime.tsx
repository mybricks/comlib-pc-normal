import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import css from './runtime.less';

export interface Data {
  content: string | undefined;
  expandRows: number;
}

export default function ({
  env,
  data,
}: RuntimeParams<Data>) {
  const textRef = useRef<HTMLDivElement | null>(null);
  const [withHiddenStyle, setWithHiddenStyle] = useState(false);
  const [toggleHiddenStyle, setToggleHiddenStyle] = useState(false);
  useEffect(() => {
    if (!!data.content && textRef.current && textRef.current?.getBoundingClientRect().height > data.expandRows * 22) {
      setWithHiddenStyle(true);
      setToggleHiddenStyle(true);
    }
  }, [data.content, data.expandRows]);
  return (
    <div className={css.textOverflowWrapper}>
      <div
        className={css.textOverflow + ' raw-text-content'}
        style={{
          WebkitLineClamp: !toggleHiddenStyle ? 999 : data.expandRows,
        }}
        ref={textRef}
      >
        {withHiddenStyle && (
          <Button
            className={css.toggleHiddenBtn}
            onClick={() => {
              setToggleHiddenStyle((v) => !v);
            }}
            type="link"
          >
            {toggleHiddenStyle ? env.i18n('展开') : env.i18n('收起')}
          </Button>
        )}
        {data.content}
      </div>
    </div>
  );
}
