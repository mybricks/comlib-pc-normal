const RENDER_KEY = 'value';

export const templateRender = (template: string) => {
  return template.replace(/\{(.*?)}/g, (match, key) => `${RENDER_KEY}.${key.trim()}`);
};

export const getRenderScript = (template: string) => {
  const evalScript = `
    (function(${RENDER_KEY}) {
      try {
        return ${templateRender(template)}
      } catch(ex) {
        console.error(ex)
      }
    })
  `;
  return evalScript;
};
