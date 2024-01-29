import toJSON from './toJSON.json';
import { toJSONPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

/**
 * 如果有复杂的场景，可以单独一个 it，甚至单独一个 toJSON
 */
describe('列表容器', () => {
  enhancedIt('各种 input 检查', () => {
    // 加载测试页面
    toJSONPreview(toJSON);

    // 点击"添加一项（末尾）"
    cy.contains('button', '添加一项（末尾）').click();
    //判断列表中是否有'文本4'
    cy.contains('span', '文本4');

    // 点击"添加一项（末尾）（值特殊类型）"
    cy.contains('button', '添加一项（末尾）（值特殊类型）').click();
    //判断列表中是否有'["文本4"]'
    cy.contains('span', '["文本4"]');

    // 添加一项（指定位置）
    cy.contains('button', '添加一项（指定位置）').click();
    //判断列表中是否有'文本1(指定位置)'
    cy.contains('span', '文本1(指定位置)');

    // 删除一项（末尾）
    cy.contains('button', '删除一项（末尾）').click();
    //判断列表中是否有'["文本4"]'，删除末尾后应该是没有的
    cy.get('span').should('not.contain','["文本4"]');

    // 删除一项（指定位置）
    cy.contains('button', '删除一项（指定位置）').click();
    //判断列表中是否有'文本1(指定位置)',删除指定位置后应该是没有的
    cy.get('span').should('not.contain','文本1(指定位置)');

    // 改动一项
    cy.contains('button', '改动一项').click();
    //判断列表中, 不存在有'文本2', 存在'文本（改动项）' 
    cy.get('span').should('not.contain','文本2');
    cy.contains('span', '文本（改动项）');

    // 上移
    cy.contains('button', '上移').click();

    // 下移
    cy.contains('button', '下移').click();
    //判断位置是否合理变化
    cy.compareSnapshot('列表容器_位置移动检查');
  });
});
