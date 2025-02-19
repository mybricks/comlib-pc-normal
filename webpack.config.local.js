const webpack = require('webpack');
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
    ],
    plugins: [
      new webpack.DefinePlugin({
        'ANTD_VERSION': JSON.stringify(0),
      }),
    ]
  },
  commonCfg
);
