/**
 * 使用 dump 并打开预览页
 *
 * TODO: 优化导入 dump 的方式
 */
export function dumpPreview(dump: Record<string, unknown>) {
  // 加载空白页面
  cy.visit('http://localhost:8080');
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

  cy.visit('http://localhost:8080/preview.html');
}

/**
 * 判断事件触发是否符合预期
 * @param expected 预期的事件触发ID列表
 * @example
 * eventCheck(['单击', '双击'])
 */
export function eventCheck(expected: string[]) {
  cy.window().then((win) => {
    expect(win.checklist).to.deep.eq(expected);
  });
}
