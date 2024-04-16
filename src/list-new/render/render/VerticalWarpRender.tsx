import React from 'react';
import { Data } from '../../constants';
import css from '../../style.less';
import { Spin } from 'antd';
import { VerticalRender } from './render';

const VerticalWarpRender  = (loading:boolean, data:Data, dataSource:any, slots, env) => {
  return loading ? (
    <Spin spinning={loading} tip={data.loadingTip} wrapperClassName={css.loading}>
      {VerticalRender(dataSource, data, slots, env)}
    </Spin>
  ) : (
    VerticalRender(dataSource, data, slots, env)
  )
};

export { VerticalWarpRender };