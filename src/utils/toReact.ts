import { typeCheck } from ".";

function getObjectStr(obj) {
    return JSON.stringify(obj)
}

function getValueStr(val) {
    if (typeCheck(val, 'STRING')) {
        return `"${val}"`;
    }
    if (typeCheck(val, ['OBJECT', 'ARRAY'])) {
        const noDistruteOrItem = (typeCheck(val, ['OBJECT']) && Object.values(val).filter(item => item != undefined).length < 1)
            || (typeCheck(val, ['ARRAY']) && val.length < 1);
        if (noDistruteOrItem) return '';
        const objStr = getObjectStr(val);
        return `{${objStr}}`;
    }
    if (typeCheck(val, ['FUNCTION']))
        return `{${val()}}`;
    return `{${val}}`;
}

function getObjectDistrbuteStr(obj) {
    const strArr = Object.entries(obj).map(([key, value]) => {
        if (value == null) return '';
        const valueStr = getValueStr(value);
        if (!valueStr) return '';
        return key + ' = ' + valueStr;
    })
    return strArr.join('\n')
}

export {
    getObjectStr,
    getValueStr,
    getObjectDistrbuteStr,
}