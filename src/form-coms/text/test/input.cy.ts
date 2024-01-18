import toJSON from './toJSON.json';
import { toJSONPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

/**
 * 如果有复杂的场景，可以单独一个 it，甚至单独一个 toJSON
 */
describe('文本框', () => {
  enhancedIt('各种 output 检查', () => {
    // 加载测试页面
    toJSONPreview(toJSON);

    // 找到输入框输入 test 并按下回车，结果通过 eventCheck 来判断
    cy.get('[placeholder=事件检查]')
      .click()
      .type('test{enter}')
      .should('have.value', 'test')
      .blur();

    // 判断事件是否按照预期触发了
    eventCheck([
      {
        id: '校验',
        value: {
          validateStatus: 'error',
          help: '内容不能为空'
        }
      },
      {
        id: '值更新',
        value: 't'
      },
      {
        id: '值更新',
        value: 'te'
      },
      {
        id: '值更新',
        value: 'tes'
      },
      {
        id: '值更新',
        value: 'test'
      },
      {
        id: '按下回车',
        value: 'test'
      },
      {
        id: '失去焦点',
        value: 'test'
      }
    ]);
  });

  enhancedIt('各种 input 检查', () => {
    // 加载测试页面
    toJSONPreview(toJSON);

    // 测试设置值、设置初始值
    cy.get('[placeholder=设置值]').should('have.value', '[设置值]');
    cy.get('[placeholder=设置初始值]').should('have.value', '[设置初始值]');

    // 测试获取值、重置值，结果通过 eventCheck 来判断
    cy.get('[placeholder=获取值、重置值]').type('键入一些文本');
    cy.contains('button', '获取值').click();
    cy.contains('button', '重置值').click();
    cy.contains('button', '获取值').click();

    // 判断事件是否按照预期触发了
    eventCheck([
      {
        id: '校验',
        value: {
          validateStatus: 'error',
          help: '内容不能为空'
        }
      },
      {
        id: '获取值',
        value: '键入一些文本'
      },
      {
        id: '获取值',
        value: undefined
      }
    ]);

    // 测试动态设置字体颜色
    cy.get('[placeholder=设置字体颜色]')
      .should('have.value', '[设置字体颜色]')
      .should('have.css', 'color')
      .and('eq', 'rgb(255, 0, 0)');

    // 测试自定义校验，回车触发校验
    cy.get('[placeholder=设置校验结果]').type('{enter}');
    cy.contains('div', '[设置校验结果]');

    // 测试两种动态禁用方式
    cy.contains('button', '禁用').click();
    cy.get('[placeholder=禁用、启用]').should('be.disabled');

    cy.contains('button', '启用').click();
    cy.get('[placeholder=禁用、启用]').should('not.be.disabled');

    cy.contains('button', '禁用2').click();
    cy.get('[placeholder=禁用、启用]').should('be.disabled');

    cy.contains('button', '启用2').click();
    cy.get('[placeholder=禁用、启用]').should('not.be.disabled');

    cy.compareSnapshot('文本框_各种input检查');
  });
});
