const getCodeFromTemplate = (template: string) => {
  const code = template.match(/(?<=\{)(.+?)(?=\})/g)
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