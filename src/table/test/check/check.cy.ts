import toJSON from './toJSON.json';
import { toJSONPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

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
    toJSONPreview(toJSON);

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
      { id: '勾选事件', value: [0] },
      { id: '勾选事件', value: [0, 1] },
      { id: '勾选事件', value: [0, 1, 2] },
      { id: '勾选事件', value: [0, 1, 2, 4] },
      { id: '输出勾选数据', value: [0, 1, 2, 4] },
      { id: '勾选事件', value: [0, 1, 2, 4, 10] },
      { id: '勾选事件', value: [0, 1, 2, 4, 10, 11] },
      { id: '勾选事件', value: [0, 1, 2, 4, 10, 11, 12] },
      { id: '勾选事件', value: [0, 1, 2, 4, 10, 11, 12, 13] },
      { id: '勾选事件', value: [0, 1, 2, 4, 10, 11, 12, 13, 5] },
      { id: '勾选事件', value: [0, 1, 2, 4, 10, 11, 12, 13, 5, 3] },
      { id: '输出勾选数据', value: [0, 1, 2, 4, 10, 11, 12, 13, 5, 3] },
      { id: '输出勾选数据', value: [] },
      { id: '勾选事件', value: [0] },
      { id: '输出勾选数据', value: [0] }
    ]);
  });

  enhancedIt('全选/全不选 检查', () => {
    toJSONPreview(toJSON);

    toggleSelectAll();
    clickPaginationItem(2);
    toggleSelectAll().click();
    clickPaginationItem(1);
    toggleSelectAll();
    clickRow(5);
    toggleSelectAll();
    eventCheck([
      { id: '勾选事件', value: generateArray(10) },
      { id: '勾选事件', value: generateArray(20) },
      { id: '勾选事件', value: generateArray(10) },
      { id: '勾选事件', value: generateArray(0) },
      { id: '勾选事件', value: [5] },
      { id: '勾选事件', value: [5, 0, 1, 2, 3, 4, 6, 7, 8, 9] }
    ]);
  });
});
