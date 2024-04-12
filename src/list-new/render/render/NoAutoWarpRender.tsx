import React from 'react';
import { Data } from '../../constants';
import css from '../../style.less';
import { Spin } from 'antd';
import { NoAutoScrollRender, AutoRender  } from './render';

const NoAutoWarpRender  = (loading:boolean, data:Data, dataSource:any, slots) => {
  return loading ? (
    <Spin spinning={loading} tip={data.loadingTip} wrapperClassName={css.loading}>
      {!data.isAuto} ? {NoAutoScrollRender(dataSource, data, slots)} :{' '}
      {AutoRender(dataSource, data, slots)}
    </Spin>
  ) : !data.isAuto ? (
    NoAutoScrollRender(dataSource, data, slots)
  ) : (
    AutoRender(dataSource, data, slots)
  );
};

export { NoAutoWarpRender };