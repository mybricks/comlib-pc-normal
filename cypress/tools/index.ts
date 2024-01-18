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
 */
export function dumpPreview(dump: Record<string, unknown>) {
  // 加载空白页面
  cy.visit(`http://localhost:${getPort()}`);

  cy.get('[data-mybricks-tip*=调试工具]').click();

  // 使用 navigator.clipboard.writeText 将内容复制到剪切板
  cy.window().then(async (win) => {
    await win.navigator.clipboard
      .writeText(JSON.stringify(dump))
      .then(() => {
        // 复制成功后的操作
        cy.log('内容已成功复制到剪切板');
      })
      .catch((err) => {
        // 复制失败时的操作
        cy.log('复制到剪切板时出错:', err);
      });
  });

  cy.contains('从剪切板中导入').click();

  cy.wait(300);

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
