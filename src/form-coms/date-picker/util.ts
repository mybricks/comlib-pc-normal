import moment, { isMoment } from "moment";
import { WeekDayEnum, WeekEnumMap, QuarterEnumMap } from "./constant";

export const pickToFormat = {
  date: 'YYYY-MM-DD',
  year: 'YYYY',
  month: 'YYYY-MM',
  quarter: 'YYYY-[Q]Q',
  week: 'YYYY-[W]WW'
}

export interface DisabledRulesValue {
  relation: string
  rules: Array<{ op: string, value: any | Pick<DisabledRulesValue, 'relation' | 'rules'> }>
  picker: string
}

export const innerDateType = ['TODAY', 'QUARTER', 'MONTH', 'YEAR', 'WEEK']
const regStartMatch = /^(TODAY|YEAR|QUARTER|MONTH|WEEK)/

export const mapPickerToEnd = {
  date: 'day',
  month: 'month',
  quarter: 'quarter',
  week: 'week',
  year: 'year'
}

const currentMap = {
  date: 'current.day()',
  month: 'current.month()', 
  quarter: 'current.quarter()'
}

// 匹配2024-YY-DD
export const dateRegex = /^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/;

function getDateValType(value) {
  if (moment.isMoment(value)) {
    return 'moment'
  }
  if (typeof value === 'number' && !isNaN(value)) {
    return 'number'
  }
  if (typeof value === 'string') {
    return 'string'
  }
  if (Array.isArray(value)) {
    return 'array'
  }
  return typeof value
}

export function formatRulesExpression(val: DisabledRulesValue, picker) {
  let result = '';
  let LOGIC_SEPARATOR = val.relation ?? '||'
  // let currentMode = 
  for (let i = 0; i < val.rules.length; i++) {
    let { op: type, value: comVal } = val.rules[i];
    if (typeof comVal === 'string' && (innerDateType.includes(comVal) || regStartMatch.test(comVal))) {
      comVal = formatIncludeSpecialDate(comVal)
    } else {
      let dateEnd = 'end'
      if(picker === 'date') {
        if(type === '<') {
          dateEnd = 'start'
        }
        if(isMoment(comVal) && ['>', '<'].includes(type)) {
          // 待验证
          dateEnd = 'default'
        }
        console.log('comVal', comVal, isMoment(comVal))
      }
      comVal = formatSingleComVal(comVal, picker, picker === 'week' ? 'start' : dateEnd)
    }
    let separator = i === 0 ? '' : LOGIC_SEPARATOR;
    if (comVal)
      switch (type) {
        case '>':
        case '<':
        case '<=':
        case '>=':
        case '=':
        case '!=':
          let actualType = type === '=' ? '===' : type === '!=' ? '!==' : type
          result = result + separator + `${formatGreaterOrLessCurrent('current', picker, type)} ${actualType} ${comVal}`;
          break;
        // 日期在/不在某个区间
        case 'in':
        case 'notIn':
          console.log('comVal', JSON.stringify(comVal))
          comVal = formatInOrNotParams(comVal, picker)
          result =
            result +
            separator +
            `(${type === 'in' ? '' : '!'}${JSON.stringify(
              comVal
            )}.includes(${formatInOrNotCurrent('current', picker)}))`;
          break;
        // 日期选择：处理周一-周五以及周六日这种; 季度选择：Q1,Q2
        case 'equal':
        case 'notEqual':
          let formatted = formatEqualOtNotEqualParams(comVal, picker)
          result = result + separator + `${type === 'equal' ? '' : '!'}(${formatted})`;
          break;
        // 处理区间
        case 'between':
          const formattedBetween = formatBetweenParams(comVal, picker);
          result =
            result + separator + `${formattedBetween}`;
          break;
        case 'complex':
          let complexExpr = formatRulesExpression(val.rules[i].value, picker)
          if (complexExpr) {
            result = result + separator + '(' + complexExpr + ')'
          }
        default:
          break;
      }
  }
  return result
}

export function formatSingleComVal(comVal, picker, endOrStart) {
  let valueType = getDateValType(comVal)
  let extraArgs = picker === 'quarter' ? [pickToFormat.quarter] : []
  if (valueType === 'moment') {
    if (picker === 'year') {
      return comVal.year()
    }
    if(endOrStart === 'default') {
      return comVal.valueOf();
    }
    return endOrStart === 'start' ? comVal.startOf(mapPickerToEnd[picker]).valueOf() : comVal.endOf(mapPickerToEnd[picker]).valueOf()
  } else if (valueType === 'number') {
    return comVal
  }
  if (valueType === 'array' || valueType === 'object') {
    return comVal
  }
  switch (picker) {
    case 'year':
      comVal = Number(comVal)
      break;
    case 'week':
      // week 传入的字符串支持2024-W32 和2024-11-12 这两种格式
      let extraParams = dateRegex.test(comVal) ? ['YYYY-MM-DD'] : ['YYYY-[W]WW']
      comVal = moment(comVal, ...extraParams).startOf(mapPickerToEnd[picker]).valueOf()
      break;
    case 'date':
    case 'month':
    case 'quarter':
      let date = moment(comVal, ...extraArgs)
      comVal = endOrStart === 'default' ? date.valueOf() : endOrStart === 'end' ? date.endOf(mapPickerToEnd[picker]).valueOf() : date.startOf(mapPickerToEnd[picker]).valueOf()
      break;
    default:
      break;
  }
  return comVal
}

