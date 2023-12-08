/** 使用 dump 并打开预览页 */
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
