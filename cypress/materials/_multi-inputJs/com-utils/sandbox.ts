const rawWindowInterval = window.setInterval
const rawWindowClearInterval = window.clearInterval
const rawWindowTimeout = window.setTimeout
const rawWindowClearTimeout = window.clearTimeout
const originWindow = window

const constructableMap = new WeakMap<any | FunctionConstructor, boolean>()
function isConstructable(fn: () => any | FunctionConstructor) {
  if (constructableMap.has(fn)) {
    return constructableMap.get(fn)
  }

  const constructableFunctionRegex = /^function\b\s[A-Z].*/;
  const classRegex = /^class\b/;

  const constructable =
    (fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1) ||
    constructableFunctionRegex.test(fn.toString()) ||
    classRegex.test(fn.toString());
  constructableMap.set(fn, constructable)
  return constructable
}

const isCallable = (fn: any) => typeof fn === 'function';

const boundedMap = new WeakMap<CallableFunction, boolean>();
function isBoundedFunction(fn: CallableFunction) {
  if (boundedMap.has(fn)) {
    return boundedMap.get(fn);
  }
  const bounded = fn.name.indexOf('bound ') === 0 && !fn.hasOwnProperty('prototype')
  boundedMap.set(fn, bounded);
  return bounded;
}

const functionBoundedValueMap = new WeakMap<CallableFunction, CallableFunction>()
function getTargetValue(target: any, value: any): any {
  const cachedBoundFunction = functionBoundedValueMap.get(value);
  if (cachedBoundFunction) {
    return cachedBoundFunction;
  }

  const boundValue = Function.prototype.bind.call(value, target);
  for (const key in value) {
    boundValue[key] = value[key];
  }
  if (value.hasOwnProperty('prototype') && !boundValue.hasOwnProperty('prototype'))
    boundValue.prototype = value.prototype;

  functionBoundedValueMap.set(value, boundValue);
  return boundValue;
}

type FakeWindow = Window & Record<PropertyKey, any>

const unscopables = {
  undefined: true,
  Array: true,
  Object: true,
  String: true,
  Boolean: true,
  Math: true,
  Number: true,
  Symbol: true,
  parseFloat: true,
  Float32Array: true,
}

function getModuleScript(scriptText: string) {
  return `(
                function(window, params, cb) {
                    with(window) {
                        return (${scriptText})(...params, cb)
                    }
                }
            )`
}


function getScript(scriptText: string) {
  return `(
                function(window) {
                    with(window){
                        ${scriptText}
                    } 
                }
            ).bind(window.proxy)
        `
}

/**
 * 创建fakeWindow
 * @returns fakeWindow
 */
function createFakeWindow() {
  const fakeWindow = {};
  Object.getOwnPropertyNames(originWindow).forEach((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(originWindow, key)
    if (descriptor && !descriptor.configurable) {
      const hasGetter = Object.prototype.hasOwnProperty.call(descriptor, 'get')
      if (key === 'top' || key === 'parent' || key === 'self' || key === 'window') {
        descriptor.configurable = true;
        if (!hasGetter) {
          descriptor.writable = true;
        }
      }
      Object.defineProperty(fakeWindow, key, Object.freeze(descriptor));
    }
  })
  return fakeWindow;
}

/**
 * 将 window 的属性 p 拷贝到 fakeWindow
 * @param p 
 * @param fakeWindow 
 */
function copyFromWindow(p: string, fakeWindow: FakeWindow) {
  const descriptor = Object.getOwnPropertyDescriptor(window, p);
  if (descriptor && descriptor.writable) {
    Object.defineProperty(fakeWindow, p, {
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      writable: descriptor.writable,
      value: descriptor.value
    });
  }
}

