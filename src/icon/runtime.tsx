import React, { ReactNode } from 'react';
import * as Icons from '@ant-design/icons';
import { Data, OutputIds } from './constants';
import css from './runtime.less';

/**
 * @param icon 图标
 */

const btnItemR = ({ icon }: { icon: ReactNode }) => {
  const Icon = Icons && Icons[icon as string]?.render();
  return <>{Icon}</>;
};

export default function ({ env, data, outputs }: RuntimeParams<Data>) {
  const onClick = () => {
    if (env.runtime) {
      outputs[OutputIds.Click]();
    }
  };

  return (
    <div
      className={css.icon}
      style={{
        fontSize: data.size,
        color: data.color,
        cursor:
          outputs[OutputIds.Click] && outputs[OutputIds.Click]?.getConnections()?.length > 0
            ? 'pointer'
            : undefined
      }}
      onClick={onClick}
    >
      {btnItemR({ icon: data.icon })}
    </div>
  );
}
