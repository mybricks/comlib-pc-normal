import dump_异步加载 from './case-异步加载/dump.json';
import dump_设置数据完成 from './case-设置数据完成/dump.json';
import dump_获取选中节点数据 from './case-获取选中节点数据/dump.json';
import { dumpPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

describe('树', () => {
  enhancedIt('异步加载', () => {
    // 加载测试页面
    dumpPreview(dump_异步加载, [
      {
        selector: 'div#u_II9_2',
        text: '0'
      }
    ]);

    cy.get('div[data-tree-node-id="1"] span.ant-tree-switcher').click();
    cy.get('div[data-tree-node-id="2"] span.ant-tree-switcher').click();
    cy.get('div[data-tree-node-id="3"] span.ant-tree-switcher').click();

    // 判断事件是否按照预期触发了
    eventCheck([
      {
        id: '异步加载事件',
        value: {
          id: 1,
          pId: 0,
          label: 'Expand to load'
        }
      },
      {
        id: '异步加载事件',
        value: {
          id: 2,
          pId: 0,
          label: 'Expand to load'
        }
      },
      {
        id: '异步加载事件',
        value: {
          id: 3,
          pId: 0,
          label: 'Expand to load(No children)',
          isLeaf: false
        }
      }
    ]);

    // 截图对比
    cy.compareSnapshot('树_异步加载');
  });
  enhancedIt('设置数据源', () => {
    // 加载测试页面
    dumpPreview(dump_设置数据完成, [
      {
        selector: 'div#u_yJfej',
        text: '暂无数据'
      }
    ]);

    // 截图对比
    cy.compareSnapshot('树_设置数据源');
  });

  enhancedIt('获取选中节点数据', () => {
    // 加载测试页面
    dumpPreview(dump_获取选中节点数据, [
      {
        selector: 'div#u_m91rD',
        text: '第一级 1'
      },
      {
        selector: 'div#u_cQeTF',
        text: '第一级1'
      }
    ]);
    // 配置了输出节点数据
    cy.get('div[data-tree-node-id="第一级 1"]').click();
    cy.contains('button', '按钮').click();
    cy.get('div[data-tree-node-id="叶子 1-1-2"]').click();
    cy.contains('button', '按钮').click();
    cy.get('div[data-tree-node-id="叶子 1-1-2"]').click();
    cy.contains('button', '按钮').click();

    // 配置了输出标识数据
    cy.get('div[data-tree-node-id="第一级1"]').click();
    cy.contains('button', '按钮').click();
    cy.get('div[data-tree-node-id="叶子1-1-2"]').click();
    cy.contains('button', '按钮').click();
    cy.get('div[data-tree-node-id="叶子1-1-2"]').click();
    cy.contains('button', '按钮').click();

    // 判断事件是否按照预期触发了
    eventCheck([
      {
          "id": "树1获取选中项",
          "value": []
      },
      {
          "id": "树2获取选中项",
          "value": [
              {
                  "key": "第一级 1",
                  "title": "第一级 1",
                  "children": [
                      {
                          "key": "第二级 1-1",
                          "title": "第二级 1-1",
                          "children": [
                              {
                                  "key": "叶子 1-1-1",
                                  "title": "叶子 1-1-1"
                              },
                              {
                                  "key": "叶子 1-1-2",
                                  "title": "叶子 1-1-2"
                              }
                          ]
                      },
                      {
                          "key": "第二级 1-2",
                          "title": "第二级 1-2",
                          "children": [
                              {
                                  "key": "叶子 1-2-1",
                                  "title": "叶子 1-2-1"
                              }
                          ]
                      }
                  ]
              }
          ]
      },
      {
          "id": "树1获取选中项",
          "value": []
      },
      {
          "id": "树2获取选中项",
          "value": [
              {
                  "key": "叶子 1-1-2",
                  "title": "叶子 1-1-2"
              }
          ]
      },
      {
          "id": "树1获取选中项",
          "value": []
      },
      {
          "id": "树2获取选中项",
          "value": []
      },
      {
          "id": "树1获取选中项",
          "value": [
              "第一级1"
          ]
      },
      {
          "id": "树2获取选中项",
          "value": []
      },
      {
          "id": "树1获取选中项",
          "value": [
              "叶子1-1-2"
          ]
      },
      {
          "id": "树2获取选中项",
          "value": []
      },
      {
          "id": "树1获取选中项",
          "value": []
      },
      {
          "id": "树2获取选中项",
          "value": []
      }
  ]);
  });
});
