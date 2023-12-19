import React, { ReactNode, useCallback } from 'react';
import * as Icons from '@ant-design/icons';
import { Data, OutputIds } from './constants';
import css from './runtime.less';

/**
 * @param icon 图标
 */
export default function ({ env, data, outputs }: RuntimeParams<Data>) {
  const onClick = () => {
    if (env.runtime) {
      outputs[OutputIds.Click]();
    }
  };

  const btnItemR = useCallback(
    ({ icon }: { icon: any }) => {
      const Icon = Icons && Icons[icon as string]?.render();
      if (typeof Icon === 'undefined') {
        return <div dangerouslySetInnerHTML={{ __html: icon }} />;
      } else {
        return <>{Icon}</>;
      }
    },
    [data.icon]
  );

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
      data-item-type="icon"
    >
      {btnItemR({ icon: data.icon })}
    </div>
  );
}
