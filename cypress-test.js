const { execSync, exec } = require('child_process');
const axios = require('axios');
const fs = require('fs');
const os = require('os');
const path = require('path');
const glob = require('glob');

/**
 * 主函数
 */
async function main() {
  // 执行git status命令获取修改过的文件列表
  const gitStatusOutput = execSync('git status --porcelain', { encoding: 'utf-8' });

  // 将输出拆分成行，并筛选出已修改的文件，然后再筛选出所有的组件
  const modifiedComponents = [
    ...new Set(
      gitStatusOutput
        .split('\n')
        .filter((line) => line.trim().startsWith('M') || line.trim().startsWith('A'))
        .map((line) => line.trim().split(/\s+/)[1])
        .filter((filePath) => filePath.startsWith('src/'))
        .map((filePath) => filePath.match(/(src\/form-coms|src)\/(.*?)\//)[2])
    )
  ];

  if (!modifiedComponents.length) {
    beautifulLog('没有组件变动，不需要执行测试');
    return process.exit(0);
  }

  const { port, kill } = await ensureDebugServerStart();

  if (!port) {
    beautifulLog('请先启动 vscode 调试, 且配置文件选择: test.mybricks.json', 'error');
    return kill();
  }

  beautifulLog(`已修改的组件列表：${modifiedComponents.join(',')}`);
  beautifulLog('开始按需执行组件测试用例...');

  let allPass = false;
  try {
    // 按需执行 Cypress 测试
    const spec = modifiedComponents.reduce((pre, componentName) => {
      const path1 = `src/**/${componentName}/**/*.cy.{js,jsx,ts,tsx}`;
      const path2 = `src/${componentName}/**/*.cy.{js,jsx,ts,tsx}`;

      if (fileExists(path1)) pre = pre + ',' + path1;
      if (fileExists(path2)) pre = pre + ',' + path2;

      return pre;
    }, '').slice(1);

    if(spec.length === 0) {
      beautifulLog('没有可执行测试用例，不需要执行测试');
      return process.exit(0);
    }

    const command = `npx cypress run --env port=${port},check="${modifiedComponents.join(
      ' '
    )}" --spec="${spec}"`;
    
    beautifulLog(`执行命令：${command}`);
    execSync(command, {
      stdio: 'inherit'
    });

    allPass = true;
    beautifulLog('测试通过！', 'success');
  } catch (e) {
    allPass = false;
    beautifulLog('有测试用例未通过，请检查！', 'error');
  }
  kill();
  if (allPass) process.exit(0);
  else process.exit(1);
}

main();

/**
 * 获取当前的 vscode debug 服务端口
 */
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
    } catch (e) {}

    port++;
  }

  if (isFind) return port;

  return false;
}

/**
 * 好看的控制台输出
 */
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

/**
 * 获取 vscode 插件所在文件夹路径
 */
function getVscodePluginDirPath() {
  const homedir = os.homedir();

  /** vscode 插件所在文件夹 */
  const dirPath = (() => {
    const vscodeFolderPath = path.join(homedir, '.vscode/extensions');
    // 同步读取文件夹内容
    const files = fs.readdirSync(vscodeFolderPath);

    let maxVersion = 0;
    let maxVersionFile = '';

    // 遍历文件夹中的所有文件和文件夹，找出
    files.forEach((file) => {
      const regex = /^mybricks\.mybricks-(\d+\.\d+\.\d+)$/;
      const match = file.match(regex);

      if (match) {
        const version = match[1];
        const versionNumber = version
          .split('.')
          .map(Number)
          .reduce((acc, val) => acc * 1000 + val, 0);

        if (versionNumber > maxVersion) {
          maxVersion = versionNumber;
          maxVersionFile = file;
        }
      }
    });

    return `${os.homedir()}/.vscode/extensions/${maxVersionFile}`;
  })();

  const webpackConfigPath = (() => {
    const webpackConfigDirPath = path.join(
      dirPath,
      '_scripts/componentLibrary/dev/scripts/_devTemp/'
    );
    const files = fs.readdirSync(webpackConfigDirPath);

    const file = files.find((file) => file.includes('comlib_pc_normal_test_mybricks_json.js'));

    return path.join(webpackConfigDirPath, file);
  })();

  return { dirPath, webpackConfigPath };
}

/**
 * 检查 vscode debug 服务是否启动
 * 如果没有启动，则启动调试服务
 * @returns 调试服务端口号
 */
async function ensureDebugServerStart() {
  let port = await getDebugPort();
  if (port) return { port, kill: () => {} };

  // 找到 .vscode 文件夹的路径
  const { dirPath, webpackConfigPath } = getVscodePluginDirPath();

  const command = `npm run --prefix ${dirPath} dev:comlib ${webpackConfigPath}`;
  beautifulLog(`执行命令：${command}`);
  const serverProcess = exec(command, { stdio: 'ignore' });

  port = await new Promise((res, rej) => {
    const timeout = setTimeout(() => {
      rej('vscode debug 服务启动超时!');
      clearInterval(interval);
    }, 30000);

    const interval = setInterval(async () => {
      const port = await getDebugPort();
      if (port) {
        res(port);
        clearTimeout(timeout);
        clearInterval(interval);
      }
    }, 1000);
  }).catch((e) => {
    beautifulLog(e, 'error');
    return false;
  });

  return {
    port,
    kill: () => serverProcess.kill()
  };
}

// 检查是否存在指定路径的文件
function fileExists(path) {
  try {
    const files = glob.sync(path);
    return files.length > 0;
  } catch (err) {
    return false;
  }
}