class Sandbox {
  proxy: Window;
  hasDisposed = false;
  fakeWindow = createFakeWindow();
  timeoutList = [];
  intervalList = [];
  options = {};
  // @ts-ignore
  constructor(options = {}) {
    this.options = options || {};
    this.proxy = new Proxy(window, {
      set: (target, key, value) => {
        if (!this.hasDisposed) {
          try {
            if (!this.fakeWindow.hasOwnProperty(key) && target.hasOwnProperty(key)) {
              // @ts-ignore
              copyFromWindow(key, this.fakeWindow);
            }
            // @ts-ignore
            this.fakeWindow[key] = value; // 赋值
          } catch (error) {
            console.error('set-key-error', key, error)
            throw error
          }
        }
        return true;
      },
      get: (target, key) => {
        if (key === Symbol.unscopables) {
          return unscopables;
        }
        if (key === 'window' || key === 'self') {
          return this.proxy;
        }
        if (key === 'document') {
          return undefined;
        }
        if (key === 'hasOwnProperty') {
          return target.hasOwnProperty;
        }
        if (key === 'eval') {
          return target.eval;
        }

        if (key === 'location') {
          return target.location;
        }

        try {
          // @ts-ignore
          var value = key in this.fakeWindow ? this.fakeWindow[key] : target[key];

          // 仅绑定 isCallable && !isBoundedFunction && !isConstructable 的函数对象，如 window.console、window.atob 这类，
          // 不然微应用中调用时会抛出 Illegal invocation 异常
          if (isCallable(value) && !isBoundedFunction(value) && !isConstructable(value)) {
            value = Function.prototype.bind.call(value, target);
            return getTargetValue(window, value);
          }

          return value;
        } catch (error) {
          console.error('get-key-error', key, error)
          throw error
        }
      },
      has: (target, key) => {
        // @ts-ignore
        if (this.options.module) {   //参数允许逃逸到函数局部变量
          if (key === 'params' || key === 'cb') {
            return false;
          }
        }
        return true;  // 伪造属性的存在性阻止沙盒逃逸
      },
    })

    this.proxy.setTimeout = (handler, timeout, ...args) => {
      if (!this.hasDisposed) {
        const timeoutId = rawWindowTimeout(handler, timeout, ...args)
        // @ts-ignore
        this.timeoutList.push(timeoutId)
        return timeoutId;
      } else {
        return 0
      }
    }

    this.proxy.clearTimeout = (timeoutId) => {
      // @ts-ignore
      const timeoutIndex = this.timeoutList.indexOf(timeoutId)
      if (timeoutIndex !== -1) {
        this.timeoutList.splice(timeoutIndex, 1)
      }
      return rawWindowClearTimeout(timeoutId)
    }

    this.proxy.setInterval = (handler, timeout, ...args) => {
      if (!this.hasDisposed) {
        const intervalId = rawWindowInterval(handler, timeout, ...args);
        // @ts-ignore
        this.intervalList.push(intervalId)
        return intervalId;
      } else {
        return 0
      }
    }

    this.proxy.clearInterval = (intervalId) => {
      // @ts-ignore
      const intervalIndex = this.intervalList.indexOf(intervalId)
      if (intervalIndex !== -1) {
        this.intervalList.splice(intervalIndex, 1)
      }
      return rawWindowClearInterval(intervalId)
    }

    // @ts-ignore
    originWindow.proxy = this.proxy;
  }

  // @ts-ignore
  compile(scriptText) {
    if (this.hasDisposed) {
      throw new Error('sandbox has been destroyed')
    }

    // @ts-ignore
    var isModule = this.options.module;
    var scriptTextWithSandbox;
    if (isModule) {
      scriptTextWithSandbox = getModuleScript(scriptText);
    } else {
      scriptTextWithSandbox = getScript(scriptText);
    }

    const fn = originWindow.eval(`${scriptTextWithSandbox};//@ sourceURL=sandbox-code.js`);

    return {
      // @ts-ignore
      run: function (model, cb) {
        try {
          if (isModule) {
            // @ts-ignore
            return fn(window.proxy, model, cb);
          } else {
            // @ts-ignore
            return fn(window.proxy);
          }
        } catch (err) {
          console.error("js sandbox error occur:", err);
          throw err;
        }
      }
    }
  }

  //沙箱销毁功能
  dispose() {
    this.timeoutList.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    this.timeoutList = [];

    this.intervalList.forEach((intervalId) =>
      rawWindowClearInterval(intervalId)
    )
    this.intervalList = []

    this.fakeWindow = createFakeWindow();
    this.options = {};

    // @ts-ignore
    delete originWindow.proxy;
    this.hasDisposed = true;
    console.log('Sandbox was successfully destroyed')
  }
}

export default Sandbox;


