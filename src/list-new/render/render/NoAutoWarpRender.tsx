import React from 'react';
import { Data } from '../../constants';
import css from '../../style.less';
import { Spin } from 'antd';
import { NoAutoScrollRender, AutoRender  } from './render';

const NoAutoWarpRender  = (loading:boolean, data:Data, dataSource:any, slots, env) => {
  return loading ? (
    <Spin spinning={loading} tip={data.loadingTip} wrapperClassName={css.loading}>
      {!data.isAuto} ? {NoAutoScrollRender(dataSource, data, slots, env)} :{' '}
      {AutoRender(dataSource, data, slots, env)}
    </Spin>
  ) : !data.isAuto ? (
    NoAutoScrollRender(dataSource, data, slots, env)
  ) : (
    AutoRender(dataSource, data, slots, env)
  );
};

export { NoAutoWarpRender };