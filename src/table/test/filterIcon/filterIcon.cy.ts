import dump from './dump.json';
import { enhancedIt, dumpPreview } from '@/../cypress/tools';

describe('筛选图标静动态配置', () => {
  enhancedIt('筛选图标静动态配置', () => {
    dumpPreview(dump, [
      {
        selector: 'tbody',
        text: '列11'
      },
      {
        selector: 'div',
        text: '请添加列或连接数据源'
      },
    ]);
    cy.compareSnapshot('数据表格_筛选图标静动态配置');
  });
});
