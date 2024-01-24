import React, { useMemo } from 'react';
import RichText from './richText';
import { Data } from './types';

/**
 * 数据源
 * @param content 富文本编辑器提供的内容
 */

export default function (props: RuntimeParams<Data>) {
  const { data, env } = props;
  const isRuntime = !env?.runtime;
  const EditContent = useMemo(() => {
    return (
      <div>
        <RichText readonly={isRuntime} {...props} />
      </div>
    );
  }, []);

  if (data.displayEditbar) {
    return EditContent;
  }
  data.toolbar = [];
  return <RichText readonly={isRuntime} {...props} />;
}
