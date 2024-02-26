import dump from './dump.json';
import { enhancedIt, dumpPreview } from '@/../cypress/tools';

describe('动态设置布局风格', () => {
  enhancedIt('各种 output 检查', () => {
    dumpPreview(dump, [
      {
        selector: 'tbody',
        text: '紧凑布局1'
      },
      {
        selector: 'tbody',
        text: '适中布局1'
      },
      {
        selector: 'tbody',
        text: '默认1'
      }
    ]);
    cy.compareSnapshot('数据表格_动态设置布局风格');
  });
});
