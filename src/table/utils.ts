import { BLOCKS_KEY, TEMPLATE_RENDER_KEY } from './constants'
import { Data } from './types'

function getScratchScript(blocksOri) {
  const reg = new RegExp(`input0\\(\\(input0,_output\\)=>{`)
  let script = blocksOri.script || ''

  // .replaceAll('\\n', '')
  script = script.trim()
    .replace(reg, '')
    .replace(/}\)$/, '')

  const evalScript = `
    (function(colData) {
      try {
        const ${BLOCKS_KEY} = []
        ${script}
        return ${BLOCKS_KEY}
      } catch(ex) {
        console.error(ex)
        // throw new Error('Scratch组件发生错误.')
      }
    })
  `
  return evalScript
}

function templateRender(template: string) {
  return template.replace(/\{(.*?)\}/g, (match, key) => `${TEMPLATE_RENDER_KEY}.${key.trim()}`);
}

function getTemplateRenderScript(template: string) {
  const evalScript = `
    (function(${TEMPLATE_RENDER_KEY}) {
      try {
        return ${templateRender(template)}
      } catch(ex) {
        console.error(ex)
      }
    })
  `
  return evalScript
}

const getPageInfo = (data: Data) => {
  if (data.hasPagination) {
    return {
      [data.pageNumber || 'current']: data.pagination.current,
      [data.pageSize || 'pageSize']: data.pagination.pageSize,
    };
  }
}

//获取指定class的父节点
const getParentNodeByTag = (element: HTMLElement, tagName) => {
  const getParentNode = (element) => {
    if (!element || !element.tagName) {
      return;
    }
    if (element && element.tagName.toLowerCase() === tagName) {
      return element;
    } else {
      return getParentNode(element.parentElement);
    }
  };
  return getParentNode(element);
};

export {
  getScratchScript,
  templateRender,
  getTemplateRenderScript,
  getPageInfo,
  getParentNodeByTag
}