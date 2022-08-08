import { message } from 'antd';

// pushState/replaceState 参数解析
const getHistoryParams = (val) => {
  switch (typeof val) {
    case 'string':
      return {
        state: {},
        title: '',
        url: val
      };
    case 'object':
      const { state = {}, title = '', url } = val;
      return {
        state,
        title,
        url
      };
    default:
      return {};
  }
};

const DebugActions = {
  push: (val) => {
    const { state, title, url } = getHistoryParams(val);
    message.info(`pushState：${JSON.stringify({ state, title, url })}`);
    if (!url) {
      message.info(`路由地址不能为空`);
    }
    console.log(`pushState`, { state, title, url });
  },
  replace: (val) => {
    const { state, title, url } = getHistoryParams(val);
    message.info(`replaceState：${JSON.stringify({ state, title, url })}`);
    if (!url) {
      message.info(`路由地址不能为空`);
    }
    console.log(`replaceState`, { state, title, url });
  },
  back: () => {
    message.info(`back`);
    console.log(`back`);
  },
  forward: () => {
    message.info(`forward`);
    console.log(`forward`);
  },
  redirect: (val) => {
    message.info(`redirect: ${val}`);
    if (typeof val !== 'string') {
      message.info(`路由地址不合法`);
    }
    console.log(`redirect`, val);
  },
  openWindow: (val) => {
    message.info(`openWindow: ${val}`);
    if (typeof val !== 'string') {
      message.info(`路由地址不合法`);
    }
    console.log(`openWindow`, val);
  },
  openTab: (val) => {
    message.info(`openTab: ${val}`);
    if (typeof val !== 'string') {
      message.info(`路由地址不合法`);
    }
    console.log(`openTab`, val);
  }
};

const RuntimeActions = {
  push: (val) => {
    const { state, title, url } = getHistoryParams(val);
    if (url) {
      history.pushState(state, title, url);
    } else {
      console.warn(`路由地址不能为空`, val);
    }
  },
  replace: (val) => {
    const { state, title, url } = getHistoryParams(val);
    if (url) {
      history.replaceState(state, title, url);
    } else {
      console.warn(`路由地址不能为空`, val);
    }
  },
  back: () => {
    history.back();
  },
  forward: () => {
    history.forward();
  },
  redirect: (val) => {
    if (typeof val === 'string') {
      window.location.replace(val);
    } else {
      console.warn(`路由地址不合法`, val);
    }
  },
  openWindow: (val) => {
    if (typeof val === 'string') {
      window.open(val);
    } else {
      console.warn(`路由地址不合法`, val);
    }
  },
  openTab: (val) => {
    if (typeof val === 'string') {
      window.open(val, '_blank');
    } else {
      console.warn(`路由地址不合法`, val);
    }
  }
};

export type Actions = 'push'|'replace'|'back'|'forward'|'redirect'|'openWindow'|'openTab';

const actions: Actions[] = ['push', 'replace', 'back', 'forward', 'redirect', 'openWindow', 'openTab'];

type Iroute = {
  [key in Actions]: (url: string | Object, env: any) => void;
};

export const route: Iroute = actions.reduce((obj: any, action: string) => {
  obj[action] = (url: string | Object, env: any) => {
    const { runtime, edit } = env ? env : url || {};
    if (edit) return;
    const debug = !!(runtime && runtime.debug);
    if (debug) {
      DebugActions[action](url)
    } else {
      RuntimeActions[action](url)
    }
  }
  return obj;
}, {})
