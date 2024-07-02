import dump_静态数据配置 from './case-静态数据配置/dump.json';
import { dumpPreview, enhancedIt } from '@/../cypress/tools';

describe('锚点容器', () => {
  enhancedIt('静态数据配置', () => {
    // 加载测试页面
    dumpPreview(dump_静态数据配置);

    // 截图对比
    cy.compareSnapshot('锚点容器_静态数据配置');
  });
});
