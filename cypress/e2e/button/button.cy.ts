import dump from './dump.json';
import { dumpPreview, eventCheck } from '../../tools';

describe('按钮测试', () => {
  beforeEach(() => {
    dumpPreview(dump);
  });

  it('各种事件触发检查', () => {
    // 找到包含文本“单击按钮”的按钮组件并单击
    cy.contains('button', '单击按钮').click();

    // 找到包含文本“双击按钮”的按钮组件并双击
    cy.contains('button', '双击按钮').dblclick();

    eventCheck(['单击', '双击']);
  });

  it('截图比对', () => {
    cy.compareSnapshot("按钮");
  });
});
