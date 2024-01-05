const { execSync } = require('child_process');

const axios = require('axios');

async function getDebugPort() {
  let port = 8080;
  let isFind = false;

  for (let i = 0; i < 10; i++) {
    try {
      const response = await axios.get(`http://localhost:${port}/check-dev-server`);
      const result = response.data;

      if (
        // 确保是 vscode 插件启动的调试服务
        result.status === 'success' &&
        // 确保是当前组件库的调试服务
        result.config.namespace === 'mybricks.normal-pc' &&
        // 确保是用 test.mybricks.json 启动的调试服务
        result.config.comAry.includes('./cypress/materials/_checkpoint/com.json')
      ) {
        isFind = true;
        break;
      }

      port++;
    } catch (e) {}
  }

  if (isFind) return port;
}

function beautifulLog(msg, type = 'info') {
  msg = `\n    ${msg}\n`;

  switch (type) {
    case 'info':
      console.log('\x1b[34m%s\x1b[0m', msg);
      break;
    case 'error':
      console.error('\x1b[31m%s\x1b[0m', msg);
      break;
    case 'success':
      console.warn('\x1b[32m%s\x1b[0m', msg);
      break;
    default:
      break;
  }
}

async function main() {
  const port = await getDebugPort();

  if (!port) {
    beautifulLog('请先启动 vscode 调试, 且配置文件选择: test.mybricks.json', 'error');
    return;
  }

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
        .map((filePath) => filePath.match(/(src\/form-coms|src)\/(.*?)\//)[2])
    )
  ];

  beautifulLog(`已修改的组件列表：${modifiedComponents.join(',')}`);
  beautifulLog('开始按需执行组件测试用例...');

  try {
    // 按需执行 Cypress 测试
    const command = `npx cypress run --env port=${port},check="${modifiedComponents.join(' ')}"`;
    beautifulLog(`执行命令：${command}`);
    execSync(command, {
      stdio: 'inherit'
    });
    beautifulLog('测试通过！', 'success');
  } catch (e) {
    beautifulLog('有测试用例未通过，请检查！', 'error');
  }
}

main();
