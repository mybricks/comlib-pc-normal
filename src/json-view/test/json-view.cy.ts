import dump_各种事件触发检查 from './case-各种事件触发检查/dump.json';
import { dumpPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

describe('JSON展示', () => {
  enhancedIt('各种事件触发检查', () => {
    // 加载测试页面
    dumpPreview(dump_各种事件触发检查, [
      {
        selector: 'span',
        text: '{}'
      }
    ]);

    cy.contains('span', '{...}').click();
    cy.contains('textarea', 'result').click();
    cy.contains('textarea', 'result').trigger('paste');
    // cy.window().then(win => {

    // win.navigator.clipboard.readText().then((text) => {
    //   expect(text).to.eq('{"a":"1","b":"2","c":{"ca":21,"cb":22}}');
    // });
    // cy.wrap(win.navigator.clipboard.readText()).should('equal', '{"a":"1","b":"2","c":{"ca":21,"cb":22}}');
    // })

    cy.contains('span', 'a').click();
    // cy.window().then(win => {
    //   // 获取剪贴板数据
    //   let clipboardData = clipboardy.readSync();
    //   expect(clipboardData).to.equal('1')
    // })

    cy.contains('span', 'b').click();
    // cy.window().then(win => {
    //   // 获取剪贴板数据
    //   let clipboardData = clipboardy.readSync();
    //   expect(clipboardData).to.equal('2')
    // })

    cy.contains('span', 'c').click();
    // cy.window().then(win => {
    //   // 获取剪贴板数据
    //   let clipboardData = clipboardy.readSync();
    //   expect(clipboardData).to.equal('{"ca":21,"cb":22}')
    // })

    cy.contains('span', 'ca').click();
    // cy.window().then(win => {
    //   // 获取剪贴板数据
    //   let clipboardData = clipboardy.readSync();
    //   expect(clipboardData).to.equal('21')
    // })

    cy.contains('span', 'cb').click();
    // cy.window().then(win => {
    //   // 获取剪贴板数据
    //   let clipboardData = clipboardy.readSync();
    //   expect(clipboardData).to.equal('22')
    // })

    cy.contains('span', 'test').click();
    // cy.window().then(win => {
    //   // 获取剪贴板数据
    //   let clipboardData = clipboardy.readSync();
    //   expect(clipboardData).to.equal('"1"')
    // })

    // 判断事件是否按照预期触发了
    eventCheck([
      {
        "id": "单击节点",
        "value": {
          "a": "1",
          "b": "2",
          "c": {
            "ca": 21,
            "cb": 22
          }
        }
      },
      {
        "id": "单击节点",
        "value": "1"
      },
      {
        "id": "单击节点",
        "value": "2"
      },
      {
        "id": "单击节点",
        "value": {
          "ca": 21,
          "cb": 22
        }
      },
      {
        "id": "单击节点",
        "value": 21
      },
      {
        "id": "单击节点",
        "value": 22
      }
    ]);

    // 截图对比
    cy.compareSnapshot('JSON展示_各种事件触发检查');
  });
});
