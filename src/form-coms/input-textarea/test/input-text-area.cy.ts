import dump_获取光标位置 from './case-cursor-position/dump.json';

import { dumpPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

/**
 * 如果有复杂的场景，可以单独一个 it，甚至单独一个 toJSON
 */
describe('文本域', () => {
  enhancedIt('移动光标，获取光标位置检查', () => {
    // 加载测试页面
    dumpPreview(dump_获取光标位置);

    // 找到文本域，输入 Hello,World 并光标左移动两位，结果通过 eventCheck 来判断
    cy.get('div#u_IhihL textarea')
      .click()
      .type('Hello,world')
      .type('{leftarrow}{leftarrow}')
      .blur();
    cy.contains('button', '获取光标位置').click();


    // 文本域聚焦光标移到最后位置，再输入!!!,查看失焦后位置
    cy.get('div#u_IhihL textarea').focus().type("{end}").type('!!!').blur();
    cy.contains('button', '获取光标位置').click();

    // 判断事件是否按照预期触发了
    eventCheck([
      {
        id: '位置',
        value: 9
      },
      {
        id: '位置',
        value: 14
      },
    ]);
  });

});
