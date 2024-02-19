import React, { Fragment, useEffect, useState } from 'react';
import { Spin } from 'antd';
import { SpinSize } from 'antd/es/spin';

export interface Data {
  tip?: string;
  size?: SpinSize;
}

export default function ({ env, data, inputs, slots }: RuntimeParams<Data>) {
  const { runtime } = env;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (runtime) {
      inputs['openLoading']((val, outputRels) => {
        setLoading(true);
        outputRels['openLoadingDone'](val);
      });

      inputs['closeLoading']((val, outputRels) => {
        setLoading(false);
        outputRels['closeLoadingDone'](val);
      });
    }
  }, []);

  return (
    <Fragment>
      <Spin spinning={loading} size={data.size} tip={env.i18n(data.tip)}>
        {slots && slots['content'].render()}
      </Spin>
    </Fragment>
  );
}
