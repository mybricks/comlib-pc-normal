import { cloneDeep } from 'lodash';
export { default as enhancedIt } from './enhanced-it';

export function getPort() {
  return Cypress.env('port') || 8080;
}

/**
 * 使用 dump 并打开预览页
 *
 * TODO: 优化导入 dump 的方式
 * 最好是有 dump => toJSON 的函数，这样就不用到搭建页面获取 toJSON 了
 *
 * @param dump
 * @param updateQueries 需要更新的元素列表 (因为是模拟点击“升级全部”按钮，所以同一种元素只需要一个)
 */
export function dumpPreview(dump: Record<string, unknown>) {
  // 加载空白页面
  cy.visit(`http://localhost:${getPort()}`, {
    onBeforeLoad(win) {
      cy.stub(win, 'open', url => {
        // change window location to be same as the popup url
        win.location.href = Cypress.config().baseUrl + url;
      }).as("popup") // alias it with popup, so we can wait refer it with @popup
    },
  });

  cy.get('[data-mybricks-tip*=调试工具]');

  // 打开用于导入 dump 的后门面板
  cy.window().then(async (win) => {
    const menuBtn = win.document.querySelector(
      `div[data-mybricks-tip*="不展示"]`
    ) as HTMLDivElement;
    menuBtn.click();
  });

  cy.get('#loadContentPlugin-textarea');

  cy.window().then(async (win) => {
    const textarea = win.document.querySelector(
      '#loadContentPlugin-textarea'
    ) as HTMLTextAreaElement;
    const button = win.document.querySelector('#loadContentPlugin-button') as HTMLButtonElement;
    const menuBtn = win.document.querySelector(
      `div[data-mybricks-tip*="不展示"]`
    ) as HTMLDivElement;

    // 导入 dump
    textarea.value = JSON.stringify(dump);
    button.click();

    // 关闭用于导入 dump 的后门面板
    menuBtn.click();
  });

  cy.log('尝试寻找升级全部按钮');
  cy.get('#_mybricks-geo-webview_').click();
  cy.get('button').then($buttons => {
    const $targetButton = $buttons.filter((index, button) => Cypress.$(button).text().includes('升级全部'));
    if ($targetButton.length > 0) {
      cy.wrap($targetButton).click();
      cy.log('点击了升级全部按钮');
    }
  });

  cy.wait(1000)

  cy.contains('预览').click();

  cy.visit(`http://localhost:${getPort()}/preview.html`);
}

/**
 * 使用 toJSON 并打开预览页
 */
export function toJSONPreview(toJSON: Record<string, unknown>) {
  // 加载空白页面
  cy.visit(`http://localhost:${getPort()}`);

  cy.window().then((win) => win.localStorage.setItem('--preview--', JSON.stringify(toJSON)));

  cy.visit(`http://localhost:${getPort()}/preview.html`);
}

/**
 * 判断事件触发是否符合预期
 * @param expected 预期的事件触发ID列表
 * @example
 * [
 *   {
 *     id: '单击',
 *     value: 0
 *   },
 *   {
 *     id: '双击',
 *     value: 0
 *   }
 * ]
 * 可以直接从控制台复制 checklist 对象来作为参数
 */
export function eventCheck(expected: Window['checklist']) {
  cy.wait(300)

  const _expected = convertFunctionsToStrings(cloneDeep(expected));

  cy.window().then((win) => {
    const _checklist = convertFunctionsToStrings(cloneDeep(win.checklist));
    expect(_checklist).to.deep.eq(_expected);
  });
}

/**
 * 把对象中所有的函数转换为字符串表示
 * @param obj 要处理的对象
 */
function convertFunctionsToStrings(obj: unknown) {
  // 如果 obj 是函数，将其转换为字符串表示
  if (typeof obj === 'function') {
    return obj.toString();
  }

  // 如果 obj 是对象，递归处理对象的所有属性
  if (typeof obj === 'object') {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = convertFunctionsToStrings(obj[key]);
      }
    }
  }

  return obj;
}
