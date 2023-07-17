
import { debounce, groupBy } from "lodash";
import { DOMElement, useEffect, useState } from "react"
import { uuid } from "../utils";

// 设计器中定义的移动端宽度
const CANVAS_MOBILE_WIDTH = 520
const MEDIA_CLASS_PREFIX = `media-class-`
const getShadowRoot = () => {
  const childNodes = document.querySelector("[class^='canvasTrans']")?.childNodes;
  return childNodes?.[0]?.shadowRoot
}

const creaetCssClassForRules = (rules: Array<CSSMediaRule>, root) => {
  const styleElement = document.createElement('style');
  const className = `${MEDIA_CLASS_PREFIX}${uuid()}`
  const innerCssText = rules.map(item => {
    return Array.from(item.cssRules).map(i => i.cssText).join('\n')
  }).join('\n')
  const cssText = `.${className} { ${innerCssText} }`;
  styleElement.textContent = cssText;

  // 将样式元素添加到文档头部
  root.appendChild(styleElement);
  return className
}

const getLinkStyleSheets = async (root) => {
  const linkElements = root.querySelectorAll('link');

  const cssUrls: string[] = [];
  for (const linkElement of linkElements) {
    if (linkElement.rel === 'stylesheet') {
      cssUrls.push(linkElement.href);
    }
  }
  return await Promise.all(cssUrls.map(url => {
    return fetch(url)
      .then(response => response.text())
      .then(cssText => {
        const styleSheet = new CSSStyleSheet();
        styleSheet.replaceSync(cssText);
        return styleSheet
      })
      .catch(error => {
        console.error('Error loading external CSS file:', error);
      });
  }))
}

const findMediaRules = (styleSheets: StyleSheetList | Array<CSSStyleSheet>) => {
  const mediaRules: any[] = []
  for (const styleSheet of Array.from(styleSheets)) {
    // 带有href属性的样式，无法被处理，有跨域限制
    if (!!styleSheet.href) continue
    const rules = styleSheet.cssRules || styleSheet.rules || [];
    if (rules.length === 0) continue;
    // 遍历每个规则
    for (const rule of rules) {
      // 检查是否是媒体查询规则
      if (rule instanceof CSSMediaRule) {
        mediaRules.push(rule)
      }
    }
  }

  return mediaRules
}


// 将媒体查询一致的rules放到一起，生成一个css类样式
const groupMediaClass = (rules: Array<CSSMediaRule>, root) => {
  const cache = groupBy(rules, rule => {
    return rule?.media?.mediaText
  })

  return Object.keys(cache).map(item => {
    const _rules = cache[item]
    return {
      mediaQuery: item,
      rules: _rules,
      className: creaetCssClassForRules(_rules, root)
    }
  })
}

const getMatchedMediaClass = (mediaWidth, mediaRulesWithClass) => {
  function isMediaMatch(mediaQueryString, mediaWidth) {
    var minWidthMatch = mediaQueryString.match(/\(min-width:\s*(\d+)px\)/);
    var maxWidthMatch = mediaQueryString.match(/\(max-width:\s*(\d+)px\)/);

    if (minWidthMatch || maxWidthMatch) {
      var minWidth = minWidthMatch ? parseInt(minWidthMatch[1]) : 0;
      var maxWidth = maxWidthMatch ? parseInt(maxWidthMatch[1]) : Infinity;
      return mediaWidth >= minWidth && mediaWidth <= maxWidth;
    }

    return false
  }

  return mediaRulesWithClass.filter(item => isMediaMatch(item.mediaQuery, mediaWidth)).map(item => item.className)
}

const resetMediaClass = (container: HTMLElement, classesToBeAdd: string[]) => {
  const classList = container.classList;

  // 遍历元素的 class 列表
  for (let i = classList.length - 1; i >= 0; i--) {
    const className = classList[i];
    if (className.startsWith(MEDIA_CLASS_PREFIX)) {
      classList.remove(className);
    }
  }

  classesToBeAdd.forEach(item => {
    classList.add(item)
  })
}

export default ({ env }) => {
  const [mediaRulesWithClass, setMediaRulesWithClass] = useState<any[]>([])
  // 媒体查询样式生成对应的类
  console.log('type', env?.canvas?.type)
  const root = getShadowRoot()
  useEffect(() => {
    const init = async () => {
      if (!root) return
      const linkSheets = await getLinkStyleSheets(root)
      //@ts-ignore
      const rules = findMediaRules([...linkSheets, ...Array.from(root.styleSheets)])
      const mediaRulesWithClass = groupMediaClass(rules, root)
      console.log('mediaRulesWithClass', mediaRulesWithClass)
      setMediaRulesWithClass(mediaRulesWithClass)
    }

    init()
  }, [])

  // 在尺寸变化时，挂载类样式到目标元素上（shadow dom下的第一个子元素）
  useEffect(() => {
    if (!root) return
    if (mediaRulesWithClass.length === 0) return

    let mediaWidth = env?.canvas?.type === 'mobile' ? CANVAS_MOBILE_WIDTH : 1200

    const matchedMediaClasses = getMatchedMediaClass(mediaWidth, mediaRulesWithClass)
    const container = root.querySelector("[class^='geoView']")
    if (!container) return
    resetMediaClass(container, matchedMediaClasses)
  }, [env?.canvas?.type, mediaRulesWithClass])
}