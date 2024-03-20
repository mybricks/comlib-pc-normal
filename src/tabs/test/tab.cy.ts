import { dumpPreview, enhancedIt } from '@/../cypress/tools';
import dynamicTabs from './case/dynamic-tabs.json';

describe('Tabs', () => {
  enhancedIt('动态tabs', () => {
    dumpPreview(dynamicTabs, []);
    cy.compareSnapshot('动态tabs');
  });
});
