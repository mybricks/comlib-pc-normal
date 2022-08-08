import React from 'react';
import classnames from 'classnames';
import { Data, OutputIds } from './constants';
import css from './runtime.less';

export default function ({ env, data, outputs }: RuntimeParams<Data>) {
  const onClick = () => {
    if (env.runtime) {
      outputs[OutputIds.Click]();
    }
  };

  return (
    <div
      className={classnames(
        css.button,
        data.asMapArea && env.edit && css.asMapArea
      )}
      style={!data.asMapArea ? { ...data.style } : null}
      onClick={onClick}
    >
      {!data.asMapArea ? env.i18n(data.text) : null}
    </div>
  );
}
