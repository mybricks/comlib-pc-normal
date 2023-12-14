import toJSON from './toJSON.json';
import { toJSONPreview, eventCheck } from '@/../cypress/tools';

describe('文本框', () => {
  beforeEach(() => {
    toJSONPreview(toJSON);
  });

  it('各种事件触发检查', () => {
    // 找到输入框输入 test 并按下回车
    cy.get('.ant-input-affix-wrapper .ant-input')
      .click()
      .type('test{enter}')
      .should('have.value', 'test')
      .blur();

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

  it('截图比对', () => {
    cy.compareSnapshot('文本框');
  });
});
