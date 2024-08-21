import dump from './dump.json';
import { dumpPreview, enhancedIt } from '@/../cypress/tools';

describe('步骤条-高度填充配置', () => {
  enhancedIt('各种静态检查', () => {
    dumpPreview(dump);
    cy.compareSnapshot('步骤条_高度填充配置');
  });
});
