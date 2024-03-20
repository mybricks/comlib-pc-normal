import dump_各种事件触发检查 from './case-各种事件触发检查/dump.json';
import { dumpPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

describe('JSON展示', () => {
  enhancedIt('各种事件触发检查', () => {
    // 加载测试页面
    dumpPreview(dump_各种事件触发检查, [
      {
        selector: 'div.ant-tree',
        text: '{}'
      }
    ]);

    cy.window().then(win => {
      let cnt = 0;
      win.document.addEventListener('copy', (e) => {
        cnt++;
        const curEl = e.target as HTMLElement;
        switch (cnt) {
          case 1:
            expect(curEl.innerHTML).eq('{"a":"1","b":"2","c":{"ca":21,"cb":22}}')
            break
          case 2:
            expect(curEl.innerHTML).eq('1')
            break
          case 3:
            expect(curEl.innerHTML).eq('2')
            break
          case 4:
            expect(curEl.innerHTML).eq('{"ca":21,"cb":22}')
            break
          case 5:
            expect(curEl.innerHTML).eq('21')
            break
          case 6:
            expect(curEl.innerHTML).eq('22')
            break
          case 7:
            expect(curEl.innerHTML).eq('"1"')
            break
        }
      }, true)
    })


    cy.contains('span', '{...}').click()

    cy.contains('span', 'a').click()

    cy.contains('span', 'b').click()

    cy.contains('span', 'c').click()

    cy.contains('span', 'ca').click()

    cy.contains('span', 'cb').click()

    cy.contains('span', 'test').click()

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
