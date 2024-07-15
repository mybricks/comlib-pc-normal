import toJSON from './dump.json';
import { dumpPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

function selectAndCheckTransferItems(selectedItems: number[]) {
  // 根据传入的selectedItems数组，依次选择穿梭框中的项
  selectedItems.forEach((itemIndex) => {
    cy.get('.ant-transfer-list-content-item input').eq(itemIndex).click();
  });
}

/**
 * 如果有复杂的场景，可以单独一个 it，甚至单独一个 toJSON
 */
describe('穿梭框', () => {
  enhancedIt('onSelectChange事件输出检查', () => {
    // 加载测试页面
    dumpPreview(toJSON);

    selectAndCheckTransferItems([1, 4, 8]);
    cy.get('.ant-transfer-operation .ant-btn:first-child').eq(0).click();
    selectAndCheckTransferItems([7, 8, 9]);

    // 判断事件是否按照预期触发了
    eventCheck([
      {
        id: 'output',
        value: {
          sourceSelectedKeys: ['4xJ5iw'],
          targetSelectedKeys: []
        }
      },
      {
        id: 'output',
        value: {
          sourceSelectedKeys: ['4xJ5iw', 't2zD3j'],
          targetSelectedKeys: []
        }
      },
      {
        id: 'output',
        value: {
          sourceSelectedKeys: ['4xJ5iw', 't2zD3j', 'bpf4HY'],
          targetSelectedKeys: []
        }
      },
      {
        id: 'output',
        value: {
          sourceSelectedKeys: [],
          targetSelectedKeys: []
        }
      },
      {
        id: 'output',
        value: {
          sourceSelectedKeys: [],
          targetSelectedKeys: ['4xJ5iw']
        }
      },
      {
        id: 'output',
        value: {
          sourceSelectedKeys: [],
          targetSelectedKeys: ['4xJ5iw', 't2zD3j']
        }
      },
      {
        id: 'output',
        value: {
          sourceSelectedKeys: [],
          targetSelectedKeys: ['4xJ5iw', 't2zD3j', 'bpf4HY']
        }
      }
    ]);
  });
});
