import dump_选项后置插槽 from './case-选项后置插槽/dump.json';
import { dumpPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

describe('下拉框', () => {
  enhancedIt('选项后置插槽', () => {
    // 加载测试页面
    dumpPreview(dump_选项后置插槽);

    cy.get('div#u_AIZTi').click()
    cy.contains('button', '1').click()
    cy.get('div#u_AIZTi').click()
    cy.contains('button', '0').click()

    // 判断事件是否按照预期触发了
    eventCheck([
      {
        "id": "当前选项",
        "value": {
          "label": "选项2",
          "value": 2
        }
      },
      {
        "id": "当前选项",
        "value": {
          "label": "选项1",
          "value": 1
        }
      },
    ]);

    // 截图对比
    cy.compareSnapshot('下拉框_选项后置插槽');
  });
});
