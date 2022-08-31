const DEFAULT_TEMPLATE_RENDER_KEY = 'record';

function templateRender(template: string, templateRenderKey: string) {
  return template.replace(/\{(.*?)\}/g, (match, key) => `${templateRenderKey}.${key.trim()}`);
}

function getTemplateRenderScript(template: string, noCatch?: boolean, templateRenderKey?: string) {
  templateRenderKey = templateRenderKey || DEFAULT_TEMPLATE_RENDER_KEY;
  let evalScript = `
      (function(${templateRenderKey}) {
        try {
          return ${templateRender(template, templateRenderKey)}
        } catch(ex) {
          console.error(ex)
        }
      })
    `;
  if (noCatch) {
    evalScript = `
      (function(${templateRenderKey}) {
        return ${templateRender(template, templateRenderKey)}
      })
    `;
  }
  return evalScript;
}
const runScript = (scriptStr: string, args?: any, templateRenderKey?: string) => {
  let isBoolean = true;
  if (scriptStr) {
    try {
      isBoolean = eval(getTemplateRenderScript(scriptStr, true, templateRenderKey))(args);
    } catch (e) {
      return {
        error: [
          {
            message: (e as unknown as Error)?.message,
            startLineNumber: 0,
            endLineNumber: `${scriptStr}`.split('\n').length + 1,
            length: scriptStr.length + 1
          }
        ]
      };
    }
  }
  if (typeof isBoolean !== 'boolean') {
    return {
      error: [
        {
          message: '表达式结果需要是 布尔类型',
          startLineNumber: 0,
          endLineNumber: `${scriptStr}`.split('\n').length + 1,
          length: scriptStr.length + 1
        }
      ]
    };
  }
  return { success: true };
};
export { templateRender, getTemplateRenderScript, runScript };
