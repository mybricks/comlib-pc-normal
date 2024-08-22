import dump_动态图标配置检查 from './case-动态图标配置检查/dump.json';
import dump_样式配置检查 from './case-样式配置检查/dump.json';
import { dumpPreview, eventCheck, enhancedIt } from '@/../cypress/tools';

describe('图标', () => {
  enhancedIt('动态图标配置检查', () => {
    // 加载测试页面
    dumpPreview(dump_动态图标配置检查);

    // 找到包含文本“单击按钮”的按钮组件并单击
    cy.contains('button', '动态设置图标').click();

    // 截图对比
    cy.compareSnapshot('图标_动态图标检查');
  })

  enhancedIt('样式配置检查', () => {
    // 加载测试页面
    dumpPreview(dump_样式配置检查);

    // 截图对比
    cy.compareSnapshot('图标_样式配置检查');
  })
});