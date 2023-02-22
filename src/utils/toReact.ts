import { typeCheck } from ".";

function getObjectStr(obj) {
    return JSON.stringify(obj)
}

/**
 * 获取不同类型属性值的prop表示
 * @param val 属性值
 * @returns 属性值
 */
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
    if (typeCheck(val, ['FUNCTION'])) {
        const valStr = val();
        return valStr ? `{${valStr}}` : void 0;
    }
    return `{${val}}`;
}

/**
 * 根据对象获取组件props字符串
 * @param propsObj 组件props对象
 * @param defaultPropsObj 组件props默认值
 * @returns 组件props字符串
 */
function getPropsFromObject(propsObj, defaultPropsObj?) {
    const strArr = Object.entries(propsObj).map(([key, value]) => {
        if (value == null) return '';
        const defaultValue = defaultPropsObj?.[key];
        if (value === defaultValue) return '';
        const valueStr = getValueStr(value);
        const defaultValueStr = getValueStr(defaultValue);
        if (!valueStr || valueStr === defaultValueStr) return '';
        return key + ' = ' + valueStr;
    })
    return strArr.join('\n')
}

/**
 * 根据样式类获取样式对象
 * @param allCls 所有的样式类映射
 * @param clsAry 实际样式类数组
 * @returns 样式对象
 */
function getClsStyle(allCls, clsAry) {
    let style = {};
    if (typeof clsAry === 'string') {
        clsAry = [clsAry];
    }
    if (Array.isArray(clsAry)) {
        clsAry.map(cls => {
            style = Object.assign(style, allCls[cls]);
        });
    }
    return style;
}

export {
    getObjectStr,
    getValueStr,
    getPropsFromObject,
    getClsStyle
}