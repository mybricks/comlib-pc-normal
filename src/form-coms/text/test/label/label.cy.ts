import dump from './dump.json';
import { dumpPreview, enhancedIt } from '@/../cypress/tools';

const checkMinWidth = (text: string, minWidth: number | string) => {
  cy.contains('span', text).then(($span1) => {
    const style1 = $span1.css('min-width');
    expect(style1).to.equal(minWidth);
  });
}

describe('文本框-前、后置标签', () => {
  enhancedIt('样式 检查 min-width', () => {
    dumpPreview(dump, []);

    checkMinWidth('111', '100px');
    checkMinWidth('222', '100px');

    cy.compareSnapshot('文本框-前、后置标签检查');
  });
});
