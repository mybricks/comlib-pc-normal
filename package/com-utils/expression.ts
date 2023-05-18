const getCodeFromTemplate = (template: string) => {
  // const code = template.match(/(?<=\{)(.+?)(?=\})/g)
  
  // Safari 不支持正则表达式中的 lookbehind，可以改为使用捕获组来提取大括号内的内容：
  // 该代码在 Chrome 和 Safari 中都能够执行，并返回大括号内的内容列表。
  const code = template.match(/\{(.+?)\}/g)?.map(function (match) {
    return match.slice(1, -1);
  });

  return code ? code[0] : "";
};

const sandbox = (code: string) => {
  const fn = new Function("context",
    `with(context){
      if(typeof ${code} !== 'undefined'){
        return ${code}
      }else{
        return ''
      }
  }`);

  return function (context: any) {
    return fn(context);
  };
};

const runSuccess = (ret: any) => {
  return { success: ret };
};

const runFail = (err: any) => {
  return { error: err };
};

export const runExpression = (
  tpl: string,
  context: object
): { success?: any; error?: any } => {
  try {
    const code = getCodeFromTemplate(tpl);
    if (!code || code.endsWith(".")) {
      return runSuccess('');
    }
    const ret = sandbox(code)(context);
    if (typeof ret === 'undefined') {
      throw new Error(`${code} is not defined`);
    }
    return runSuccess(ret);
  } catch (error: any) {
    return runFail([
      {
        message: error?.message,
        startLineNumber: 0,
        endLineNumber: `${tpl}`.split("\n").length + 1,
        length: tpl.length + 1,
      },
    ]);
  }
};