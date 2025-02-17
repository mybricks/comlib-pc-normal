const commonCfg = require('./webpack.common');

module.exports = Object.assign(
  {
    externals: [
      {
        react: 'react',
        'react-dom': 'react-dom',
        antd: 'antd',
        moment: 'dayjs',
        dayjs: 'dayjs',
        '@ant-design/icons': '@ant-design/icons'
      }
    ]
  },
  commonCfg
);
