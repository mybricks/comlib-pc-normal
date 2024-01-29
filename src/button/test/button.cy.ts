import dump_各种事件触发检查 from './case-各种事件触发检查/dump.json';
import dump_各种静态配置检查 from './case-各种静态配置检查/dump.json';
import { dumpPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

describe('按钮', () => {
  enhancedIt('各种事件触发检查', () => {
    // 加载测试页面
    dumpPreview(dump_各种事件触发检查, [
      {
        selector: 'button',
        text: '单击按钮'
      }
    ]);

    // 找到包含文本“单击按钮”的按钮组件并单击
    cy.contains('button', '单击按钮').click();

    // 找到包含文本“双击按钮”的按钮组件并双击
    cy.contains('button', '双击按钮').dblclick();

    // 判断动态修改标题是否成功
    cy.contains('button', '动态修改标题(修改后)');

    // 判断动态设置禁用是否成功
    cy.contains('button', '动态设置禁用').should('be.disabled');

    // 判断事件是否按照预期触发了
    eventCheck([
      {
        id: '单击',
        value: 0
      },
      {
        id: '双击',
        value: 0
      }
    ]);

    // 截图对比
    cy.compareSnapshot('按钮_各种事件触发检查');
  });

  enhancedIt('各种静态配置检查', () => {
    // 加载测试页面
    dumpPreview(dump_各种静态配置检查, [
      {
        selector: 'button',
        text: '按钮'
      }
    ]);

    // 截图对比
    cy.compareSnapshot('按钮_各种静态配置检查');
  });
});
