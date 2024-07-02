import dump_表单项自定义标题检查 from './case-表单项自定义标题/dump.json';
import dump_校验表单项完成输出检查 from './case-校验表单项完成输出/dump.json';
import { dumpPreview, enhancedIt, eventCheck } from '@/../cypress/tools';

describe('表单容器', () => {
  enhancedIt('表单项自定义标题', () => {
    // 加载测试页面
    dumpPreview(dump_表单项自定义标题检查);

    // 截图对比
    cy.compareSnapshot('表单容器_表单项自定义标题');
  });

  enhancedIt('校验表单项完成输出', () => {
    // 加载测试页面
    dumpPreview(dump_校验表单项完成输出检查);

    cy.contains('button', '添加').click();
    cy.contains('button', '添加').click();
    cy.get('div#u_XI0Vu input').focus().type('123');
    cy.contains('button', '添加').click();
    cy.contains('button', '添加').click();
    cy.get('div#u_XI0Vu input[value=""]').focus().type('456');
    cy.contains('button', '添加').click();
    cy.contains('button', '添加').click();

    // 判断事件是否按照预期触发了
    eventCheck([
      {
        id: '校验表单项输出',
        value: {
          validateStatus: 'success'
        }
      },
      {
        id: '校验表单项输出',
        value: {
          validateStatus: 'error',
          help: '内容不能为空',
          index: 0,
          subName: 'name2',
          name: '动态表单项'
        }
      },
      {
        id: '校验表单项输出',
        value: {
          validateStatus: 'success'
        }
      },
      {
        id: '校验表单项输出',
        value: {
          validateStatus: 'error',
          help: '内容不能为空',
          index: 1,
          subName: 'name2',
          name: '动态表单项'
        }
      },
      {
        id: '校验表单项输出',
        value: {
          validateStatus: 'success'
        }
      },
      {
        id: '校验表单项输出',
        value: {
          validateStatus: 'error',
          help: '内容不能为空',
          index: 2,
          subName: 'name2',
          name: '动态表单项'
        }
      }
    ]);

    // 截图对比
    cy.compareSnapshot('表单容器_校验表单项完成输出');
  });
});
