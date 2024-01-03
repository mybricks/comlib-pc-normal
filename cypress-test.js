const { execSync } = require('child_process');

// 执行git status命令获取修改过的文件列表
const gitStatusOutput = execSync('git status --porcelain', { encoding: 'utf-8' });

// 将输出拆分成行，并筛选出已修改的文件，然后再筛选出所有的组件
const modifiedComponents = [
  ...new Set(
    gitStatusOutput
      .split('\n')
      .filter((line) => line.trim().startsWith('M'))
      .map((line) => line.trim().split(/\s+/)[1])
      .filter((filePath) => filePath.startsWith('src/'))
      .map((filePath) => filePath.match(/src\/(.*?)\//)[1])
  )
];

console.log('已修改的组件列表：', modifiedComponents);
console.log('开始按需执行组件测试用例...');

try {
  // 按需执行 Cypress 测试
  const command = `npx cypress run --env check="${modifiedComponents.join(' ')}"`;
  console.log('执行命令：', command);
  execSync(command, {
    stdio: 'inherit'
  });
} catch (e) {
  console.log('有测试用例未通过，请检查！');
}
