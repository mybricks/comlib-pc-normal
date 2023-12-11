import dump from './dump.json';
import { dumpPreview, eventCheck } from '../../tools';

describe('按钮事件测试', () => {
  beforeEach(() => {
    dumpPreview(dump);
  });

  it('各种事件触发检查', () => {
    // 找到输入框输入 test 并按下回车
    cy.get('.ant-input-affix-wrapper .ant-input')
      .click()
      .type('test{enter}')
      .should('have.value', 'test')
      .blur();

    eventCheck(['值初始化', '值更新', '值更新', '值更新', '值更新', '按下回车', '失去焦点']);
  });
});
