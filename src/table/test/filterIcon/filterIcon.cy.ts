import dump from './dump.json';
import { enhancedIt, dumpPreview } from '@/../cypress/tools';

describe('筛选图标静动态配置', () => {
  enhancedIt('筛选图标静动态配置', () => {
    dumpPreview(dump);
    cy.compareSnapshot('数据表格_筛选图标静动态配置');
  });
});
