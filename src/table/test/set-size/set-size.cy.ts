import dump from './dump.json';
import { enhancedIt, dumpPreview } from '@/../cypress/tools';

describe('动态设置布局风格', () => {
  enhancedIt('各种 output 检查', () => {
    dumpPreview(dump);
    cy.compareSnapshot('数据表格_动态设置布局风格');
  });
});
