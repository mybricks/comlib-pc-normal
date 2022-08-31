/**
 * GetPath 在对象中根据链式路径查找属性，返回属性值
 * @param obj 待解析对象
 * @param path 链式路径
 * @param def 默认返回值
 * @returns 属性值
 */
function getPath(obj: Object, path: string, def?: any) {
  if (!path) return obj;
  const pathArray = path.split(".");
  let result: any;
  try {
    result = pathArray.reduce((pre, current) => pre[current], obj);
  } catch (e) {
    result = undefined;
  }
  return typeof result === "undefined" ? def : result;
}

/**
 * SetPath 在对象中根据链式路径设置属性，返回新对象
 * @param obj 对象
 * @param path 链式路径
 * @param value 设置的属性值
 * @param setSchema 是否在设置schema
 * @returns 更新后的对象
 */
function setPath(obj: Object = {}, path: string, value: any, setSchema?: boolean) {
  const keys = path.split(".");
  let key: string,
    result: Object = obj;
  // 逐层查找
  while ((key = keys.shift()) && keys.length) {
    if (!result[key])
      result[key] = {};
    if (setSchema) {
      result[key].type = 'object';
      if (!result[key].properties) {
        result[key].properties = {};
      }
      result = result[key].properties
    } else {
      if (Object.prototype.toString.call(result[key]) !== '[object Object]')
        result[key] = {};
      result = result[key];
    }
  }
  result[key] = value;
  return obj;
}

export {
  getPath,
  setPath
}