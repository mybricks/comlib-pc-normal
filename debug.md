
  Set-Location "C:\Users\86182\.vscode\extensions\mybricks.mybricks-0.1.99"

  作用是把 PowerShell 当前目录切换到 MyBricks 插件目录。因为 babel-loader、webpack 等构建依赖安装在插件里，必须从这里启动。

  node ".\node_modules\webpack-dev-server\bin\webpack-dev-server.js" --config ".\_scripts\componentLibrary\dev\scripts\_devTemp\e_AMC_comlib_pc_normal_pub_antd5_mybricks_json.js" --no-open

  作用是启动组件库调试服务：

  - node：运行 JavaScript 文件。
  - webpack-dev-server.js：启动 Webpack 本地开发服务器。
  - --config ...：使用插件根据 pub.antd5.mybricks.json 生成的临时构建配置。
  - --no-open：服务启动后不自动打开浏览器，需要手动访问终端打印的 localhost 地址。

  这两条命令只用于调试，不会发布组件库。

  例如调试 pub.mybricks.json：

  1. 在 MyBricks 面板点击一次“调试”并选择 pub.mybricks.json。即使最后报 WMIC 错误，临时配置通常已经生成。
  2. 执行：

  Set-Location "C:\Users\86182\.vscode\extensions\mybricks.mybricks-0.1.99"

  node ".\node_modules\webpack-dev-server\bin\webpack-dev-server.js" --config ".\_scripts\componentLibrary\dev\scripts\_devTemp\e_AMC_comlib_pc_normal_pub_mybricks_json.js" --no-open

  不同 JSON 对应不同文件名：

  pub.antd5.mybricks.json
  → e_AMC_comlib_pc_normal_pub_antd5_mybricks_json.js

  pub.mybricks.json
  → e_AMC_comlib_pc_normal_pub_mybricks_json.js

  dev.mybricks.json
  → e_AMC_comlib_pc_normal_dev_mybricks_json.js

  local.mybricks.json
  → e_AMC_comlib_pc_normal_local_mybricks_json.js