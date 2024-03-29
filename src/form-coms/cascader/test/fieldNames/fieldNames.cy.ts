import dump from './dump.json';
import { dumpPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

/**
 * @description 选择级联选择的某一项
 * @param index 
 * @param options 
 */
const selectCascaderOption = (index: number, options: string[]) => {
  cy.get('input').eq(index).click();
  cy.get('.ant-cascader-menu-item-content').should('be.visible');
  options.forEach((option) => {
    cy.contains('.ant-cascader-menu-item-content', option).click();
  });
};

describe('数据源 字段映射配置', () => {
  enhancedIt('各种 output 检查', () => {
    dumpPreview(dump, []);
    selectCascaderOption(0, ['bdJpte', 'bdJpte1']); // 默认对照
    selectCascaderOption(1, ['MaKDET', 'MaKDET1']); // 配置了字段映射
    eventCheck([
      { id: 'value', value: ['dEF4ya', 'dEF4ya1'] },
      { id: 'value1', value: ['CXGySj', 'CXGySj1'] }
    ]);
  });
});
