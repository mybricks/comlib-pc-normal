function isType(type: string) {
  return value => Object.prototype.toString.call(value) === `[object ${type}]`
}

/**
 * 判断是否是未定义
 * @param value 入参cd
 * @returns true/false，undefined、null返回true
 */
export function isUndef(value: unknown): value is undefined | null {
  return value === undefined || value === null
}

/**
 * 判断是否为空 undefined、null、空字符串返回true
 * @param value 入参
 */
export function isEmpty(value: unknown): value is undefined | null | '' {
  return value === undefined || value === null || value === ''
}

/**
 * 判断是否为Number类型
 * @param value 入参
 */
export function isNumber(value: unknown): value is number {
  return isType('Number')(value)
}