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

describe('输出选中节点及所有子节点的值', () => {
  enhancedIt('输出节点值 检查', () => {
    dumpPreview(dump);
    selectCascaderOption(0, ['ZheJiang', 'HangZhou']); // 默认对照
    cy.get('li[data-path-key="zhejiang__RC_CASCADER_SPLIT__hangzhou"]').children('span.ant-cascader-checkbox').click().should('have.class', 'ant-cascader-checkbox-checked')


    // eventCheck(undefined)
    eventCheck([
      { id: '值更新', value: [
        [
            "zhejiang",
            "hangzhou",
            "xihu"
        ],
        [
            "zhejiang",
            "hangzhou",
            "qiandaohu"
        ]
    ] },
    ]);
  });
});
