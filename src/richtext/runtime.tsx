import React, { CSSProperties, useMemo } from 'react';
import RichText from './richText';
/**
 * 数据源
 * @param content 富文本编辑器提供的内容
 */
export interface Data {
  style: CSSProperties;
  displayEditbar?: boolean;
  toolbar: string[];
}

export default function ({ env, data, inputs, outputs }: RuntimeParams<Data>) {
  const EditContent = useMemo(() => {
    return <RichText readonly={false} data={data} outputs={outputs} inputs={inputs} env={env} />;
  }, []);

  if (data.displayEditbar) {
    return EditContent;
  }

  data.toolbar = [];

  return <RichText readonly={false} data={data} outputs={outputs} inputs={inputs} env={env} />;
}
