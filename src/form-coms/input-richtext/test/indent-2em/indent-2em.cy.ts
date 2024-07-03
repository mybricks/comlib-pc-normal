import dump from './dump.json';
import { dumpPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

describe('富文本输入', () => {
  enhancedIt('首行缩进2em', () => {
    // 加载测试页面
    dumpPreview(dump);

    cy.get('iframe[id^="_pceditor_tinymce"]').should('be.visible')
    cy.get('iframe[id^="_pceditor_tinymce"]').should('be.visible').then(($iframe) => {
      const iframeDocument = $iframe.contents().find('body')[0].ownerDocument!;
      const iframeBody = $iframe.contents().find('body');

      // 找到可编辑的 body
      cy.wrap(iframeBody).then(($editable) => {
        // @ts-ignore 聚焦到可编辑区域
        $editable[0].focus();

        // 全选内容
        // 创建一个 Range 对象
        const range = iframeDocument.createRange();
        range.selectNodeContents($editable[0]);

        // 创建一个 Selection 对象
        const selection = iframeDocument.getSelection()!;
        selection.removeAllRanges();
        selection.addRange(range);
      });

      cy.get('button[aria-label="首行缩进"]').click();

    });

    // 截图对比
    cy.compareSnapshot('富文本输入_首行缩进2em');
  });
});
