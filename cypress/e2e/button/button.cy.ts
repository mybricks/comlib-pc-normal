import dump from './dump.json';
import { dumpPreview } from '../../tools';

describe('按钮事件测试', () => {
  beforeEach(() => {
    dumpPreview(dump);
  });

  it('单击', () => {
    // 找到包含文本“单击按钮”的按钮组件并单击
    cy.contains('button', '单击按钮').click();

    // 等待消息气泡出现，这里假设消息气泡使用 class 名称为 "message-bubble"
    cy.get('.ant-message-notice').should('be.visible');

    // 检查消息气泡中的文本内容
    cy.get('.ant-message-notice').should('contain.text', '单击提示');
  });

  it('双击', () => {
    // 找到包含文本“双击按钮”的按钮组件并双击
    cy.contains('button', '双击按钮').dblclick();

    // 等待消息气泡出现，这里假设消息气泡使用 class 名称为 "message-bubble"
    cy.get('.ant-message-notice').should('be.visible');

    // 检查消息气泡中的文本内容
    cy.get('.ant-message-notice').should('contain.text', '双击提示');
  });
});
