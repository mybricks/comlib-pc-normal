export function isNumber(input) {
  return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
}

export function isValidRange(val, type: 'moment' | 'number') {
  if (type === 'moment') {
    if (!val[0].isValid() || !val[1].isValid()) throw Error('params error');
    return val[0].valueOf() <= val[1].valueOf();
  }
  if (type === 'number') {
    return val[0] <= val[1];
  }
}

export function isValidInput(val) {
  return Array.isArray(val) && val.length === 2;
}

export function isDefaultInput(val){
  let parameter = false;
  if(Array.isArray(val) && val.length === 2){
    for(let i = 0; i < val.length; i++){
      if(val[i]===undefined || val[i]===null){
        parameter = true
      }else{
        parameter = false;
        break;
      }
    }
  }
  
  return parameter;
}