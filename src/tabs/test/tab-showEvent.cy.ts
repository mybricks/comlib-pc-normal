import { dumpPreview, enhancedIt, eventCheck } from '@/../cypress/tools';
import tabShowEvent from './case/tab-showEvent.json';

describe('Tabs', () => {
  enhancedIt('tab显示事件', () => {
    dumpPreview(tabShowEvent);
    cy.contains('span', '标签页2').click();
    cy.contains('span', '标签页1').click();
    eventCheck([
      {
        id: 'show',
        value: 1
      },
      {
        id: 'hide',
        value: 1
      },
      {
        id: 'show',
        value: 1
      }
    ]);
  });
});
