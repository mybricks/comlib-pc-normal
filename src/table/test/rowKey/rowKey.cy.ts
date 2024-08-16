import dump from './dump.json';
import { dumpPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

describe('数据表格-唯一key优化', () => {
  enhancedIt('各种 output 检查', () => {
    dumpPreview(dump);
    cy.compareSnapshot('数据表格_老页面唯一key优化后升级');
  });
});
