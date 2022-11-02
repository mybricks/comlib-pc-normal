import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import { Data, OutputIds } from './constants';
import css from './runtime.less';

export default function ({ env, data, outputs, inputs }: RuntimeParams<Data>) {
  //如果data.dataType是'external'的
  useEffect(() => {
    if (env.runtime) {
      inputs['external']((ds: any) => {
        data.inVal = ds;
      });
    }
  });
  const onClick = useCallback(() => {
    if (env.runtime) {
      const outputVal: string | number = data.dataType === 'external' ? data.inVal : data.outVal;
      outputs[OutputIds.Click](outputVal);
    }
  }, []);

  const onDoubleClick = useCallback(() => {
    if (env.runtime) {
      const outputVal: string | number = data.dataType === 'external' ? data.inVal : data.outVal;
      outputs[OutputIds.DbClick](outputVal);
    }
  }, []);

  return (
    <div
      className={classnames(css.button, data.asMapArea && env.edit && css.asMapArea)}
      style={!data.asMapArea ? { ...data.style } : null}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {!data.asMapArea ? env.i18n(data.text) : null}
    </div>
  );
}
