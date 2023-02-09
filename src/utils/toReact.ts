import { typeCheck } from ".";

function getObjectStr(obj) {
    return JSON.stringify(obj)
}

function getValueStr(val) {
    if (typeCheck(val, 'STRING')) {
        return `"${val}"`;
    }
    if (typeCheck(val, ['OBJECT']))
        return `{${getObjectStr(val)}}`;
    return `{${val}}`;
}

function getObjectDistrbuteStr(obj) {
    const strArr = Object.entries(obj).map(([key, value]) => {
        if (value == null) return '';
        return key + ' = ' + getValueStr(value);
    })
    return strArr.join('\n')
}

export {
    getObjectStr,
    getValueStr,
    getObjectDistrbuteStr,
}