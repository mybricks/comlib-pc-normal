import dump from './dump.json';
import { dumpPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

// 点击表格行勾选
function clickRow(...rowKeys: number[]) {
  rowKeys.forEach((key: number) => {
    cy.get(`tr[data-row-key="${key}"]`).click();
  });
}

// 点击表格勾选框勾选
function clickRowCheckBox(...rowKeys: number[]) {
  rowKeys.forEach((key: number) => {
    cy.get(`tr[data-row-key="${key}"] .ant-checkbox-input`).click();
  });
}

// 点击分页
function clickPaginationItem(item: number) {
  cy.get(`.ant-pagination-item.ant-pagination-item-${item}`).click();
}

// 点击按钮并等待选中的复选框出现
function clickButtonAndWaitForCheckbox(buttonText: string, checkboxSelector?: string | undefined) {
  cy.contains('button', buttonText).click();
  if (checkboxSelector) {
    cy.get(checkboxSelector).should('be.visible');
  }
}

// 点击全选/取消全选操作
function toggleSelectAll() {
  return cy.get('th.ant-table-cell.ant-table-selection-column label').click();
}

// 检查勾选事件
function generateArray(length: number) {
  return Array.from({ length }).map((_, index) => index);
}

describe('数据表格-勾选', () => {
  enhancedIt('各种 output 检查', () => {
    dumpPreview(dump, [
      {
        selector: 'div',
        text: '已选中'
      }
    ]);

    // 勾选第一页的 key为 0, 1, 2, 4 的行，然后点击输出勾选数据按钮
    clickRow(0, 1, 2);
    clickRowCheckBox(4);
    clickButtonAndWaitForCheckbox('输出勾选数据');

    // 跳转到第二页，勾选 key为 10, 11, 12, 13 的行
    clickPaginationItem(2);
    clickRow(10, 11, 12);
    clickRowCheckBox(13);
    // 返回第一页，勾选 key为 5 的行
    clickPaginationItem(1);
    clickRow(5);
    clickRowCheckBox(3);

    // 点击输出勾选数据、清空勾选、输出勾选数据按钮
    clickButtonAndWaitForCheckbox('输出勾选数据');
    clickButtonAndWaitForCheckbox('清空勾选');
    clickButtonAndWaitForCheckbox('输出勾选数据');

    // 点击设置勾选项按钮，并检查是否有选中的复选框
    clickButtonAndWaitForCheckbox(
      '设置勾选项',
      'tr[data-row-key="0"] .ant-checkbox.ant-checkbox-checked'
    );

    // 再次点击输出勾选数据按钮
    clickButtonAndWaitForCheckbox('输出勾选数据');

    // 检查各种事件是否按照预期触发
    eventCheck([
      {
        id: '勾选事件',
        value: {
          selectedRows: [{ key: 0, l1: 0, l2: 0, l3: 0 }],
          selectedRowKeys: [0]
        }
      },
      {
        id: '勾选事件',
        value: {
          selectedRows: [
            { key: 0, l1: 0, l2: 0, l3: 0 },
            { key: 1, l1: 1, l2: 1, l3: 1 }
          ],
          selectedRowKeys: [0, 1]
        }
      },
      {
        id: '勾选事件',
        value: {
          selectedRows: [
            { key: 0, l1: 0, l2: 0, l3: 0 },
            { key: 1, l1: 1, l2: 1, l3: 1 },
            { key: 2, l1: 2, l2: 2, l3: 2 }
          ],
          selectedRowKeys: [0, 1, 2]
        }
      },
      {
        id: '勾选事件',
        value: {
          selectedRows: [
            { key: 0, l1: 0, l2: 0, l3: 0 },
            { key: 1, l1: 1, l2: 1, l3: 1 },
            { key: 2, l1: 2, l2: 2, l3: 2 },
            { key: 4, l1: 4, l2: 4, l3: 4 }
          ],
          selectedRowKeys: [0, 1, 2, 4]
        }
      },
      {
        id: '输出勾选数据',
        value: [0, 1, 2, 4]
      },
      {
        id: '勾选事件',
        value: {
          selectedRows: [
            { key: 0, l1: 0, l2: 0, l3: 0 },
            { key: 1, l1: 1, l2: 1, l3: 1 },
            { key: 2, l1: 2, l2: 2, l3: 2 },
            { key: 4, l1: 4, l2: 4, l3: 4 },
            { key: 10, l1: 10, l2: 10, l3: 10 }
          ],
          selectedRowKeys: [0, 1, 2, 4, 10]
        }
      },
      {
        id: '勾选事件',
        value: {
          selectedRows: [
            { key: 0, l1: 0, l2: 0, l3: 0 },
            { key: 1, l1: 1, l2: 1, l3: 1 },
            { key: 2, l1: 2, l2: 2, l3: 2 },
            { key: 4, l1: 4, l2: 4, l3: 4 },
            { key: 10, l1: 10, l2: 10, l3: 10 },
            { key: 11, l1: 11, l2: 11, l3: 11 }
          ],
          selectedRowKeys: [0, 1, 2, 4, 10, 11]
        }
      },
      {
        id: '勾选事件',
        value: {
          selectedRows: [
            { key: 0, l1: 0, l2: 0, l3: 0 },
            { key: 1, l1: 1, l2: 1, l3: 1 },
            { key: 2, l1: 2, l2: 2, l3: 2 },
            { key: 4, l1: 4, l2: 4, l3: 4 },
            { key: 10, l1: 10, l2: 10, l3: 10 },
            { key: 11, l1: 11, l2: 11, l3: 11 },
            { key: 12, l1: 12, l2: 12, l3: 12 }
          ],
          selectedRowKeys: [0, 1, 2, 4, 10, 11, 12]
        }
      },
      {
        id: '勾选事件',
        value: {
          selectedRows: [
            { key: 0, l1: 0, l2: 0, l3: 0 },
            { key: 1, l1: 1, l2: 1, l3: 1 },
            { key: 2, l1: 2, l2: 2, l3: 2 },
            { key: 4, l1: 4, l2: 4, l3: 4 },
            { key: 10, l1: 10, l2: 10, l3: 10 },
            { key: 11, l1: 11, l2: 11, l3: 11 },
            { key: 12, l1: 12, l2: 12, l3: 12 },
            { key: 13, l1: 13, l2: 13, l3: 13 }
          ],
          selectedRowKeys: [0, 1, 2, 4, 10, 11, 12, 13]
        }
      },
      {
        id: '勾选事件',
        value: {
          selectedRows: [
            { key: 0, l1: 0, l2: 0, l3: 0 },
            { key: 1, l1: 1, l2: 1, l3: 1 },
            { key: 2, l1: 2, l2: 2, l3: 2 },
            { key: 4, l1: 4, l2: 4, l3: 4 },
            { key: 10, l1: 10, l2: 10, l3: 10 },
            { key: 11, l1: 11, l2: 11, l3: 11 },
            { key: 12, l1: 12, l2: 12, l3: 12 },
            { key: 13, l1: 13, l2: 13, l3: 13 },
            { key: 5, l1: 5, l2: 5, l3: 5 }
          ],
          selectedRowKeys: [0, 1, 2, 4, 10, 11, 12, 13, 5]
        }
      },
      {
        id: '勾选事件',
        value: {
          selectedRows: [
            { key: 0, l1: 0, l2: 0, l3: 0 },
            { key: 1, l1: 1, l2: 1, l3: 1 },
            { key: 2, l1: 2, l2: 2, l3: 2 },
            { key: 4, l1: 4, l2: 4, l3: 4 },
            { key: 10, l1: 10, l2: 10, l3: 10 },
            { key: 11, l1: 11, l2: 11, l3: 11 },
            { key: 12, l1: 12, l2: 12, l3: 12 },
            { key: 13, l1: 13, l2: 13, l3: 13 },
            { key: 5, l1: 5, l2: 5, l3: 5 },
            { key: 3, l1: 3, l2: 3, l3: 3 }
          ],
          selectedRowKeys: [0, 1, 2, 4, 10, 11, 12, 13, 5, 3]
        }
      },
      {
        id: '输出勾选数据',
        value: [0, 1, 2, 4, 10, 11, 12, 13, 5, 3]
      },
      {
        id: '输出勾选数据',
        value: []
      },
      {
        id: '勾选事件',
        value: {
          selectedRows: [{ key: 0, l1: 0, l2: 0, l3: 0 }],
          selectedRowKeys: [0]
        }
      },
      {
        id: '输出勾选数据',
        value: [0]
      }
    ]);
  });

  enhancedIt('全选/全不选 检查', () => {
    dumpPreview(dump, [
      {
        selector: 'div',
        text: '已选中'
      }
    ]);

    toggleSelectAll();
    clickPaginationItem(2);
    toggleSelectAll().click();
    clickPaginationItem(1);
    toggleSelectAll();
    clickRow(5);
    toggleSelectAll();
    eventCheck([
      {
        id: '勾选事件',
        value: {
          selectedRows: [
            { key: 0, l1: 0, l2: 0, l3: 0 },
            { key: 1, l1: 1, l2: 1, l3: 1 },
            { key: 2, l1: 2, l2: 2, l3: 2 },
            { key: 3, l1: 3, l2: 3, l3: 3 },
            { key: 4, l1: 4, l2: 4, l3: 4 },
            { key: 5, l1: 5, l2: 5, l3: 5 },
            { key: 6, l1: 6, l2: 6, l3: 6 },
            { key: 7, l1: 7, l2: 7, l3: 7 },
            { key: 8, l1: 8, l2: 8, l3: 8 },
            { key: 9, l1: 9, l2: 9, l3: 9 }
          ],
          selectedRowKeys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
      },
      {
        id: '勾选事件',
        value: {
          selectedRows: [
            { key: 0, l1: 0, l2: 0, l3: 0 },
            { key: 1, l1: 1, l2: 1, l3: 1 },
            { key: 2, l1: 2, l2: 2, l3: 2 },
            { key: 3, l1: 3, l2: 3, l3: 3 },
            { key: 4, l1: 4, l2: 4, l3: 4 },
            { key: 5, l1: 5, l2: 5, l3: 5 },
            { key: 6, l1: 6, l2: 6, l3: 6 },
            { key: 7, l1: 7, l2: 7, l3: 7 },
            { key: 8, l1: 8, l2: 8, l3: 8 },
            { key: 9, l1: 9, l2: 9, l3: 9 },
            { key: 10, l1: 10, l2: 10, l3: 10 },
            { key: 11, l1: 11, l2: 11, l3: 11 },
            { key: 12, l1: 12, l2: 12, l3: 12 },
            { key: 13, l1: 13, l2: 13, l3: 13 },
            { key: 14, l1: 14, l2: 14, l3: 14 },
            { key: 15, l1: 15, l2: 15, l3: 15 },
            { key: 16, l1: 16, l2: 16, l3: 16 },
            { key: 17, l1: 17, l2: 17, l3: 17 },
            { key: 18, l1: 18, l2: 18, l3: 18 },
            { key: 19, l1: 19, l2: 19, l3: 19 }
          ],
          selectedRowKeys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
        }
      },
      {
        id: '勾选事件',
        value: {
          selectedRows: [
            { key: 0, l1: 0, l2: 0, l3: 0 },
            { key: 1, l1: 1, l2: 1, l3: 1 },
            { key: 2, l1: 2, l2: 2, l3: 2 },
            { key: 3, l1: 3, l2: 3, l3: 3 },
            { key: 4, l1: 4, l2: 4, l3: 4 },
            { key: 5, l1: 5, l2: 5, l3: 5 },
            { key: 6, l1: 6, l2: 6, l3: 6 },
            { key: 7, l1: 7, l2: 7, l3: 7 },
            { key: 8, l1: 8, l2: 8, l3: 8 },
            { key: 9, l1: 9, l2: 9, l3: 9 }
          ],
          selectedRowKeys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
      },
      {
        id: '勾选事件',
        value: {
          selectedRows: [],
          selectedRowKeys: []
        }
      },
      {
        id: '勾选事件',
        value: {
          selectedRows: [{ key: 5, l1: 5, l2: 5, l3: 5 }],
          selectedRowKeys: [5]
        }
      },
      {
        id: '勾选事件',
        value: {
          selectedRows: [
            { key: 5, l1: 5, l2: 5, l3: 5 },
            { key: 0, l1: 0, l2: 0, l3: 0 },
            { key: 1, l1: 1, l2: 1, l3: 1 },
            { key: 2, l1: 2, l2: 2, l3: 2 },
            { key: 3, l1: 3, l2: 3, l3: 3 },
            { key: 4, l1: 4, l2: 4, l3: 4 },
            { key: 6, l1: 6, l2: 6, l3: 6 },
            { key: 7, l1: 7, l2: 7, l3: 7 },
            { key: 8, l1: 8, l2: 8, l3: 8 },
            { key: 9, l1: 9, l2: 9, l3: 9 }
          ],
          selectedRowKeys: [5, 0, 1, 2, 3, 4, 6, 7, 8, 9]
        }
      }
    ]);
  });
});
