import toJSON from './toJSON.json';
import { toJSONPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

const performTableActions = (
  rowIndex: number,
  buttonIndex: number,
  expectedText: string,
  newRowIndex?: number
) => {
  const rowSelector = `.ant-table-tbody .ant-table-row:nth-child(${newRowIndex || rowIndex})`;
  const buttonSelector = `${rowSelector} td button`;
  const cellSelector = `${rowSelector} td.ant-table-cell`;

  cy.get(buttonSelector).eq(buttonIndex).click();
  cy.get(cellSelector).eq(0).should('have.text', expectedText);
  cy.contains('button', '获取表格数据').click();
};

describe('数据表格-动态排序(上下移,移除)', () => {
  enhancedIt('事件 检查', () => {
    toJSONPreview(toJSON);

    // 点击第一个的 下移和移除
    performTableActions(2, 1, '2');
    performTableActions(2, 2, '1');

    // 点击中间的 上移,下移和移除
    performTableActions(3, 0, '1');
    performTableActions(3, 1, '4');
    performTableActions(3, 2, '1');

    // 点击最后的 上移和移除
    performTableActions(9, 0, '9');
    // 删除最后一个 获取上一行
    performTableActions(9, 2, '9', 8);

    eventCheck([
      { id: 'length', value: 10 },
      { id: 'length', value: 9 },
      { id: 'length', value: 9 },
      { id: 'length', value: 9 },
      { id: 'length', value: 8 },
      { id: 'length', value: 8 },
      { id: 'length', value: 7 }
    ]);
  });
});
