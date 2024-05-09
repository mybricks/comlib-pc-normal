const commonCfg = require('./webpack.common');

module.exports = Object.assign(
  {
    externals: [
      {
        // react: 'react',
        react: {
          commonjs: 'react',
          commonjs2: 'react',
          amd: 'react',
          root: 'React'
        },
        'react-dom': 'react-dom',
        antd: 'antd',
        moment: 'moment',
        '@ant-design/icons': '@ant-design/icons'
      }
    ]
  },
  commonCfg
);
