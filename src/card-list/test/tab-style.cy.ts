import { dumpPreview, enhancedIt } from '@/../cypress/tools';
import dynamicTabs from './case/tab-style.json';

describe('Tabs 样式配置', () => {
  // 这个测试用例主要测试升级脚本
  enhancedIt('卡片字体样式配置', () => {
    dumpPreview(dynamicTabs);
    // 等待动画执行完成再截图
    cy.wait(300)
    cy.compareSnapshot('卡片字体样式配置');
  });
});
