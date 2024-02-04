import React, { useRef, useState, useEffect } from 'react';

import { Spin } from 'antd';
import _debounce from 'lodash/debounce';

import { loadApp, loadInvalidApp } from '../../utils/qiankun-polyfill';

import styles from './index.less';

class AppManager {
  private microApps: { curApp: any; appMap: { [keyName: string]: any } } = {
    curApp: null as any as any,
    appMap: {}
  };

  private _switch = _debounce(async (nextApp) => {
    await this.unmountCurApp();
    if (!!this.microApps.appMap[nextApp]) {
      await this.microApps.appMap[nextApp].mount();
      // @ts-ignore
      this.nextApp = nextApp;
      this.microApps.curApp = this.microApps.appMap[nextApp];
      return Promise.resolve();
    } else if (!!!this.microApps.appMap[nextApp]) {
      // @ts-ignore
      this.nextApp = nextApp;
      this.microApps.curApp = loadApp(nextApp);
      return this.microApps.curApp?.mountPromise;
    }
    return Promise.resolve();
  }, 300);

  unmountCurApp = async () => {
    if (!this.microApps?.curApp) {
      return Promise.resolve();
    }

    if (this.microApps?.curApp.getStatus?.() !== 'MOUNTED') {
      return Promise.resolve();
    }

    return this.microApps.curApp?.unmount?.();
  };

  switchApp = async (nextApp) => {
    if (this.microApps?.curApp?.name === nextApp.name) {
      return Promise.resolve();
    }

    return this._switch(nextApp);
  };

  switchInvalidApp = async ({ container }) => {
    await appManager.unmountCurApp?.();
    this.microApps.curApp = loadInvalidApp?.({ container });
    return Promise.resolve();
  };

  get curApp() {
    const curApp = this.microApps.curApp;

    return (
      curApp && {
        ...curApp,
        // @ts-ignore
        name: this.nextApp?.name
      }
    );
  }
}

const appManager = new AppManager();

export function PageRender({ env, pageUrl }) {
  const eleRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pageUrl) {
      console.warn('[micro app] invalid app,url is required');
      appManager.switchInvalidApp({ container: eleRef.current });
    } else {
      setLoading(true);
      appManager
        .switchApp({ name: pageUrl, entry: pageUrl, container: eleRef.current })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          let time = setInterval(() => {
            if (
              appManager.curApp &&
              pageUrl === appManager.curApp.name &&
              appManager.curApp.getStatus?.() === 'MOUNTED'
            ) {
              clearInterval(time);
              // @ts-ignore
              time = null;
              setLoading(false);
            }
          }, 100);
        });
    }
  }, [pageUrl]);

  return (
    <div className={styles.pageRender}>
      <Spin spinning={loading} tip="加载中...">
        {env.edit ? (
          <div className={styles.tip}>这里是页面渲染区域</div>
        ) : (
          <div className={styles.rtMountNode} ref={eleRef} />
        )}
      </Spin>
    </div>
  );
}
