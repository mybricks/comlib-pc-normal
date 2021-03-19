import {message} from 'antd';

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

function merge({xg, rt, data, editors, target, mock, help, assistence, upgrade}: { xg, rt, data?, editors?, target?, mock?, help?, assistence?, upgrade? }) {
  return Object.assign(xg, {
    runtime: rt,
    data: data,
    editors,
    target,
    mock,
    help,
    assistence,
    upgrade
  })
}

function copyText(txt: string): void {
  const input = document.createElement('input')
  document.body.appendChild(input)
  input.value = txt
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
  message.success('已复制到剪贴板')
}

function typeCheck(variable, type) {
  if (Array.isArray(type)) {
    let bool = false
    for(let i = 0; i < type.length; i++) {
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

function schemaCheck(schema: any, data: any, type?: any) {
  if (!typeCheck(data, 'array') && !typeCheck(data, 'object') && data === schema) return true
  if (typeCheck(data, 'array') && typeCheck(schema, 'array')) {
    for (const i in data) {
      return schemaCheck(schema[i], data[i])
    }
  } else if (typeCheck(data, 'object') && typeCheck(schema, 'object')) {
    if (data.type === 'object') {
      return schemaCheck(schema.properties, data.properties, 'properties')
    } else if (data.type === 'array' && data.items) {
      return schemaCheck(schema.items, data.items)
    } else {
      let bool = true
      if ((!data || !Object.keys(data).length) && (!schema || !Object.keys(schema).length)) {
        bool = true
      } else if (!data || !Object.keys(data).length) {
        bool = false
      } else {
        for (const i in data) {
          if (!(type !== 'properties' && i !== 'type')) {
            if (!(type !== 'properties' && i !== 'type') && !schemaCheck(schema[i], data[i])) {
              bool = false
              break
            }
          }
        }
      }
      return bool
    }
  } else {
    return false
  }
}

function unitConversion (value: string) {
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
  const copy: any = Array.isArray(obj) ?  [] :   {}

  cache.push({
    original: obj,
    copy
  })
  
  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}

function getNumberValue (val: string | number) {
  if (typeof val === 'number') {
    return val
  } else {
    return val && val.match(/^(\-|\+)?\d+(\.\d+)?$/gi) ? Number(val) : void 0
  }
}

export {
  uuid,
  merge,
  deepCopy,
  copyText,
  typeCheck,
  schemaCheck,
  unitConversion,
  getNumberValue
}