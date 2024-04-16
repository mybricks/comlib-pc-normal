import dump from './dump.json';
import { enhancedIt, dumpPreview } from '@/../cypress/tools';

describe('动态设置布局风格', () => {
  enhancedIt('各种 output 检查', () => {
    dumpPreview(dump, [{ selector: 'tbody', text: 'a1' }]);
    
    cy.get('div.ant-table-body').should('have.prop', 'scrollHeight', 940);
    cy.get('div.ant-table-body').scrollTo('bottom')
    cy.get('div.ant-table-body').should('have.prop', 'scrollHeight', 1880);
  });
});
