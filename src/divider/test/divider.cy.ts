import dump from './case-各种静态配置检查/dump.json';
import { dumpPreview, enhancedIt } from '@/../cypress/tools';

describe('分割线', () => {
  enhancedIt('各种静态配置检查', () => {
    // 加载测试页面
    dumpPreview(dump);

    // 截图对比
    cy.compareSnapshot('分割线_各种静态配置检查');
  })
});
