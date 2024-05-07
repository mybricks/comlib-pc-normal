import dump from './dump.json';
import withMultiCheckDump from './with-multi-check-dump.json'
import { enhancedIt, dumpPreview, eventCheck } from '@/../cypress/tools';
import { multiCheckCheckList } from './data'

describe('懒加载', () => {
  enhancedIt('基础能力检查', () => {
    dumpPreview(dump, [{ selector: 'tbody', text: 'a1' }]);

    cy.get('div.ant-table-body').should('have.prop', 'scrollHeight', 940);
    cy.get('div.ant-table-body').scrollTo('bottom')
    cy.get('div.ant-table-body').should('have.prop', 'scrollHeight', 1880);
  });

  enhancedIt('搭配多选能力检查', () => {
    dumpPreview(withMultiCheckDump, [{ selector: 'tbody', text: 'a1' }]);

    cy.get("th.ant-table-cell.ant-table-selection-column input").click()

    cy.get('div.ant-table-body').should('have.prop', 'scrollHeight', 940);
    cy.get('div.ant-table-body').scrollTo('bottom')
    cy.get('div.ant-table-body').should('have.prop', 'scrollHeight', 1880);
    cy.get('div.ant-table-body').scrollTo('bottom')

    cy.compareSnapshot("数据表格_懒加载全选");

    // 选中137
    cy.get('tr:nth-child(39) > td.ant-table-cell.ant-table-selection-column input').click();
    // 选中138
    cy.get('tr:nth-child(40) > td.ant-table-cell.ant-table-selection-column input').click();
    // 取消选中138
    cy.get('tr:nth-child(40) > td.ant-table-cell.ant-table-selection-column input').click();
    // 全选
    cy.get("th.ant-table-cell.ant-table-selection-column input").click()
    // 取消全选
    cy.get("th.ant-table-cell.ant-table-selection-column input").click()

    eventCheck(multiCheckCheckList);
  });
});
