import dump_内容展示检查 from './case-content-show-check/dump.json';

import { dumpPreview, enhancedIt } from '@/../cypress/tools';

describe('按钮', () => {
  enhancedIt('各种事件触发检查', () => {
    // 加载测试页面
    dumpPreview(dump_内容展示检查, [
      {
        selector: 'div',
        text: '平台给商家开票常见问题'
      }
    ]);
    // 截图对比
    cy.compareSnapshot('富文本展示_内容展示检查');
  });
});
