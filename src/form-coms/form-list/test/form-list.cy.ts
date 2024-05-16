import dump_表单项标题配置检查 from './case-表单项标题配置/dump.json';
import { dumpPreview, enhancedIt } from '@/../cypress/tools';

describe('动态表单项', () => {
  enhancedIt('动态表单项_表单项标题配置', () => {
    // 加载测试页面
    dumpPreview(dump_表单项标题配置检查, [
      {
        selector: 'div#u_9BHIF',
        text: '添加一项'
      }
    ]);

    cy.contains('button', '添加一项').click();

    // 截图对比
    cy.compareSnapshot('动态表单项_表单项标题配置');
  });
});
