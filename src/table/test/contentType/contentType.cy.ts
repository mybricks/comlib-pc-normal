import dump from './dump.json';
import { enhancedIt, dumpPreview } from '@/../cypress/tools';

describe('列嵌套', () => {
  enhancedIt('各种 样式 检查', () => {
    dumpPreview(dump);
    cy.compareSnapshot('数据表格_列嵌套');
  });
});
