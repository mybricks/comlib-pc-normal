import React from 'react';
import { Data } from '../../constants';
import css from '../../style.less';
import { Spin } from 'antd';
import { NoAutoScrollRender, NoAutoRender  } from './render';

const NoAutoWarpRender  = (loading:boolean, data:Data, dataSource:any, slots) => {
  return loading ? (
    <Spin spinning={loading} tip={data.loadingTip} wrapperClassName={css.loading}>
      {data.isScroll} ? {NoAutoScrollRender(dataSource, data, slots)} :{' '}
      {NoAutoRender(dataSource, data, slots)}
    </Spin>
  ) : data.isScroll ? (
    NoAutoScrollRender(dataSource, data, slots)
  ) : (
    NoAutoRender(dataSource, data, slots)
  );
};

export { NoAutoWarpRender };