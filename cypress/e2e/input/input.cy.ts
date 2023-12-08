import dump from './dump.json';
import { dumpPreview } from '../../tools';

describe('按钮事件测试', () => {
  beforeEach(() => {
    dumpPreview(dump);
  });

  it('单击', () => {
    // 找到输入框输入 test 并按下回车
    cy.get('.ant-input-affix-wrapper .ant-input')
      .click()
      .type('test{enter}')
      .should('have.value', 'test')
      .blur();

    cy.window().then((win) => {
      expect(win.checklist).to.deep.eq([
        '值初始化',
        '值更新',
        '值更新',
        '值更新',
        '值更新',
        '按下回车',
        '失去焦点'
      ]);
    });
  });
});
