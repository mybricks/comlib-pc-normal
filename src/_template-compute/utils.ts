const isObject = (target) => {
  return Object.prototype.toString.call(target) === "[object Object]";
};

export function costumier(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    objValue.unshift(...srcValue)
    return objValue;
  }
}

export function uuid(pre = 'u_', len = 6) {
  const seed = 'abcdefhijkmnprstwxyz0123456789', maxPos = seed.length;
  let rtn = '';
  for (let i = 0; i < len; i++) {
    rtn += seed.charAt(Math.floor(Math.random() * maxPos));
  }
  return pre + rtn;
}