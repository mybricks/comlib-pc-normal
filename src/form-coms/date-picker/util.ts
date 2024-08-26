import moment from "moment";

export const pickToFormat = {
  date: 'YYYY-MM-DD',
  year: 'YYYY',
  month: 'YYYY-MM',
  quarter: 'YYYY-[Q]Q',
  week: 'YYYY-[W]WW'
}


export const innerDateType = ['TODAY', 'QUARTER', 'MONTH', 'YEAR', 'WEEK']
const regStartMatch = /^(TODAY|YEAR|QUARTER|MONTH|WEEK)/

export const mapPickerToEnd = {
  date: 'day',
  month: 'month',
  quarter: 'quarter',
  week: 'week'
}
// 匹配2024-YY-DD
export const dateRegex = /^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/;


export enum WeekDayEnum {
  //周日
  Sun = 'Sun',
  // 周一到周六
  Mon = 'Mon',
  Tue = 'Tue',
  Wed = 'Wed',
  Thu = 'thu',
  Fri = 'Fri',
  Sat = 'Sat'
}
export const WeekEnumMap = {
  [WeekDayEnum.Sun]: 0,
  [WeekDayEnum.Mon]: 1,
  [WeekDayEnum.Tue]: 2,
  [WeekDayEnum.Wed]: 3,
  [WeekDayEnum.Thu]: 4,
  [WeekDayEnum.Fri]: 5,
  [WeekDayEnum.Sat]: 6
};

export const QuarterEnumMap = {
  'Q1': 1,
  'Q2': 2,
  'Q3': 3,
  'Q4': 4
}

export function formatRulesExpression(val, picker) {
  let result = '';
  let LOGIC_SEPARATOR = '||';
  // const picker = data.config.picker || 'date'
  // let regex =  /(TODAY)\s*([\+\-])\s*(\d+)/;//            /(TODAY)\s*([\+\-])\s*(\d+)/i
  console.log('picker', picker)
  for (let i = 0; i < val.length; i++) {
    let [type, comVal] = val[i];

    if (typeof comVal === 'string' && (innerDateType.includes(comVal) || regStartMatch.test(comVal))) {
      comVal = formatParamsComVal(comVal, picker, )
    }else {
      if(typeof comVal === 'string') {
        comVal = formatParamsComVal(comVal, picker, { ignore: true,  })
      }
    }
    let separator = i === 0 ? '' : LOGIC_SEPARATOR;
    if (comVal)
      switch (type) {
        case '>':
        case '<':
        case '<=':
        case '>=':
        case '=':
          result = result + separator + `${formatGreaterOrLessCurrent('current', picker)} ${type} ${comVal}`;
          break;
        // 日期在/不在某个区间
        case 'in':
        case 'notIn':
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
          // 处理周六周日
          result = result + separator + `${type === 'equal' ? '' : '!'}(${formatted})`;
          break;
        // 处理区间
        case 'between':
          const formattedBetween = formatBetweenParams(comVal, picker);
          result =
            result + separator + `${formattedBetween}`;
          break;
        default:
          break;
      }
  }
  result = 'current &&  (' + result + ')';
  return result
}

export function formatParamsComVal(comVal, picker: string, options = {}) {
  const { ignore } = options
  if(typeof comVal !== 'string') {
    return comVal
  }
  if(ignore) {
    switch  (picker) {
      case 'date':
        comVal = moment(String(comVal)).endOf(mapPickerToEnd[picker]).valueOf()
        break;
      case 'year':
        comVal = Number(comVal)
        break;
      case 'month':
        comVal = moment(String(comVal)).endOf(mapPickerToEnd[picker]).valueOf()
        break;
      case 'quarter': 
        comVal = moment(comVal, pickToFormat['quarter']).endOf(mapPickerToEnd[picker]).valueOf()
      case 'week':
        // week 支持2024-W32 和2024-11-12 这两种格式
        comVal = moment(comVal,  dateRegex.test(comVal) ? 'YYYY-MM-DD' :'YYYY-[W]WW').startOf(mapPickerToEnd[picker]).valueOf()
        break;
      default:
        break;
    }
    return comVal
  }
  let reg = /(TODAY|YEAR|QUARTER|MONTH|WEEK)\s*([\+\-])\s*(\d+)/ ;// /(TODAY)\s*([\+\-])\s*(\d+)/;
  let res = reg.exec(comVal);
  console.log('comVal', comVal, res)

  if (res) {
    let type = res[1]
    console.log('res', res)
    let offset = Number(res[3]); // 相对当前时间的偏移量
    if(type.toUpperCase() === 'YEAR') {
      return res[2] === '+' ? ` moment().add(${offset}, 'years').year()` : `moment().subtract(${offset}, 'years').year()`;
    }
    if(type.toUpperCase() === "TODAY") {
      return res[2] === '+'
          ? `moment().add(${offset}, 'day').endOf('day')`
          : `moment().subtract(${offset}, 'day').endOf('day')`;
    }
    if(type.toUpperCase() === 'QUARTER') {
      return res[2] === '+'
          ? `moment().add(${offset}, 'quarters').endOf('quarter')`
          : `moment().subtract(${offset}, 'quarters').endOf('quarter')`;
    }
    if(type.toUpperCase() === 'MONTH') {
      return res[2] === '+'
          ? `moment().add(${offset}, 'months').endOf('month')`
          : `moment().subtract(${offset}, 'months').endOf('month')`;
    }
    if(type.toUpperCase() === 'WEEK') {
      return res[2] === '+'
          ? `moment().clone().add(${offset}, 'weeks').startOf('week')`
          : `moment().clone().subtract(${offset}, 'weeks').startOf('week')`;
    }
  }
  return comVal
}

