import { message } from 'antd';
import { Data, InputIds, OutputIds, TypeEnum } from './constants';

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
      const { state = {}, title = '', url } = val || {};
      return {
        state,
        title,
        url
      };
    default:
      return {};
  }
};

const isUri = (url: string) => {
  return /^http[s]?:\/\/([\w\-\.]+)+[\w-]*([\w\-\.\/\?%&=]+)?$/gi.test(url);
};

// 调试行为提示
const DebugActions = {
  pushState: (val) => {
    const { state, title, url } = getHistoryParams(val);
    message.info(`pushState：${JSON.stringify({ state, title, url })}`);
    if (!url) {
      message.info(`路由地址不能为空`);
    }
    console.log(`pushState`, { state, title, url });
  },
  replaceState: (val) => {
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
  reload: () => {
    message.info(`location.reload`);
    console.log(`location.reload`);
  },
  redirect: (val) => {
    const { url } = getHistoryParams(val);
    message.info(`redirect: ${url}`);
    if (typeof url !== 'string') {
      message.info(`路由地址不合法`);
    }
    console.log(`redirect`, url);
  },
  openWindow: (val) => {
    const { url, title } = getHistoryParams(val);
    message.info(`openWindow: window.open(${url}, ${title || '_blank'})`);
    if (typeof val !== 'string') {
      message.info(`路由地址不合法`);
    }
    console.log(`openWindow`, url);
  },
  openTab: (val) => {
    const { url, title } = getHistoryParams(val);
    message.info(`openTab: window.open(${url}, ${title || '_blank'})`);
    if (typeof url !== 'string') {
      message.info(`路由地址不合法`);
    }
    console.log(`openTab`, url);
  }
};

const RuntimeActions = {
  pushState: (val) => {
    const { state, title, url } = getHistoryParams(val);
    if (url) {
      if (isUri(url)) {
        //兼容uri
        window.location.href = url;
      } else {
        history.pushState(state, title, url);
      }
    } else {
      console.warn(`路由地址不能为空`, val);
    }
  },
  replaceState: (val) => {
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
  reload: () => {
    location.reload();
  },
  redirect: (val) => {
    const { url } = getHistoryParams(val);
    if (typeof url === 'string') {
      window.location.replace(url);
    } else {
      console.warn(`路由地址不合法`, url);
    }
  },
  openWindow: (val) => {
    const { url, title } = getHistoryParams(val);
    if (typeof url === 'string') {
      window.open(url, title || '_blank');
    } else {
      console.warn(`路由地址不合法`, val);
    }
  },
  openTab: (val) => {
    const { url, title } = getHistoryParams(val);
    if (typeof url === 'string') {
      window.open(url, title || '_blank');
    } else {
      console.warn(`路由地址不合法`, val);
    }
  }
};

const getParams = (val, data: Data) => {
  if (data?.useDynamic) {
    if (typeof val === 'string') {
      return val;
    }
    return undefined;
  }
  return {
    title: data?.title,
    url: data?.url
  };
};
// 调试时执行
const debugExecute = ({ inputs, data }: RuntimeParams<Data>) => {
  const { type } = data;
  inputs[InputIds.RouterAction]((val) => {
    if (DebugActions[type]) {
      DebugActions[type](getParams(val, data));
    }
  });
};
// 运行时执行
const runtimeExecute = ({ inputs, data }: RuntimeParams<Data>) => {
  const { type } = data;
  inputs[InputIds.RouterAction]((val) => {
    if (RuntimeActions[type]) {
      RuntimeActions[type](getParams(val, data));
    }
  });
};

const executeSwitch = ({ inputs, data, env, logger, onError }: RuntimeParams<Data>) => {
  const { getRouter = () => ({}) } = env.vars;
  const routerSwitcher = getRouter();
  if (!Object.keys(routerSwitcher).length) {
    onError?.('环境变量 vars.getRouter 方法未实现');
    console.error(`【跳转到...】组件： 环境变量 vars.getRouter 方法未实现`);
    return;
  }
  const { type } = data;
  inputs[InputIds.RouterAction]((val, outputRels) => {
    if (routerSwitcher[type]) {
      const params = getHistoryParams(getParams(val, data));
      if ([TypeEnum.PUSHSTATE, TypeEnum.REDIRECT, TypeEnum.OPENTAB].includes(type) && !params.url) {
        message.error(`路由地址不能为空: ${JSON.stringify(params)}`);
        return;
      }
      try {
        routerSwitcher[type](params);
        outputRels[OutputIds.RouterActionDone](val);
      } catch (error) {
        onError?.('【跳转到...】组件运行错误.');
        console.error('【跳转到...】组件运行错误.', error);
        logger.error(`${error}`);
      }
    }
  });
};

export default function (props: RuntimeParams<Data>) {
  const { env } = props;
  const { edit, runtime } = env;
  const debug = !!(runtime && runtime.debug);

  if (edit) {
    return;
  }
  executeSwitch(props);
  // if (debug) {
  //   debugExecute(props);
  //   return;
  // }
  // if (runtime) {
  //   runtimeExecute(props);
  //   return;
  // }
}
