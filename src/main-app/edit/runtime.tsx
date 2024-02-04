import React, { useMemo } from 'react';

import { Menu } from 'antd';

import { getMenuConfig } from '../utils';

import css from '../runtime.less';
import cssEdit from './edit.less';

export default function ({ data, slots }) {
  console.log('runtime.edit');
  useMemo(() => {
    if (!data.middleArea.sider.homePage) {
      data.middleArea.sider.homePage = {
        show: false,
        title: '首页'
      };
    } else {
      data.middleArea.sider.homePage.show = false;
    }
  }, []);

  return (
    <div className={css.main}>
      <TopArea data={data} />
      <MiddleArea data={data} slots={slots} />
    </div>
  );
}

function TopArea({ data }) {
  return (
    <div className={css.topArea}>
      <div className={css.headerContainer}>
        <div className={css.header}>
          <div className={css.headerLeft}>
            <div className={css.logo}>
              <div data-logo-img="topAreaLogoImg">
                <img src={data.topArea.logo} />
              </div>
              <span data-logo-title="topAreaLogoTitle" className={css.title}>
                {data.topArea.title}
              </span>
            </div>
          </div>
          <div className={css.headerRight}>
            <div className={css.user}>
              <div className={css.userInfo}>
                <img
                  className={css.userHeader}
                  src={'https://my.mybricks.world/default_avatar.png'}
                />
                <span className={css.userName}>用户名</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiddleArea({ data, slots }) {
  return (
    <div className={css.container}>
      <div className={css.middleArea}>
        <SiderMenu data={data} />
        <Content data={data} slots={slots} />
      </div>
    </div>
  );
}

function Content({ data, slots }) {
  const { show } = data.middleArea.sider.homePage;

  return (
    <div className={css.content}>
      {show ? (
        <div className={css.contentSlot}>{slots['content'].render()}</div>
      ) : (
        <div className={cssEdit.tip}>页面渲染区域</div>
      )}
    </div>
  );
}

function SiderMenu({ data }) {
  const { items, openKeys, selectedItem } = getMenuConfig(data.middleArea.sider, {
    defaultOpen: true
  });

  return (
    <div className={css.sider} data-sider="middleAreaSider">
      <Menu mode="inline" selectedKeys={[selectedItem?.id]} openKeys={openKeys} items={items} />
    </div>
  );
}
