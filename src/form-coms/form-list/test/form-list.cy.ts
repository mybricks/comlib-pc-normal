import dump_表单项标题配置检查 from './case-表单项标题配置/dump.json';
import dump_设置动态表单项禁用启用检查 from './case-disable-form-list/dump.json';
import dump_修改某项label校验和文案检查 from './case-modify-item-label/dump.json';
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

  enhancedIt('动态表单项修改每一项label，以及不修改检查', () => {
     // 加载测试页面
     dumpPreview(dump_修改某项label校验和文案检查);

    // 第一个修改标题的动态表单，添加一项
    // 检查label是否被修改
    cy.contains('button', '添加一项').click();
    cy.get('div#u_QtTzA').find('[class^="formItemSlotContent"]') 
    .first()      // 获取第一个匹配的元素
    .find('div#u_pva_r').find('.ant-form-item-label').contains('自助接单1')
    // 检查添加后，文本设置必填后，校验信息是否出现
    cy.get('div#u_QtTzA').find('[class^="formItemSlotContent"]')  
    .first() 
    .find('div#u_pva_r').find('div.ant-form-item-explain-error').contains('接单不能为空');
    // 
    cy.get('div#u_QtTzA').find('[class^="formItemSlotContent"]')      
    .first()      // 获取第一个匹配的元素
    .find('div#u_Fbb80').find('.ant-form-item-explain-error').contains('内容不能为空')

    cy.contains('button', '添加一项').click();

    // 第二个普通动态表单，添加一项
    cy.contains('button', '普通添加一项').click();
    cy.contains('button', '普通添加一项').click();

    // 截图对比
    cy.compareSnapshot('动态表单项_修改一项_添加校验');
  })

});
