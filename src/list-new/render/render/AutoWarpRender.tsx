import React from 'react';
import { Data } from '../../constants';
import css from '../../style.less';
import { Spin } from 'antd';
import { AutoRender } from './render';

const AutoWarpRender  = (loading:boolean, data:Data, dataSource:any, slots) => {
  return loading ? (
    <Spin spinning={loading} tip={data.loadingTip} wrapperClassName={css.loading}>
      {AutoRender(dataSource, data, slots)}
    </Spin>
  ) : (
    AutoRender(dataSource, data, slots)
  )
};

export { AutoWarpRender };