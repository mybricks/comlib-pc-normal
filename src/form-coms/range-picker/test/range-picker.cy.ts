import dump_日期格式化展示 from './case-日期格式化展示/dump.json';
import { dumpPreview, enhancedIt } from '@/../cypress/tools';

describe('日期范围选择框', () => {
  enhancedIt('日期格式化展示', () => {
    // 加载测试页面
    dumpPreview(dump_日期格式化展示);

    // 截图对比
    cy.compareSnapshot('日期范围选择框_日期格式化展示');
  });
});