// 处理包含内置 TODAY、WEEK、YEAR、QUARTER、MONTH这些特殊变量
function formatIncludeSpecialDate(comVal) {
  let reg = /(TODAY|YEAR|QUARTER|MONTH|WEEK)\s*([\+\-])\s*(\d+)/;// /(TODAY)\s*([\+\-])\s*(\d+)/;
  let res = reg.exec(comVal);

  if (res) {
    let type = res[1]
    let offset = Number(res[3]); // 相对当前时间的偏移量
    if (type.toUpperCase() === 'WEEK') {
      return res[2] === '+'
        ? `moment().clone().add(${offset}, 'weeks').startOf('week')`
        : `moment().clone().subtract(${offset}, 'weeks').startOf('week')`
    }
    if (type.toUpperCase() === 'YEAR') {
      return res[2] === '+' ? ` moment().add(${offset}, 'years').year()` : `moment().subtract(${offset}, 'years').year()`;
    }
    if (['MONTH', 'QUARTER', 'TODAY'].includes(type.toUpperCase())) {
      let map = { TODAY: 'day', MONTH: 'month', QUARTER: 'quarter' }
      let dateType = map[type.toUpperCase()]
      return res[2] === '+' ? ` moment().add(${offset}, '${dateType}').endOf('${dateType}')` : `moment().subtract(${offset}, '${dateType}').endOf('${dateType}')`;
    }
  }
  return comVal
}

// >, <. >=, <= 等场景 current取值
export function formatGreaterOrLessCurrent(current, picker: 'date' | 'week' | 'month' | 'quarter' | 'year', type) {
  if (picker === 'year') {
    return 'current.year()'
  }
  if (picker === 'week') {
    return "current.clone().startOf('week')"
  }
  if(type === '=' || type === '!==' || type === '>=' || type === '<=') {
    return `current.endOf('${mapPickerToEnd[picker]}').valueOf()`
  }
  // if (['date', 'quarter', 'month'].includes(picker)) {
  //   return `current.endOf('${mapPickerToEnd[picker]}')`
  // }
  return 'current'
}

// in ,notIn 等关于多个日期 场景current 取值
export function formatInOrNotCurrent(current, picker: 'date' | 'week' | 'month' | 'quarter' | 'year') {
  if (picker === 'year') {
    return 'current.year()'
  }
  if (picker === 'week') {
    return "current.clone().format('YYYY-[W]WW')"
  }
  if (['date', 'quarter', 'month'].includes(picker)) {
    return `current.format('${pickToFormat[picker]}')`
  }
  return 'current'
}

export function formatInOrNotParams(comVal, picker: 'date' | 'week' | 'month' | 'quarter' | 'year') {
  if (picker === 'year') {
    return comVal.map((item) => Number(moment(String(item)).format(pickToFormat[picker])));
  }
  let res = comVal.map(item => {
    return moment(formatSingleComVal(item, picker, 'start')).format(pickToFormat[picker])
  })
  return res
}

// equal, notEqual 只支持日期和季度,月份选择
export function formatEqualOtNotEqualParams(comVal, picker: 'date' | 'quarter' | 'month') {
  if (['date', 'quarter', 'month'].includes(picker)) {
    let formatted = comVal
      .map((item) => {
        let comPareValue =
          typeof item === 'number' ?
            (item -1) : picker === 'quarter' ? QuarterEnumMap[item] : picker === 'date' ? WeekEnumMap[WeekDayEnum[item]] : '';
        return `${currentMap[picker]} === ${comPareValue}`;
      })
      .join(' || ');
    return formatted
  }
  return comVal
}
// between 区间范围，处理
export function formatBetweenParams(comVal, picker: string) {
  if (['date', 'year', 'month', 'quarter'].includes(picker)) {
    comVal = formatRangeValue(comVal, picker, ['start', 'end']);
  }
  switch (picker) {
    case 'date':
    case 'quarter':
    case 'month':
      return `(current >= ${comVal[0]} && current <= ${comVal[1]} )`;
    case 'year':
      return `(current.year() >= ${comVal[0]} && current.year() <= ${comVal[1]} )`;
    case 'week':
      let start, end
      if (isMoment(comVal[0] || typeof comVal[0] === 'number')) {
        start = (isMoment(comVal[0]) ? comVal[0] : moment(comVal[0])).startOf('week')
      } else {
        start = dateRegex.test(comVal[0]) ? moment(comVal[0],).startOf('week') : moment(comVal[0] + '-1', 'YYYY-[W]WW-e').clone().startOf('week')
      }
      if (isMoment(comVal[1] || typeof comVal[1] === 'number')) {
        end = (isMoment(comVal[1]) ? comVal[1] : moment(comVal[1])).endOf('week')
      } else {
        end = dateRegex.test(comVal[1]) ? moment(comVal[1]).startOf('week') : moment(comVal[1] + '-7', 'YYYY-[W]WW-e').clone().endOf('week')
      }
      return `(current.clone().startOf('week') >= ${start.valueOf()} && current.clone().startOf('week') <= ${end.valueOf()} ) `
    default:
      break;
  }
}

export function formatRangeValue(comValArr, picker, startOrEnd: Array<string> | string) {
  let arr: any[] = []
  comValArr.forEach((item, index) => {
    let formatStartOrEnd = Array.isArray(startOrEnd) ? startOrEnd[index] : startOrEnd
    arr.push(formatSingleComVal(item, picker, formatStartOrEnd ?? 'end'))
  })
  return arr
}