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