// >, <. >=, <= 等场景 current取值
export function formatGreaterOrLessCurrent(current, picker: 'date' | 'week' | 'month' | 'quarter'| 'year') {
  if(picker === 'year') {
    return 'current.year()'
  }
  if(picker === 'week') {
    return "current.clone().startOf('week')"
  }
  if(picker === 'date') {
    return "current.endOf('day')"
  }
  if (picker === 'quarter') {
    return "current.endOf('quarter')"
  }
  if (picker === 'month') {
    return "current.endOf('month')"
  }
  return 'current'
}

// in ,notIn 等关于多个日期 场景current 取值
export function formatInOrNotCurrent(current, picker: 'date' | 'week' | 'month' | 'quarter'| 'year') {
  if(picker === 'year') {
    return 'current.year()'
  }
  if (picker === 'week') {
    return "current.clone().format('YYYY-[W]WW')"
  }
  if(['date', 'quarters', 'month'].includes('picker')) {
    return `current.format(${pickToFormat[picker]})`
  }
  // if(picker === 'date') {
  //   return "current.format('YYYY-MM-DD')"
  // }
  // if (picker === 'quarter') {
  //   return "current.format('YYYY-[Q]Q')"
  // }
  // if (picker === 'month') {
  //   return "current.format('YYYY-MM')"
  // }
  return 'current'
}

export function formatInOrNotParams(comVal, picker: 'date' | 'week' | 'month' | 'quarter'| 'year') {
  if(picker === 'year') {
    return comVal.map((item) => Number(moment(String(item)).format(pickToFormat[picker])));
  }
  if(picker === 'quarter') {
    return  comVal.map((item) => moment(String(item), 'YYYY-[Q]Q').format(pickToFormat[picker]))
  }
  if(picker === 'month') {
    return  comVal.map((item) => moment(String(item)).format(pickToFormat[picker]))
  }
  if(picker === 'week') {
    return  comVal.map((item) =>{
      return moment(String(item), dateRegex.test(String(item))  ? 'YYYY-MM-DD' : 'YYYY-[W]WW').format(pickToFormat[picker])
    })
  }
  comVal = comVal.map((item) => moment(String(item)).format(pickToFormat[picker]));
  return comVal
}

export function formatEqualOtNotEqualParams(comVal, picker: 'date' | 'quarter') {
  if(picker === 'date') {
    let formatted = comVal
    .map((item) => {
      return `current.day() === ${WeekEnumMap[WeekDayEnum[item]]}`;
    })
    .join(' || ');
    return formatted
  }
  if(picker === 'quarter') {
    let formatted = comVal
    .map((item) => {
      return `current.quarter() === ${QuarterEnumMap[item]}`;
    })
    .join(' || ');
    return formatted
  }
  return comVal
}

export function formatBetweenParams(comVal, picker: 'date' | 'quarter') {
  if(picker === 'date') {
    comVal[0] = moment(comVal[0]).startOf('day').valueOf() 
    comVal[1] = moment(comVal[1]).endOf('day').valueOf() 
    return `(current >= ${comVal[0]} && current <= ${comVal[1]} )`
  }
  if(picker === 'quarter') {
    const [year1, quarter1] = comVal[0].split('-Q');
    const startMonth1 = (quarter1 - 1) * 3; // 开始季度的起始月份

    const [year2, quarter2] = comVal[1].split('-Q');
    const endMonth2 = (quarter2 - 1) * 3  + 2 // 结束季度的结束月份

    const startDate = moment().year(year1).month(startMonth1).startOf('month').valueOf();
    const endDate = moment().year(year2).month(endMonth2).endOf('month').valueOf();
    return `(current >= ${startDate} && current <= ${endDate} )`
  }
  if(picker === 'year') {
    comVal = comVal.map((item) => Number(item));
    return `(current.year() >= ${comVal[0]} && current.year() <= ${comVal[1]} )`
  }
  if(picker === 'month') {
    comVal[0] = moment(comVal[0]).startOf('month').valueOf() 
    comVal[1] = moment(comVal[1]).endOf('month').valueOf() 
    return `(current >= ${comVal[0]} && current <= ${comVal[1]} )`
  }
  if(picker === 'week') {
    let start = dateRegex.test(comVal[0]) ? moment(comVal[0], ).startOf('week') : moment(comVal[0]+'-1', 'YYYY-[W]WW-e').clone().startOf('week')
    let end = dateRegex.test(comVal[1]) ? moment(comVal[1]).startOf('week') : moment(comVal[1]+'-7', 'YYYY-[W]WW-e').clone().endOf('week')
    return `(current.clone().startOf('week') >= ${start.valueOf()} && current.clone().startOf('week') <= ${end.valueOf()} )`
  }
}