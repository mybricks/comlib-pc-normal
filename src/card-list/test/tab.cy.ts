import { dumpPreview, enhancedIt } from '@/../cypress/tools';
import dynamicTabs from './case/dynamic-tabs.json';

describe('Tabs', () => {
  enhancedIt('动态tabs', () => {
    dumpPreview(dynamicTabs);
    // 等待动画执行完成再截图
    cy.wait(300)
    cy.compareSnapshot('动态tabs');
  });
});
