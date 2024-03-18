import dump_禁用态编辑区可滚动 from './dump.json';
import { dumpPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

describe('按钮', () => {
  enhancedIt('禁用态编辑区可滚动', () => {
    // 加载测试页面
    dumpPreview(dump_禁用态编辑区可滚动, [
      {
        selector: 'div',
        text: '正文'
      }
    ]);

    cy.get('iframe[id^="_pceditor_tinymce"]')
      .should('be.visible')
      .then((iframe) => {
        cy.wrap(iframe.contents().find('html'))
          .should('contain', '666')
          .then(() => {
            cy.wrap(iframe.contents().find('html'))
              .its('0.scrollHeight')
              .should('be.gte', 500)
              .then(() => {
                // 尝试滚动到底部
                cy.wrap(iframe.contents().find('html')).invoke('0.scrollTo', 0, 2603);
              });
          });
      });

    // 截图对比
    cy.compareSnapshot('富文本输入_禁用态编辑区可滚动');
  });
});
