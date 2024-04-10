import dump_表单项自定义标题检查 from './case-表单项自定义标题/dump.json';
import { dumpPreview, enhancedIt } from '@/../cypress/tools';

describe('表单容器', () => {
  enhancedIt('表单项自定义标题', () => {
    // 加载测试页面
    dumpPreview(dump_表单项自定义标题检查, [
      {
        selector: 'div#u_h9UtT',
        text: '提交'
      },
      {
        selector: 'div#u_nJj1k',
        text: '提交'
      },
      {
        selector: 'div#u_Im9_s',
        text: '提交'
      },
    ]);

    // 截图对比
    cy.compareSnapshot('表单容器_表单项自定义标题');
  });
});
