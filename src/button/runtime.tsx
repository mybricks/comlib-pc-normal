import React, { useCallback, useRef } from 'react';
import classnames from 'classnames';
import { Data, OutputIds } from './constants';
import css from './runtime.less';

export default function ({ env, data, outputs }: RuntimeParams<Data>) {
  const timerRef = useRef<any>();

  const handleClick = useCallback(({ detail }) => {
    if (env.runtime) {
      clearTimeout(timerRef.current);
      if (detail === 1) {
        timerRef.current = setTimeout(() => {
          outputs[OutputIds.Click]();
        }, 200);
      } else if (detail === 2) {
        outputs[OutputIds.DbClick]();
      }
    }
  }, []);

  return (
    <div
      className={classnames(css.button, data.asMapArea && env.edit && css.asMapArea)}
      style={!data.asMapArea ? { ...data.style } : null}
      onClick={handleClick}
    >
      {!data.asMapArea ? env.i18n(data.text) : null}
    </div>
  );
}
