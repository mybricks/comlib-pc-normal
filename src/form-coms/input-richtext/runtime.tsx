import React, { CSSProperties, useMemo, useEffect } from 'react';
import RichText from './richText';

/**
 * 数据源
 * @param content 富文本编辑器提供的内容
 */
export interface Data {
  style: CSSProperties;
  displayEditbar?: boolean;
  toolbar: string[];
  disabled: boolean;
  placeholder: string;
  value: any;
  rules: any[];
}

export default function ({ env, data, inputs, outputs, parentSlot, id }: RuntimeParams<Data>) {
  const EditContent = useMemo(() => {
    return (
      <div>
        <RichText
          readonly={false}
          data={data}
          outputs={outputs}
          inputs={inputs}
          env={env}
          parentSlot={parentSlot}
          id={id}
        />
      </div>
    );
  }, []);

  if (data.displayEditbar) {
    return EditContent;
  } else {
    data.toolbar = [];
    return <RichText readonly={false} data={data} outputs={outputs} inputs={inputs} env={env} />;
  }
}
