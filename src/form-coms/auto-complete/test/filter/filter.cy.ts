import dump from './dump.json';
import { dumpPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

// 选择选项函数，index为input索引，typeString为输入的字符串，itemLength为选项的数量，itemIndex为待选中选项的索引
const selectOption = (index: number, typeString: string, itemLength: number, itemIndex: number) => {
  cy.get('input').eq(index).click().type(typeString);
  // 等待选项出现，并验证选项的数量
  cy.get('.ant-select-item-option-content').should('be.visible').should('have.length', itemLength);
  // 选择特定的选项
  cy.get('.ant-select-item-option-content').eq(itemIndex).click();
};

describe('自动完成-筛选规则', () => {
  enhancedIt('各种 output 检查', () => {
    dumpPreview(dump);
    // 分别选择不同的筛选规则
    selectOption(0, 'txQ6nA', 10, 0); // None
    selectOption(1, 'pJeEXp', 11, 10); // VALUE
    selectOption(2, 'r6WajZ', 12, 11); // LABEL
    selectOption(3, 'r6WajZ', 13, 12); // ALL
    // 检查事件
    eventCheck([
      {
        id: 'none',
        value: 'txQ6nA'
      },
      {
        id: 'value',
        value: 'pJeEXp'
      },
      {
        id: 'label',
        value: 'a8sWPr'
      },
      {
        id: 'all',
        value: 'a8sWPr'
      }
    ]);
  });
});
