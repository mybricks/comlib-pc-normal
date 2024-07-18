import { dumpPreview, enhancedIt, eventCheck } from '@/../cypress/tools';
import dumpJson from './dump.json';

describe('dropdown', () => {
  enhancedIt('dropdown 动态设置子项属性', () => {
    dumpPreview(dumpJson);
    cy.contains('div.ant-space-item', '下拉菜单').click();
    cy.get('li.ant-dropdown-menu-item-disabled')
      .and('be.visible')
      .should('have.length', 3)
      .each((el, index) => {
        cy.wrap(el)
          .find('span')
          .should('contain.text', index + 1);
      }); // 断言元素数量为3 且标签名分别为1,2,3
  });
});
