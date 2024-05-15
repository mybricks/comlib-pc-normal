import React from 'react';
import { Data } from '../../constants';
import css from '../../style.less';
import { Spin } from 'antd';
import { NoAutoScrollRender, AutoRender } from './render';
import classnames from 'classnames';

const NoAutoWarpRender = (loading: boolean, data: Data, dataSource: any, slots, env) => {
  return loading ? (
    <Spin spinning={loading} tip={data.loadingTip} wrapperClassName={css.loading}>
      {!data.isAuto} ? {NoAutoScrollRender(dataSource, data, slots, env)} :{' '}
      <div className={classnames(css.container, 'list-new__root')} style={{ overflowX: 'auto' }}>
        {AutoRender(dataSource, data, slots, env)}
      </div>
    </Spin>
  ) : !data.isAuto ? (
    NoAutoScrollRender(dataSource, data, slots, env)
  ) : (
    <div className={classnames(css.container, 'list-new__root')} style={{ overflowX: 'auto' }}>
      {AutoRender(dataSource, data, slots, env)}
    </div>
  );
};

export { NoAutoWarpRender };
