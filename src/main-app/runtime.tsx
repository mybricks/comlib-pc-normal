import React, { useMemo, useState, useEffect, useCallback, useLayoutEffect } from 'react';

import { Menu } from 'antd';

import { getMenuConfig } from './utils';
import { Dropdown, PageRender } from './components';
import { RouteManager } from './utils/qiankun-polyfill';

import css from './runtime.less';

/** 登录用户的信息（约定读取内容）*/
const USER_INFO_LOCAL_KEY = (window as any).__LOGIN_COOKIE_KEY__;

export default function ({ env, data, slots }) {
  console.log('runtime', env);
  const [context] = useState({
    siderMenuClick: () => {},
    userInfo: JSON.parse(localStorage.getItem(USER_INFO_LOCAL_KEY) || '{}')
  });

  return (
    <div className={css.main}>
      <TopArea env={env} data={data} context={context} />
      <MiddleArea env={env} data={data} slots={slots} context={context} />
    </div>
  );
}

function TopArea({ env, data, context }) {
  const logoClick = useCallback(() => {
    // @ts-ignore
    context.siderMenuClick({ key: null });
  }, []);

  const userInfo = useMemo(() => {
    const { production } = env;

    if (USER_INFO_LOCAL_KEY || !production) {
      const { avatar = 'https://my.mybricks.world/default_avatar.png', ['用户名']: name = '' } =
        context.userInfo;
      const userInfo = (
        <div className={css.userInfo}>
          <img className={css.userHeader} src={avatar} />
          <span className={css.userName}>{!production ? '用户名' : name}</span>
        </div>
      );

      return production ? (
        <Dropdown
          menus={[
            {
              key: '1',
              label: (
                <div
                  className={css.operateItem}
                  onClick={() => {
                    localStorage.clear();
                    location.reload();
                  }}
                >
                  <div className={css.label}>退出登录</div>
                </div>
              )
            }
          ]}
          overlayClassName={css.overlayClassName}
        >
          {userInfo}
        </Dropdown>
      ) : (
        userInfo
      );
    }

    return <></>;
  }, []);

  return (
    <div className={css.topArea}>
      <div className={css.headerContainer}>
        <div className={css.header}>
          <div className={css.headerLeft}>
            <div className={css.logo} onClick={logoClick}>
              <div>
                <img src={data.topArea.logo} />
              </div>
              <span className={css.title}>{data.topArea.title}</span>
            </div>
          </div>
          <div className={css.headerRight}>
            <div className={css.user}>{userInfo}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiddleArea({ env, data, slots, context }) {
  const {
    pageUrl,
    staticResources,
    menuSelectedKey,
    openKeys,
    setOpenKeys,
    triggerRouteChange,
    changeMenu
  } = env.production
    ? useMenuRouteProduction({
        defaultOpenKeys: data.middleArea.sider.menuOpenKeys,
        menuItems: data.middleArea.sider.menuItems
      })
    : useMenuRouteDebug({
        defaultOpenKeys: data.middleArea.sider.menuOpenKeys,
        menuItems: data.middleArea.sider.menuItems
      });

  useLayoutEffect(() => {
    /** 内容区组件调用 */
    slots['content']._inputs['pushRouter']((key) => {
      siderMenuClick({ key });
    });
  }, []);

  useEffect(() => {
    context.siderMenuClick = siderMenuClick;

    const sider = data.middleArea.sider;

    const pageUrlMap = {};
    const menuIdMap = {};
    const { items, selectedItem } = getMenuConfig(sider, {
      defaultOpen: false,
      cb: (menuItem) => {
        const { id, key, menuType, children, pageUrl } = menuItem;
        menuIdMap[id] = key;
        menuIdMap[key] = id;
        if (menuType === 'menu') {
          let hidden = false;
          // 子菜单
          menuItem.hidden = hidden;
          if (!hidden) {
            // 不隐藏的设置urlmap
            pageUrlMap[key] = pageUrl;
          }
        } else {
          let hidden = false;
          if (!!!children.find((child) => !child.hidden)) {
            hidden = true;
          }
          menuItem.hidden = hidden;
        }
      }
    });
    const selectedKey = selectedItem?.id;

    staticResources.pageUrlMap = pageUrlMap;
    staticResources.menuIdMap = menuIdMap;
    staticResources.finalMenuItems = items;
    staticResources.homeKey = selectedKey;

    triggerRouteChange();
  }, []);

  const siderMenuClick = useCallback(({ key }) => {
    changeMenu(key);
  }, []);

  const SiderMenu = useMemo(() => {
    return (
      <div className={css.sider}>
        <Menu
          mode="inline"
          selectedKeys={[menuSelectedKey]}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          onClick={siderMenuClick}
          items={staticResources.finalMenuItems}
        />
      </div>
    );
  }, [menuSelectedKey, openKeys]);

  const Content = useMemo(() => {
    let jsx = <></>;

    const typePageUrl = typeof pageUrl;

    switch (typePageUrl) {
      case 'undefined':
        jsx = <div className={css.contentSlot}>{slots['content'].render()}</div>;
        break;
      case 'string':
      case 'object':
        jsx = <PageRender env={env} pageUrl={pageUrl} />;
        break;
      default:
        break;
    }

    return <div className={css.content}>{jsx}</div>;
  }, [pageUrl]);

  return (
    <div className={css.container}>
      <div className={css.middleArea}>
        {SiderMenu}
        {Content}
      </div>
    </div>
  );
}

function useMenuRouteDebug({ defaultOpenKeys, menuItems }) {
  const [pageUrl, setPageUrl] = useState<any>(false);
  const [staticResources] = useState<any>({
    menuSelectedKey: null,
    pageUrlMap: { '/': undefined },
    menuIdMap: {},
    finalMenuItems: [],
    routeManager: new RouteManager(),
    homeKey: '/'
  });
  const [menuSelectedKey, setMenuSelectedKey] = useState<any>(null);
  const [openKeys, setOpenKeys] = useState(defaultOpenKeys);
  const triggerRouteChange = useCallback(() => {
    const { homeKey, menuIdMap, pageUrlMap, menuSelectedKey } = staticResources;
    let finalSelectedKey = menuSelectedKey;
    let pageUrl;

    if (!finalSelectedKey) {
      pageUrl = pageUrlMap[menuIdMap[homeKey]];
      finalSelectedKey = homeKey;
      staticResources.menuSelectedKey = finalSelectedKey;
      setMenuSelectedKey(finalSelectedKey);
    } else {
      pageUrl = pageUrlMap[menuIdMap[finalSelectedKey]];
    }

    setOpenKeys((openKeys) => {
      return Array.from(
        new Set([...openKeys, ...findDefaultOpenMenuKeys(menuItems, finalSelectedKey)])
      );
    });
    setPageUrl(pageUrl);
  }, []);
  const changeMenu = useCallback((key) => {
    if (!key) {
      key = staticResources.homeKey;
    }

    setMenuSelectedKey(key);
    staticResources.menuSelectedKey = key;
    triggerRouteChange();
  }, []);

  useEffect(() => {
    const _pushState = history.pushState;
    history.pushState = (...args) => {
      const key = staticResources.menuIdMap[args[2] as string];
      setMenuSelectedKey(key);
      staticResources.menuSelectedKey = key;
      triggerRouteChange();
    };
    return () => {
      history.pushState = _pushState;
    };
  }, []);

  return {
    pageUrl,
    staticResources,
    menuSelectedKey,
    setMenuSelectedKey,
    openKeys,
    setOpenKeys,
    triggerRouteChange,
    changeMenu
  };
}

function useMenuRouteProduction({ defaultOpenKeys, menuItems }) {
  const [pageUrl, setPageUrl] = useState<any>(false);
  const [staticResources] = useState<any>({
    menuSelectedKey: null,
    pageUrlMap: { '/': undefined },
    menuIdMap: {},
    finalMenuItems: [],
    routeManager: new RouteManager(),
    homeKey: '/'
  });
  const [menuSelectedKey, setMenuSelectedKey] = useState<any>(null);
  const [openKeys, setOpenKeys] = useState(defaultOpenKeys);
  const triggerRouteChange = useCallback(() => {
    const { homeKey, menuIdMap, pageUrlMap } = staticResources;
    /** key 唯一标识 */
    const currentRoute = staticResources.routeManager.getCurrentRoute();

    let menuSelectedKey;
    let pageUrl;
    let key;

    if (currentRoute) {
      menuSelectedKey = menuIdMap[currentRoute];
      pageUrl = pageUrlMap[currentRoute];
      if (!pageUrl) {
        /** 找不到pageUrl，跳首页 */
        key = menuIdMap[homeKey];
        menuSelectedKey = homeKey;
        pageUrl = pageUrlMap[key];
      }
    } else {
      menuSelectedKey = homeKey;
      key = menuIdMap[homeKey];
      pageUrl = pageUrlMap[key];
    }

    setOpenKeys((openKeys) => {
      return Array.from(
        new Set([...openKeys, ...findDefaultOpenMenuKeys(menuItems, menuSelectedKey)])
      );
    });
    setPageUrl(pageUrl);
    setMenuSelectedKey(menuSelectedKey);
    staticResources.routeManager.replaceState(key);
  }, []);
  const changeMenu = useCallback((key) => {
    if (!key) {
      key = staticResources.homeKey;
    }

    const toKey = staticResources.menuIdMap[key];
    staticResources.routeManager.goto(toKey);
  }, []);

  useMemo(() => {
    const _pushState = history.pushState;
    history.pushState = (...args) => {
      args[2] = `${staticResources.routeManager.getRootPath()}/${args[2]}`;
      return _pushState.call(history, ...args);
    };
    window.addEventListener('popstate', () => {
      triggerRouteChange();
    });
  }, []);

  return {
    pageUrl,
    staticResources,
    menuSelectedKey,
    setMenuSelectedKey,
    openKeys,
    setOpenKeys,
    triggerRouteChange,
    changeMenu
  };
}

/**
 * 根据选中的menuid获取该id所有父级submenuid
 */
function findDefaultOpenMenuKeys(menuItems, selectKey, parents: any[] = []) {
  for (const menuItem of menuItems) {
    const currentParens = parents;

    if (menuItem.id === selectKey) {
      return currentParens;
    }

    if (menuItem.children) {
      const result = findDefaultOpenMenuKeys(
        menuItem.children,
        selectKey,
        currentParens.concat(menuItem.id)
      );

      if (result.length) {
        return result;
      }
    }
  }

  return [];
}
