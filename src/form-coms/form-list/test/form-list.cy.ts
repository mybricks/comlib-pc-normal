import dump_表单项标题配置检查 from './case-表单项标题配置/dump.json';
import dump_设置动态表单项禁用启用检查 from './case-disable-form-list/dump.json';

import { dumpPreview, enhancedIt } from '@/../cypress/tools';

describe('动态表单项', () => {
  enhancedIt('动态表单项_表单项标题配置', () => {
    // 加载测试页面
    dumpPreview(dump_表单项标题配置检查);

    cy.contains('button', '添加一项').click();

    // 截图对比
    cy.compareSnapshot('动态表单项_表单项标题配置');
  });

  enhancedIt('动态表单项添加多项后，删除再禁用', () => {
    // 加载测试页面
    dumpPreview(dump_设置动态表单项禁用启用检查);
    // 添加一项
    cy.contains('button', '添加一项').click();
    cy.contains('button', '添加一项').click();
    cy.contains('button', '添加一项').click();


    cy.get('div#u_Y4IsW').children('div').eq(2).contains('button', '删除').click()

    cy.contains('button', '禁用').click()

    // 截图对比
    cy.compareSnapshot('动态表单项_设置禁用');
});
});
