const SupportType = ['Array', 'Object'];

const isSameInputType = (inputs) => {
    const [first, ...rest] = inputs;
    let type = getType(first);
    if (!type || !SupportType.includes(type)) return;
    const isSame = Object.values(rest).every((item) => {
        return getType(item) === type;
    });
    return isSame ? type : null;
};

const getType = (obj) => {
    return Object.prototype.toString.call(obj).match(/\[object (.*)\]/)?.[1];
};

const arrayMerge = (inputs) => {
    const ret = new Set(
        inputs.reduce((pre = [], cur) => {
            return [...pre, ...cur];
        }, [])
    );
    return Array.from(ret);
};

const objMerge = (inputs) => {
    const ret = inputs.reduce((pre = {}, cur) => {
        return { ...pre, ...cur };
    }, {});
    return ret;
};

// 获取输入项序号
function getInputOrder({ input }) {
    const ports = input.get();
    const { id } = ports?.pop?.() || {};
    return (Number(id.slice(5)) || 0) + 1;
}

// 获取输出schema
function getOutputSchema(input) {
    const res = {};
    const inputList = input.get();
    (inputList || []).forEach((item) => {
        const schema = input.get(item?.id)?.schema;
        Object.assign(res, schema?.properties);
    });
    return {
        type: 'object',
        properties: res
    };
}

export {
    isSameInputType,
    getType,
    arrayMerge,
    objMerge,
    getInputOrder,
    getOutputSchema
}