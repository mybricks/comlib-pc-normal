const typeMap = {
  'OBJECT': '[object Object]',
  'ARRAY': '[object Array]',
  'STRING': '[object String]',
  'NUMBER': '[object Number]',
  'FORMDATA': '[object FormData]',
  'NULL': '[object Null]',
  'UNDEFINED': '[object Undefined]',
  'BOOLEAN': '[object Boolean]',
  'FUNCTION': '[object Function]'
}

function uuid(pre = 'u_', len = 6) {
  const seed = 'abcdefhijkmnprstwxyz0123456789', maxPos = seed.length;
  let rtn = '';
  for (let i = 0; i < len; i++) {
    rtn += seed.charAt(Math.floor(Math.random() * maxPos));
  }
  return pre + rtn;
}

export function isEmptyString(str: string): boolean {
  if (typeof str !== 'string') {
    return false
  } else {
    return !!str.trim().length
  }
}

function typeCheck(variable, type) {
  if (Array.isArray(type)) {
    let bool = false
    for (let i = 0; i < type.length; i++) {
      if (typeCheck(variable, type[i])) {
        bool = true
        break
      }
    }
    return bool
  } else {
    const checkType = /^\[.*\]$/.test(type) ? type : typeMap[type.toUpperCase()]
    return Object.prototype.toString.call(variable) === checkType
  }
}

function unitConversion(value: string) {
  if (/^\d+(?:%)$/.test(value)) {
    return value
  } else if (/^(?:calc)/.test(value)) {
    return value
  } else if (/^\d+(?:vh)$/.test(value)) {
    return parseInt(value, 10) + 'vh'
  } else if (/^\d+(?:vw)$/.test(value)) {
    return parseInt(value, 10) + 'vw'
  } else {
    return /^\d+(?:px)?$/.test(value) ? parseInt(value, 10) + 'px' : void 0
  }
}

function deepCopy(obj: any, cache: any = []) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  const hit: any = cache.filter((c: any) => c.original === obj)[0]
  if (hit) {
    return hit.copy
  }
  const copy: any = Array.isArray(obj) ? [] : {}

  cache.push({
    original: obj,
    copy
  })

  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}

export {
  uuid,
  typeCheck,
  unitConversion,
  deepCopy,
}

export function hasScripts(src: string, doc = document) {
  let bool = false;
  const scripts = doc.getElementsByTagName('script');
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src === src) {
      bool = true;
    }
  }

  return bool;
}

export function loadScript(src: string, varName: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = function () {
      resolve(window[varName as any]);
    };
    document.head.appendChild(script);
  });
}

export const isObject = (obj: any) => {
  return Object.prototype.toString.call(obj).match(/\[object (.*)\]/)[1] === 'Object';
}

export const isString = (obj: any) => {
  return typeof obj === "string" || Object.prototype.toString.call(obj).match(/\[object (.*)\]/)[1] === 'String';
}

export const arrayMove = <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
  if (!Array.isArray(array)) throw Error('parameter array must be typeof Array')
  if (fromIndex < 0) throw Error('parameter fromIndex must be greater than 0')
  if (toIndex >= array.length) throw Error(`parameter toIndex must be less than ${array.length}`)
  if (!array.length) return array
  const item = array.splice(fromIndex, 1)[0]
  array.splice(toIndex, 0, item)
  return array
}

export const isEmptyObject = (obj: any) => {
  return !Object.keys(obj ?? {}).length;
}

export const checkIfMobile = (env) => {
  return env?.canvas?.type === 'mobile'
}

export const differObject = (obj, baseObj) => {
  const difference = {};
  Object.keys(obj).map(key => {
    const value1 = obj[key];
    const value2 = baseObj[key];
    if (value1 !== value2) {
      difference[key] = value1;
    }
  });
  return difference;
}

export const i18nFn = (opts, env) => {
  if(opts && Array.isArray(opts)){
    let newOpts = opts.map((opt)=>{
      return {
        ...opt,
        label: env.i18n(opt.label)
      }
    })
    return newOpts;
  }else{
    return opts
  }
  
}

/**
 * 
 * @description 判断是否需要初始化
 * @param value 待判断值
 * @param defaultValue 初始值
 * @returns 
 */
export const setIfUndefined = <T>(value: T | undefined, defaultValue: T): T => {
  return value === undefined ? defaultValue : value;
};

export function isBase64Image(url) {
  return url.startsWith('data:image/') && url.includes(';base64,');
}

export * from './upgrade';
export * from './io';